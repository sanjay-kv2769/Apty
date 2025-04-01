export class CreateChildDto {
    parentId: string;
    fullName: string;
    displayName?: string;
    dateOfBirth: string;
    gender?: string;
    profilePictureUrl?: string;
    grade?: string;
    motherTongue?: string;
    learningPreferences?: any;
    pinHash: string;

    relationshipType: string;

    // Parent profile data
    parentFirstName: string;
    parentProfilePictureUrl?: string;
    preferredLanguage?: string;
}




