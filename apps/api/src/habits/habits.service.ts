import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateHabitDto } from './dto/create-habit.dto';
import { UpdateHabitDto } from './dto/update-habit.dto';
import { CreateHabitLogDto } from './dto/create-habit-log.dto';
import * as dayjs from 'dayjs';

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
    const habits = await this.prisma.habit.findMany({
      where: {
        userId,
        archived: false,
      },
      include: {
        habitLogs: {
          orderBy: {
            date: 'desc',
          },
          take: 30, // últimos 30 logs
        },
      },
    });

    // Calcular streak y isDoneToday para cada hábito
    const habitsWithStreak = habits.map((habit) => {
      const { streak, isDoneToday } = this.calculateStreak(habit.habitLogs);
      return {
        ...habit,
        streak,
        isDoneToday,
      };
    });

    return habitsWithStreak;
  }

  private calculateStreak(logs: any[]) {
    if (logs.length === 0) {
      return { streak: 0, isDoneToday: false };
    }

    const today = dayjs().startOf('day');
    const yesterday = dayjs().subtract(1, 'day').startOf('day');

    // Verificar si está completado hoy
    const isDoneToday = logs.some((log) =>
      dayjs(log.date).startOf('day').isSame(today),
    );

    // Calcular streak
    let streak = 0;
    let currentDate = today;

    // Si no está completado hoy, empezar desde ayer
    if (!isDoneToday) {
      currentDate = yesterday;
    }

    for (let i = 0; i < 365; i++) {
      // Máximo 1 año de streak
      const hasLogForDate = logs.some((log) =>
        dayjs(log.date).startOf('day').isSame(currentDate),
      );

      if (hasLogForDate) {
        streak++;
        currentDate = currentDate.subtract(1, 'day');
      } else {
        break;
      }
    }

    return { streak, isDoneToday };
  }

  async findOne(userId: string, id: string) {
    const habit = await this.prisma.habit.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        habitLogs: {
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

  async createLog(userId: string, createHabitLogDto: CreateHabitLogDto) {
    const { habitId, date, note, mood, energyLevel } = createHabitLogDto;

    // Verificar que el hábito pertenece al usuario
    const habit = await this.prisma.habit.findFirst({
      where: { id: habitId, userId },
    });

    if (!habit) {
      throw new NotFoundException('Habit not found');
    }

    const logDate = date ? new Date(date) : new Date();

    // Verificar si ya existe un log para esta fecha
    const existingLog = await this.prisma.habitLog.findUnique({
      where: {
        userId_habitId_date: {
          userId,
          habitId,
          date: logDate,
        },
      },
    });

    if (existingLog) {
      throw new ConflictException('Log already exists for this date');
    }

    return this.prisma.habitLog.create({
      data: {
        userId,
        habitId,
        date: logDate,
        note,
        mood,
        energyLevel,
      },
    });
  }

  async findAllLogs(userId: string) {
    return this.prisma.habitLog.findMany({
      where: {
        userId,
      },
      include: {
        habit: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        date: 'desc',
      },
    });
  }
}
