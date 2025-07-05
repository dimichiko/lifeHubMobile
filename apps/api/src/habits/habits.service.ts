import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HabitsService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string) {
    return this.prisma.habit.findMany({
      where: { userId, archived: false },
      include: {
        logs: {
          orderBy: { date: 'desc' },
          take: 30, // últimos 30 logs
        },
      },
    });
  }

  async create(
    userId: string,
    data: { name: string; frequency: string; reminderAt?: Date; goal?: number },
  ) {
    return this.prisma.habit.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  async update(
    userId: string,
    habitId: string,
    data: {
      name?: string;
      frequency?: string;
      reminderAt?: Date;
      goal?: number;
      archived?: boolean;
    },
  ) {
    // Verificar que el hábito pertenece al usuario
    const habit = await this.prisma.habit.findFirst({
      where: { id: habitId, userId },
    });

    if (!habit) {
      throw new NotFoundException('Habit not found');
    }

    return this.prisma.habit.update({
      where: { id: habitId },
      data,
    });
  }

  async delete(userId: string, habitId: string) {
    // Verificar que el hábito pertenece al usuario
    const habit = await this.prisma.habit.findFirst({
      where: { id: habitId, userId },
    });

    if (!habit) {
      throw new NotFoundException('Habit not found');
    }

    // Soft delete - marcar como archivado
    return this.prisma.habit.update({
      where: { id: habitId },
      data: { archived: true },
    });
  }

  async createLog(
    userId: string,
    data: {
      habitId: string;
      date: Date;
      note?: string;
      mood?: string;
      energyLevel?: number;
    },
  ) {
    // Verificar que el hábito pertenece al usuario
    const habit = await this.prisma.habit.findFirst({
      where: { id: data.habitId, userId },
    });

    if (!habit) {
      throw new NotFoundException('Habit not found');
    }

    // Verificar que no existe un log para la misma fecha
    const existingLog = await this.prisma.habitLog.findFirst({
      where: {
        userId,
        habitId: data.habitId,
        date: data.date,
      },
    });

    if (existingLog) {
      throw new ForbiddenException('Log already exists for this date');
    }

    return this.prisma.habitLog.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  async getLogs(userId: string, habitId: string) {
    // Verificar que el hábito pertenece al usuario
    const habit = await this.prisma.habit.findFirst({
      where: { id: habitId, userId },
    });

    if (!habit) {
      throw new NotFoundException('Habit not found');
    }

    return this.prisma.habitLog.findMany({
      where: { userId, habitId },
      orderBy: { date: 'desc' },
    });
  }
}
