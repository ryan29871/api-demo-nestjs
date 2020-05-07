import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Goal } from './goal.entity';
import { GoalRepository } from './goal.repository';
import { GoalStatus } from './goal-status.enum';
import { CreateGoalDto } from './dto/create-goal.dto';
import { GetGoalsFilterDto } from './dto/get-goals-filter.dto';
import { User } from '../auth/user.entity';

@Injectable()
export class GoalsService {
  constructor(
    @InjectRepository(GoalRepository)
    private goalRepository: GoalRepository,
  ) {}

  async getGoals(filterDto: GetGoalsFilterDto, user: User): Promise<Goal[]> {
    return this.goalRepository.getGoals(filterDto, user);
  }

  async getGoalById(id: number, user: User): Promise<Goal> {
    const found = await this.goalRepository.findOne({ where: { id, userId: user.id } });

    if (!found) {
      throw new NotFoundException(`Goal with ID "${id}" not found`);
    }

    return found;
  }

  async createGoal(createGoalDto: CreateGoalDto, user: User): Promise<Goal> {
    return this.goalRepository.createGoal(createGoalDto, user);
  }

  async deleteGoal(id: number, user: User): Promise<void> {
    const result = await this.goalRepository.delete({ id, userId: user.id });

    if (result.affected === 0) {
      throw new NotFoundException(`Goal with ID "${id}" not found`);
    }
  }

  async updateGoalStatus(id: number, status: GoalStatus, user: User): Promise<Goal> {
    const goal = await this.getGoalById(id, user);
    goal.status = status;
    await goal.save();
    return goal;
  }
}
