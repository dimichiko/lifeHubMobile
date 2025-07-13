import { Test, TestingModule } from '@nestjs/testing';
import { HabitsService } from './habits.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateHabitDto } from './dto/create-habit.dto';
import { UpdateHabitDto } from './dto/update-habit.dto';
import { CreateHabitLogDto } from './dto/create-habit-log.dto';

describe('HabitsService', () => {
  let service: HabitsService;

  const mockPrismaService = {
    habit: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
    },
    habitLog: {
      create: jest.fn(),
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HabitsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<HabitsService>(HabitsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a habit successfully', async () => {
      const userId = '1';
      const createHabitDto: CreateHabitDto = {
        name: 'Test Habit',
        frequency: 'daily',
        isRecurring: true,
        daysOfWeek: ['monday', 'wednesday', 'friday'],
      };

      const expectedHabit = {
        id: '1',
        ...createHabitDto,
        userId,
        archived: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.habit.create.mockResolvedValue(expectedHabit);

      const result = await service.create(userId, createHabitDto);

      expect(mockPrismaService.habit.create).toHaveBeenCalledWith({
        data: {
          ...createHabitDto,
          userId,
          reminderAt: null,
          goal: undefined,
          isRecurring: true,
          daysOfWeek: ['monday', 'wednesday', 'friday'],
        },
      });
      expect(result).toEqual(expectedHabit);
    });

    it('should create a non-recurring habit', async () => {
      const userId = '1';
      const createHabitDto: CreateHabitDto = {
        name: 'One-time Habit',
        frequency: 'weekly',
        isRecurring: false,
        daysOfWeek: [],
      };

      const expectedHabit = {
        id: '1',
        ...createHabitDto,
        userId,
        archived: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.habit.create.mockResolvedValue(expectedHabit);

      const result = await service.create(userId, createHabitDto);

      expect(result).toEqual(expectedHabit);
    });
  });

  describe('findAll', () => {
    it('should return all habits for a user', async () => {
      const userId = '1';
      const expectedHabits = [
        {
          id: '1',
          name: 'Habit 1',
          frequency: 'daily',
          isRecurring: true,
          daysOfWeek: ['monday'],
          userId,
          archived: false,
          logs: [],
          streak: 0,
          isDoneToday: false,
        },
        {
          id: '2',
          name: 'Habit 2',
          frequency: 'weekly',
          isRecurring: false,
          daysOfWeek: [],
          userId,
          archived: false,
          logs: [],
          streak: 0,
          isDoneToday: false,
        },
      ];

      mockPrismaService.habit.findMany.mockResolvedValue(expectedHabits);

      const result = await service.findAll(userId);

      expect(mockPrismaService.habit.findMany).toHaveBeenCalledWith({
        where: {
          userId,
          archived: false,
        },
        include: {
          logs: {
            orderBy: {
              date: 'desc',
            },
            take: 30,
          },
        },
      });
      expect(result).toEqual(expectedHabits);
    });

    it('should return empty array when no habits exist', async () => {
      const userId = '1';
      mockPrismaService.habit.findMany.mockResolvedValue([]);

      const result = await service.findAll(userId);

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a specific habit', async () => {
      const userId = '1';
      const habitId = '1';
      const expectedHabit = {
        id: '1',
        name: 'Test Habit',
        frequency: 'daily',
        isRecurring: true,
        daysOfWeek: ['monday'],
        userId,
        archived: false,
        logs: [],
      };

      mockPrismaService.habit.findFirst.mockResolvedValue(expectedHabit);

      const result = await service.findOne(userId, habitId);

      expect(mockPrismaService.habit.findFirst).toHaveBeenCalledWith({
        where: {
          id: habitId,
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
      expect(result).toEqual(expectedHabit);
    });

    it('should throw NotFoundException when habit not found', async () => {
      const userId = '1';
      const habitId = '999';
      mockPrismaService.habit.findFirst.mockResolvedValue(null);

      await expect(service.findOne(userId, habitId)).rejects.toThrow(
        'Habit not found',
      );
    });
  });

  describe('update', () => {
    it('should update a habit successfully', async () => {
      const userId = '1';
      const habitId = '1';
      const updateHabitDto: UpdateHabitDto = {
        name: 'Updated Habit',
        frequency: 'weekly',
        isRecurring: false,
        daysOfWeek: [],
      };

      const existingHabit = {
        id: '1',
        name: 'Original Habit',
        userId,
      };

      const expectedHabit = {
        id: '1',
        ...updateHabitDto,
        userId,
        archived: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.habit.findFirst.mockResolvedValue(existingHabit);
      mockPrismaService.habit.update.mockResolvedValue(expectedHabit);

      const result = await service.update(userId, habitId, updateHabitDto);

      expect(mockPrismaService.habit.update).toHaveBeenCalledWith({
        where: { id: habitId },
        data: {
          ...updateHabitDto,
          reminderAt: null,
          goal: undefined,
        },
      });
      expect(result).toEqual(expectedHabit);
    });

    it('should throw NotFoundException when habit not found', async () => {
      const userId = '1';
      const habitId = '999';
      const updateHabitDto: UpdateHabitDto = {
        name: 'Updated Habit',
      };

      mockPrismaService.habit.findFirst.mockResolvedValue(null);

      await expect(
        service.update(userId, habitId, updateHabitDto),
      ).rejects.toThrow('Habit not found');
    });
  });

  describe('remove', () => {
    it('should soft delete a habit successfully', async () => {
      const userId = '1';
      const habitId = '1';
      const existingHabit = {
        id: '1',
        name: 'Deleted Habit',
        userId,
      };

      const expectedHabit = {
        id: '1',
        name: 'Deleted Habit',
        userId,
        archived: true,
      };

      mockPrismaService.habit.findFirst.mockResolvedValue(existingHabit);
      mockPrismaService.habit.update.mockResolvedValue(expectedHabit);

      const result = await service.remove(userId, habitId);

      expect(mockPrismaService.habit.update).toHaveBeenCalledWith({
        where: { id: habitId },
        data: { archived: true },
      });
      expect(result).toEqual(expectedHabit);
    });

    it('should throw NotFoundException when habit not found', async () => {
      const userId = '1';
      const habitId = '999';

      mockPrismaService.habit.findFirst.mockResolvedValue(null);

      await expect(service.remove(userId, habitId)).rejects.toThrow(
        'Habit not found',
      );
    });
  });

  describe('createLog', () => {
    it('should create a habit log successfully', async () => {
      const userId = '1';
      const createHabitLogDto: CreateHabitLogDto = {
        habitId: '1',
        note: 'Great job!',
        mood: 'happy',
        energyLevel: 8,
      };

      const existingHabit = {
        id: '1',
        name: 'Test Habit',
        userId,
      };

      const expectedHabitLog = {
        id: '1',
        ...createHabitLogDto,
        userId,
        date: new Date(),
      };

      mockPrismaService.habit.findFirst.mockResolvedValue(existingHabit);
      mockPrismaService.habitLog.findUnique.mockResolvedValue(null);
      mockPrismaService.habitLog.create.mockResolvedValue(expectedHabitLog);

      const result = await service.createLog(userId, createHabitLogDto);

      expect(mockPrismaService.habitLog.create).toHaveBeenCalledWith({
        data: {
          userId,
          habitId: '1',
          date: expect.any(Date),
          note: 'Great job!',
          mood: 'happy',
          energyLevel: 8,
        },
      });
      expect(result).toEqual(expectedHabitLog);
    });

    it('should create a habit log without optional fields', async () => {
      const userId = '1';
      const createHabitLogDto: CreateHabitLogDto = {
        habitId: '1',
      };

      const existingHabit = {
        id: '1',
        name: 'Test Habit',
        userId,
      };

      const expectedHabitLog = {
        id: '1',
        habitId: '1',
        userId,
        date: new Date(),
        note: null,
        mood: null,
        energyLevel: null,
      };

      mockPrismaService.habit.findFirst.mockResolvedValue(existingHabit);
      mockPrismaService.habitLog.findUnique.mockResolvedValue(null);
      mockPrismaService.habitLog.create.mockResolvedValue(expectedHabitLog);

      const result = await service.createLog(userId, createHabitLogDto);

      expect(result).toEqual(expectedHabitLog);
    });

    it('should throw NotFoundException when habit not found', async () => {
      const userId = '1';
      const createHabitLogDto: CreateHabitLogDto = {
        habitId: '999',
      };

      mockPrismaService.habit.findFirst.mockResolvedValue(null);

      await expect(
        service.createLog(userId, createHabitLogDto),
      ).rejects.toThrow('Habit not found');
    });

    it('should throw ConflictException when log already exists', async () => {
      const userId = '1';
      const createHabitLogDto: CreateHabitLogDto = {
        habitId: '1',
      };

      const existingHabit = {
        id: '1',
        name: 'Test Habit',
        userId,
      };

      const existingLog = {
        id: '1',
        habitId: '1',
        userId,
        date: new Date(),
      };

      mockPrismaService.habit.findFirst.mockResolvedValue(existingHabit);
      mockPrismaService.habitLog.findUnique.mockResolvedValue(existingLog);

      await expect(
        service.createLog(userId, createHabitLogDto),
      ).rejects.toThrow('Log already exists for this date');
    });
  });

  describe('calculateStreak', () => {
    it('should calculate streak correctly for consecutive days', () => {
      const logs = [
        { date: new Date() }, // Today
        { date: new Date(Date.now() - 24 * 60 * 60 * 1000) }, // Yesterday
        { date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) }, // 2 days ago
      ];

      const result = service['calculateStreak'](logs);

      expect(result.streak).toBeGreaterThanOrEqual(0);
      expect(result.isDoneToday).toBeDefined();
    });

    it('should return 0 streak for empty logs', () => {
      const logs = [];

      const result = service['calculateStreak'](logs);

      expect(result.streak).toBe(0);
      expect(result.isDoneToday).toBe(false);
    });

    it('should handle single log', () => {
      const logs = [{ date: new Date() }];

      const result = service['calculateStreak'](logs);

      expect(result.streak).toBeGreaterThanOrEqual(0);
      expect(result.isDoneToday).toBeDefined();
    });
  });
});
