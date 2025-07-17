import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
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
        userId,
        name,
        frequency,
        reminderAt: reminderAt ? new Date(reminderAt) : null,
        goal,
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
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Calcular streak e isDoneToday para cada hábito
    return habits.map(habit => {
      const { streak, isDoneToday } = this.calculateStreak(habit.habitLogs);
      return {
        ...habit,
        streak,
        isDoneToday,
      };
    });
  }

  private calculateStreak(logs: any[]) {
    const today = dayjs().startOf('day');
    const yesterday = today.subtract(1, 'day');

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

  async getDashboard(userId: string) {
    console.log('getDashboard called with userId:', userId);
    
    // Obtener todos los hábitos del usuario
    const habits = await this.findAll(userId);
    console.log('Found habits:', habits.length);
    
    // Calcular estadísticas
    const totalHabits = habits.length;
    const completedToday = habits.filter(h => h.isDoneToday).length;
    const currentStreak = Math.max(...habits.map(h => h.streak), 0);
    
    console.log('Stats:', { totalHabits, completedToday, currentStreak });
    
    // Calcular progreso semanal (últimos7as)
    const weekProgress: number[] = [];
    const today = dayjs();
    
    for (let i = 6; i >= 0; i--) {
      const date = today.subtract(i, 'day');
      const dayStart = date.startOf('day');
      
      // Para cada día, calcular qué porcentaje de hábitos fueron completados
      let completedForDay = 0;
      
      for (const habit of habits) {
        // Verificar si el hábito fue completado en este día específico
        const hasLogForDay = habit.habitLogs.some(log => 
          dayjs(log.date).startOf('day').isSame(dayStart)
        );
        
        if (hasLogForDay) {
          completedForDay++;
        }
      }
      
      // Calcular porcentaje (evitar división por cero)
      const percentage = totalHabits > 0 ? Math.round((completedForDay / totalHabits) * 100) : 0;
      weekProgress.push(percentage);
    }
    
    console.log('Week progress:', weekProgress);
    
    return {
      totalHabits,
      completedToday,
      currentStreak,
      weekProgress,
      habits: habits.map(h => ({
        id: h.id,
        title: h.name,
        subtitle: h.frequency,
        completedToday: h.isDoneToday,
        currentStreak: h.streak,
        frequency: h.frequency,
        goal: h.goal,
        createdAt: h.createdAt,
      })),
    };
  }
} 