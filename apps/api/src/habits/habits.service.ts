import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateHabitDto } from './dto/create-habit.dto';
import { UpdateHabitDto } from './dto/update-habit.dto';

@Injectable()
export class HabitsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createHabitDto: CreateHabitDto) {
    const { name, frequency, reminderAt, goal } = createHabitDto;

    return this.prisma.habit.create({
      data: {
        name,
        frequency,
        reminderAt: reminderAt ? new Date(reminderAt) : null,
        goal,
        userId,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.habit.findMany({
      where: {
        userId,
        archived: false,
      },
      include: {
        logs: {
          orderBy: {
            date: 'desc',
          },
          take: 30, // últimos 30 logs
        },
      },
    });
  }

  async findOne(userId: string, id: string) {
    const habit = await this.prisma.habit.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        logs: {
          orderBy: {
            date: 'desc',
          },
        },
      },
    });

    if (!habit) {
      throw new NotFoundException('Habit not found');
    }

    return habit;
  }

  async update(userId: string, id: string, updateHabitDto: UpdateHabitDto) {
    // Verificar que el hábito pertenece al usuario
    const habit = await this.prisma.habit.findFirst({
      where: { id, userId },
    });

    if (!habit) {
      throw new NotFoundException('Habit not found');
    }

    const { name, frequency, reminderAt, goal } = updateHabitDto;

    return this.prisma.habit.update({
      where: { id },
      data: {
        name,
        frequency,
        reminderAt: reminderAt ? new Date(reminderAt) : null,
        goal,
      },
    });
  }

  async remove(userId: string, id: string) {
    // Verificar que el hábito pertenece al usuario
    const habit = await this.prisma.habit.findFirst({
      where: { id, userId },
    });

    if (!habit) {
      throw new NotFoundException('Habit not found');
    }

    // Soft delete - marcar como archivado
    return this.prisma.habit.update({
      where: { id },
      data: { archived: true },
    });
  }
}
