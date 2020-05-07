import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { GoalsModule } from './goals/goals.module';
// import { UsersModule } from './users/users.module';

@Module({
  imports: [
    AuthModule,
    GoalsModule,
    // UsersModule
  ],
})
export class ApiModule { }
