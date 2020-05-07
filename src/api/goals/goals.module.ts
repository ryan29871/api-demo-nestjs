import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GoalsController } from './goals.controller';
import { GoalsService } from './goals.service';
import { GoalRepository } from './goal.repository';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([GoalRepository]), AuthModule],
  controllers: [GoalsController],
  providers: [GoalsService],
})
export class GoalsModule {}
