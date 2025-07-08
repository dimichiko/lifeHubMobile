import { ApiProperty } from '@nestjs/swagger';

export class HabitDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  frequency: string;

  @ApiProperty({ required: false })
  reminderAt?: Date;

  @ApiProperty({ required: false })
  goal?: number;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  archived: boolean;

  @ApiProperty()
  streak: number;

  @ApiProperty()
  isDoneToday: boolean;

  @ApiProperty({ type: 'array' })
  logs: any[];
}
