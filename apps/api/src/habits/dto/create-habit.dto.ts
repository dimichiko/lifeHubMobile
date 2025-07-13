import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsArray,
} from 'class-validator';

export class CreateHabitDto {
  @IsString()
  name: string;

  @IsString()
  frequency: string;

  @IsOptional()
  @IsString()
  reminderAt?: string;

  @IsOptional()
  @IsNumber()
  goal?: number;

  @IsOptional()
  @IsBoolean()
  isRecurring?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  daysOfWeek?: string[];
}
