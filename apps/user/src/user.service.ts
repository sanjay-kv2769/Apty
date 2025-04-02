import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateChildDto } from './dto/createChild.dto';
import { DatabaseService as PrismaService } from 'libs/database/database.service';
import { RpcException } from '@nestjs/microservices';
import { UpdateChildDto } from './dto/dto/updateChild.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
  ) { }


  //--------------------------- Parent and 1st Registration  ---------------------------
  async createChild(
    data: CreateChildDto,
    parentId: string,
    relationshipType: string
  ) {
    const {
      fullName,
      displayName,
      dateOfBirth,
      gender,
      grade,
      profilePictureUrl,
      motherTongue,
      learningPreferences,
      pinHash,
      parentFirstName,
      parentProfilePictureUrl,
      preferredLanguage,
    } = data;

    const childId = uuidv4();
    // Check if the parent exists
    const existingParent = await this.prisma.parent.findUnique({
      where: { id: parentId }
    });

    if (!existingParent) {
      throw new Error("Parent does not exist.");
    }

    // Check if a child with the same fullName already exists for this parent
    const existingChild = await this.prisma.child.findFirst({
      where: {
        fullName,
        parent: { id: parentId }
      }
    });

    if (existingChild) {
      throw new Error("A child with the same full name already exists for this parent.");
    }

    return this.prisma.$transaction(async (tx) => {
      // 1. Create child
      const child = await tx.child.create({
        data: {
          id: childId,
          fullName,
          displayName,
          dateOfBirth: new Date(dateOfBirth),
          gender,
          profilePictureUrl,
          grade,
          motherTongue,
          learningPreferences,
          parent: {
            connect: { id: parentId }
          }
        }
      });
      // 2. Create ParentChildRelationship
      await tx.parentChildRelationship.create({
        data: {
          parentId,
          childId,
          relationshipType,
          isPrimary: true
        }
      });
      // 3. Upsert ParentProfile
      await tx.parentProfile.upsert({
        where: { parentId },
        update: {
          firstName: parentFirstName,
          profilePictureUrl: parentProfilePictureUrl,
          preferredLanguage: preferredLanguage || 'en'
        },
        create: {
          parentId,
          firstName: parentFirstName,
          profilePictureUrl: parentProfilePictureUrl,
          preferredLanguage: preferredLanguage || 'en'
        }
      });
      // 4. Update pinHash in Parent table
      await tx.parent.update({
        where: { id: parentId },
        data: { pinHash }
      });
      return {
        message: 'Registration successful.',
        child
      };
    });
  }

  //--------------------------- Additional Child Registration ---------------------------
  async addAdditionalChild(
    data: CreateChildDto,
    parentId: string,
    relationshipType: string
  ) {
    const {
      fullName,
      displayName,
      dateOfBirth,
      gender,
      grade,
      profilePictureUrl,
      motherTongue,
      learningPreferences,
    } = data;

    const childId = uuidv4();

    // 1. Check if parent exists
    const existingParent = await this.prisma.parent.findUnique({
      where: { id: parentId },
    });

    if (!existingParent) {
      throw new Error('Parent does not exist.');
    }

    // 2. Check for duplicate child name under the same parent
    const existingChild = await this.prisma.child.findFirst({
      where: {
        fullName,
        parent: { id: parentId },
      },
    });

    if (existingChild) {
      throw new Error(
        'A child with the same full name already exists for this parent.'
      );
    }

    // 3. Transaction: Create child and relationship only
    return this.prisma.$transaction(async (tx) => {
      const child = await tx.child.create({
        data: {
          id: childId,
          fullName,
          displayName,
          dateOfBirth: new Date(dateOfBirth),
          gender,
          profilePictureUrl,
          grade,
          motherTongue,
          learningPreferences,
          parent: {
            connect: { id: parentId },
          },
        },
      });

      await tx.parentChildRelationship.create({
        data: {
          parentId,
          childId,
          relationshipType,
          isPrimary: true, // optional: if not the first child
        },
      });

      return {
        message: 'Additional child added successfully.',
        child,
      };
    });
  }

  //  --------------------------- Parent updates their child's profile ---------------------------
  async updateChildByParent(childId: string, parentId: string, updates: UpdateChildDto) {
    const child = await this.prisma.child.findFirst({
      where: { id: childId, parentId },
    });

    if (!child) {
      throw new RpcException('Child not found for this parent.');
    }

    // Check if the forbidden fields are in the updates object
    const forbiddenFields = Object.keys(updates).filter(key => key === 'id' || key === 'parentId');

    if (forbiddenFields.length > 0) {
      throw new RpcException(`Cannot update restricted fields: ${forbiddenFields.join(', ')}`);
    }

    const filteredUpdates = Object.keys(updates)
      .filter(key => key !== 'id' && key !== 'parentId') // Exclude 'id' and 'parentId'
      .reduce((obj, key) => {
        obj[key] = updates[key];
        return obj;
      }, {} as Partial<UpdateChildDto>);

    return this.prisma.child.update({
      where: { id: childId },
      data: filteredUpdates,
    });
  }


}
