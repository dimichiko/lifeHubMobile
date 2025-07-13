import { ApiProperty } from '@nestjs/swagger';

export class HabitDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  frequency: string;

  @ApiProperty({ required: false })
  reminderAt?: Date | null;

  @ApiProperty({ required: false })
  goal?: number | null;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  archived: boolean;

  @ApiProperty()
  streak: number;

  @ApiProperty()
  isDoneToday: boolean;

  @ApiProperty({ type: 'array' })
  logs: any[];
}
