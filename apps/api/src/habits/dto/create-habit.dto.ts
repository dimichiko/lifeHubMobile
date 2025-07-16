import {
  IsString,
  IsOptional,
  IsNumber,
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
}
