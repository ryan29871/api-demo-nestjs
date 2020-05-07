import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { GoalStatus } from './goal-status.enum';
import { User } from '../auth/user.entity';

@Entity()
export class Goal extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  status: GoalStatus;

  @ManyToOne(
    type => User,
    user => user.goals,
    { eager: false },
  )
  user: User;

  @Column()
  userId: number;
}
