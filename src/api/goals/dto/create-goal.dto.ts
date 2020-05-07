import { IsNotEmpty } from 'class-validator';

export class CreateGoalDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;
}
