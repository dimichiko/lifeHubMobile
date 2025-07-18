import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { HabitsService } from './habits.service';
import { CreateHabitDto } from './dto/create-habit.dto';
import { UpdateHabitDto } from './dto/update-habit.dto';
import { CreateHabitLogDto } from './dto/create-habit-log.dto';
import { HabitDto } from './dto/habit.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

interface JwtPayload {
  userId: string;
  email: string;
}

@Controller('habits')
@UseGuards(JwtAuthGuard)
export class HabitsController {
  constructor(private readonly habitsService: HabitsService) {}

  @Post()
  create(
    @CurrentUser() user: JwtPayload,
    @Body() createHabitDto: CreateHabitDto,
  ) {
    return this.habitsService.create(user.userId, createHabitDto);
  }

  @Get()
  findAll(@CurrentUser() user: JwtPayload): Promise<HabitDto[]> {
    return this.habitsService.findAll(user.userId);
  }

  @Get('habit-logs')
  findAllLogs(@CurrentUser() user: JwtPayload) {
    return this.habitsService.findAllLogs(user.userId);
  }

  @Get('dashboard')
  getDashboard(@CurrentUser() user: JwtPayload) {
    return this.habitsService.getDashboard(user.userId);
  }

  @Get(':id')
  findOne(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.habitsService.findOne(user.userId, id);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() updateHabitDto: UpdateHabitDto,
  ) {
    return this.habitsService.update(user.userId, id, updateHabitDto);
  }

  @Delete(':id')
  remove(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.habitsService.remove(user.userId, id);
  }

  @Post('habit-logs')
  createLog(
    @CurrentUser() user: JwtPayload,
    @Body() createHabitLogDto: CreateHabitLogDto,
  ) {
    return this.habitsService.createLog(user.userId, createHabitLogDto);
  }
}
