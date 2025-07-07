import { Test, TestingModule } from '@nestjs/testing';
import { HabitsController } from './habits.controller';
import { HabitsService } from './habits.service';
import { CreateHabitDto } from './dto/create-habit.dto';
import { UpdateHabitDto } from './dto/update-habit.dto';
import { CreateHabitLogDto } from './dto/create-habit-log.dto';

describe('HabitsController', () => {
  let controller: HabitsController;

  const mockHabitsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    createLog: jest.fn(),
  };

  const mockUser = {
    userId: 'user-id',
    email: 'test@example.com',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HabitsController],
      providers: [
        {
          provide: HabitsService,
          useValue: mockHabitsService,
        },
      ],
    }).compile();

    controller = module.get<HabitsController>(HabitsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a habit', async () => {
      const createHabitDto: CreateHabitDto = {
        name: 'Test Habit',
        frequency: 'daily',
        goal: 5,
      };

      const expectedResult = {
        id: 'habit-id',
        name: 'Test Habit',
        userId: 'user-id',
      };

      mockHabitsService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(mockUser, createHabitDto);

      expect(mockHabitsService.create).toHaveBeenCalledWith(
        mockUser.userId,
        createHabitDto,
      );
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findAll', () => {
    it('should return all habits for user', async () => {
      const expectedResult = [
        {
          id: 'habit-id',
          name: 'Test Habit',
          userId: 'user-id',
        },
      ];

      mockHabitsService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll(mockUser);

      expect(mockHabitsService.findAll).toHaveBeenCalledWith(mockUser.userId);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findOne', () => {
    it('should return a specific habit', async () => {
      const habitId = 'habit-id';
      const expectedResult = {
        id: habitId,
        name: 'Test Habit',
        userId: 'user-id',
      };

      mockHabitsService.findOne.mockResolvedValue(expectedResult);

      const result = await controller.findOne(mockUser, habitId);

      expect(mockHabitsService.findOne).toHaveBeenCalledWith(
        mockUser.userId,
        habitId,
      );
      expect(result).toEqual(expectedResult);
    });
  });

  describe('update', () => {
    it('should update a habit', async () => {
      const habitId = 'habit-id';
      const updateHabitDto: UpdateHabitDto = {
        name: 'Updated Habit',
        goal: 10,
      };

      const expectedResult = {
        id: habitId,
        name: 'Updated Habit',
        userId: 'user-id',
      };

      mockHabitsService.update.mockResolvedValue(expectedResult);

      const result = await controller.update(mockUser, habitId, updateHabitDto);

      expect(mockHabitsService.update).toHaveBeenCalledWith(
        mockUser.userId,
        habitId,
        updateHabitDto,
      );
      expect(result).toEqual(expectedResult);
    });
  });

  describe('remove', () => {
    it('should remove a habit', async () => {
      const habitId = 'habit-id';
      const expectedResult = {
        id: habitId,
        archived: true,
      };

      mockHabitsService.remove.mockResolvedValue(expectedResult);

      const result = await controller.remove(mockUser, habitId);

      expect(mockHabitsService.remove).toHaveBeenCalledWith(
        mockUser.userId,
        habitId,
      );
      expect(result).toEqual(expectedResult);
    });
  });

  describe('createLog', () => {
    it('should create a habit log', async () => {
      const createHabitLogDto: CreateHabitLogDto = {
        habitId: 'habit-id',
        note: 'Completed today',
      };

      const expectedResult = {
        id: 'log-id',
        habitId: 'habit-id',
        userId: 'user-id',
        date: new Date(),
      };

      mockHabitsService.createLog.mockResolvedValue(expectedResult);

      const result = await controller.createLog(mockUser, createHabitLogDto);

      expect(mockHabitsService.createLog).toHaveBeenCalledWith(
        mockUser.userId,
        createHabitLogDto,
      );
      expect(result).toEqual(expectedResult);
    });
  });
});
