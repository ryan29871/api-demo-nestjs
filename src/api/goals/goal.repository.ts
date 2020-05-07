import { InternalServerErrorException, Logger } from '@nestjs/common';
import { Repository, EntityRepository } from 'typeorm';
import { Goal } from './goal.entity';
import { GoalStatus } from './goal-status.enum';
import { CreateGoalDto } from './dto/create-goal.dto';
import { GetGoalsFilterDto } from './dto/get-goals-filter.dto';
import { User } from '../auth/user.entity';

@EntityRepository(Goal)
export class GoalRepository extends Repository<Goal> {
  private logger = new Logger('GoalRepository');

  async getGoals(filterDto: GetGoalsFilterDto, user: User): Promise<Goal[]> {
    const { status, search } = filterDto;
    const query = this.createQueryBuilder('goal');

    query.where('goal.userId = :userId', { userId: user.id });

    if (status) {
      query.andWhere('goal.status = :status', { status });
    }

    if (search) {
      query.andWhere('(goal.title LIKE :search OR goal.description LIKE :search)', { search: `%${search}%` });
    }

    try {
      const goals = await query.getMany();
      return goals;
    } catch (error) {
      this.logger.error(`Failed to get goals for user "${user.username}". Filters: ${JSON.stringify(filterDto)}`, error.stack);
      throw new InternalServerErrorException();
    }
  }

  async createGoal(createGoalDto: CreateGoalDto, user: User): Promise<Goal> {
    const { title, description } = createGoalDto;

    const goal = new Goal();
    goal.title = title;
    goal.description = description;
    goal.status = GoalStatus.OPEN;
    goal.user = user;

    try {
      await goal.save();
    } catch (error) {
      this.logger.error(`Failed to create a goal for user "${user.username}". Data: ${createGoalDto}`, error.stack);
      throw new InternalServerErrorException();
    }

    delete goal.user;
    return goal;
  }
}
