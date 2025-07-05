import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { HabitsService } from './habits.service';
import { AuthGuard } from '../auth/auth.guard';
import { z } from 'zod';
import { Request as ExpressRequest } from 'express';

interface AuthenticatedRequest extends ExpressRequest {
  user: {
    id: string;
    email: string;
    name: string;
  };
}

const createHabitSchema = z.object({
  name: z.string().min(1),
  frequency: z.string(),
  reminderAt: z.string().optional(),
  goal: z.number().optional(),
});

const updateHabitSchema = z.object({
  name: z.string().min(1).optional(),
  frequency: z.string().optional(),
  reminderAt: z.string().optional(),
  goal: z.number().optional(),
  archived: z.boolean().optional(),
});

const createLogSchema = z.object({
  habitId: z.string(),
  date: z.string(),
  note: z.string().optional(),
  mood: z.string().optional(),
  energyLevel: z.number().optional(),
});

@Controller('habits')
@UseGuards(AuthGuard)
export class HabitsController {
  constructor(private habitsService: HabitsService) {}

  @Get()
  async findAll(@Request() req: AuthenticatedRequest) {
    return this.habitsService.findAll(req.user.id);
  }

  @Post()
  async create(@Request() req: AuthenticatedRequest, @Body() body: unknown) {
    const data = createHabitSchema.parse(body);
    return this.habitsService.create(req.user.id, {
      ...data,
      reminderAt: data.reminderAt ? new Date(data.reminderAt) : undefined,
    });
  }

  @Put(':id')
  async update(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() body: unknown,
  ) {
    const data = updateHabitSchema.parse(body);
    return this.habitsService.update(req.user.id, id, {
      ...data,
      reminderAt: data.reminderAt ? new Date(data.reminderAt) : undefined,
    });
  }

  @Delete(':id')
  async delete(@Request() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.habitsService.delete(req.user.id, id);
  }

  @Post('logs')
  async createLog(@Request() req: AuthenticatedRequest, @Body() body: unknown) {
    const data = createLogSchema.parse(body);
    return this.habitsService.createLog(req.user.id, {
      ...data,
      date: new Date(data.date),
    });
  }

  @Get(':id/logs')
  async getLogs(@Request() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.habitsService.getLogs(req.user.id, id);
  }
}
