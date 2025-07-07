import { IsString, IsOptional, IsDateString } from 'class-validator';

export class CreateHabitLogDto {
  @IsString()
  habitId: string;

  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsString()
  note?: string;

  @IsOptional()
  @IsString()
  mood?: string;

  @IsOptional()
  energyLevel?: number;
}
