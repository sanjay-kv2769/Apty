import { IsOptional, IsString, IsDateString } from 'class-validator';

export class UpdateChildDto {
    @IsOptional() @IsString() fullName?: string;
    @IsOptional() @IsString() displayName?: string;
    @IsOptional() @IsDateString() dateOfBirth?: string;
    @IsOptional() @IsString() gender?: string;
    @IsOptional() @IsString() profilePictureUrl?: string;
    @IsOptional() @IsString() grade?: string;
    @IsOptional() @IsString() motherTongue?: string;
    @IsOptional() learningPreferences?: any;
}
