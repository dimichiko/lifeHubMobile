import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { HabitsModule } from './habits/habits.module';

@Module({
  imports: [AuthModule, HabitsModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
