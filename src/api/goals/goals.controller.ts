import { Controller, Get, Post, Body, Param, Delete, Patch, Query, UsePipes, ValidationPipe, ParseIntPipe, UseGuards, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GoalsService } from './goals.service';
import { CreateGoalDto } from './dto/create-goal.dto';
import { Goal } from './goal.entity';
import { GoalStatus } from './goal-status.enum';
import { GetGoalsFilterDto } from './dto/get-goals-filter.dto';
import { GoalStatusValidationPipe } from './pipes/goal-status-validation.pipe';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/user.entity';

@Controller('goals')
@UseGuards(AuthGuard())
export class GoalsController {
  private logger = new Logger('GoalRepository');

  constructor(private goalsService: GoalsService) {}

  @Get()
  getGoals(@Query(ValidationPipe) filterDto: GetGoalsFilterDto, @GetUser() user: User): Promise<Goal[]> {
    this.logger.verbose(`User "${user.username}" retrieving all goals. Filters: ${JSON.stringify(filterDto)}`);
    return this.goalsService.getGoals(filterDto, user);
  }

  @Get('/:id')
  getGoalById(@Param('id', ParseIntPipe) id: number, @GetUser() user: User): Promise<Goal> {
    return this.goalsService.getGoalById(id, user);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createGoal(@Body() createGoalDto: CreateGoalDto, @GetUser() user: User): Promise<Goal> {
    this.logger.verbose(`User "${user.username}" creating a new goal. Data: ${JSON.stringify(createGoalDto)}`);
    return this.goalsService.createGoal(createGoalDto, user);
  }

  @Delete('/:id')
  deleteGoal(@Param('id', ParseIntPipe) id: number, @GetUser() user: User): Promise<void> {
    return this.goalsService.deleteGoal(id, user);
  }

  @Patch('/:id/status')
  updateGoalStatus(@Param('id', ParseIntPipe) id: number, @Body('status', GoalStatusValidationPipe) status: GoalStatus, @GetUser() user: User): Promise<Goal> {
    return this.goalsService.updateGoalStatus(id, status, user);
  }
}
