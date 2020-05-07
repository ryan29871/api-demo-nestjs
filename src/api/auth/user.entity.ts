import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, Unique, OneToMany } from 'typeorm';
import { hash } from 'bcryptjs';
import { Goal } from '../goals/goal.entity';

@Entity()
@Unique(['username'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  salt: string;

  @OneToMany(
    type => Goal,
    goal => goal.user,
    { eager: true },
  )
  goals: Goal[];

  async validatePassword(password: string): Promise<boolean> {
    const hashedPassword = await hash(password, this.salt);
    return hashedPassword === this.password;
  }
}
