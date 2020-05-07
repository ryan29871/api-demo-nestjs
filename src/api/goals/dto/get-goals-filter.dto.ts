import { GoalStatus } from '../goal-status.enum';
import { IsOptional, IsIn, IsNotEmpty } from 'class-validator';

export class GetGoalsFilterDto {
  @IsOptional()
  @IsIn([GoalStatus.OPEN, GoalStatus.IN_PROGRESS, GoalStatus.DONE])
  status: GoalStatus;

  @IsOptional()
  @IsNotEmpty()
  search: string;
}
