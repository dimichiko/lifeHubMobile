import { IsString, IsOptional, IsDateString, IsInt, Min } from 'class-validator';

export class CreateHabitDto {
  @IsString()
  name: string;

  @IsString()
  frequency: string; // "daily", "weekly", etc.

  @IsOptional()
  @IsDateString()
  reminderAt?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  goal?: number;
} 