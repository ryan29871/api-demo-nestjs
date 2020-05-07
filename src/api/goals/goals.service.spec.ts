import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { GoalsService } from './goals.service';
import { GoalRepository } from './goal.repository';
import { GoalStatus } from './goal-status.enum';
import { GetGoalsFilterDto } from './dto/get-goals-filter.dto';

const mockUser = { id: 12, username: 'Test user' };

const mockGoalRepository = () => ({
  getGoals: jest.fn(),
  findOne: jest.fn(),
  createGoal: jest.fn(),
  delete: jest.fn(),
});

describe('GoalsService', () => {
  let goalsService;
  let goalRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GoalsService,
        { provide: GoalRepository, useFactory: mockGoalRepository },
      ],
    }).compile();

    goalsService = await module.get<GoalsService>(GoalsService);
    goalRepository = await module.get<GoalRepository>(GoalRepository);
  });

  describe('getGoals', () => {
    it('gets all goals from the repository', async () => {
      goalRepository.getGoals.mockResolvedValue('someValue');

      expect(goalRepository.getGoals).not.toHaveBeenCalled();
      const filters: GetGoalsFilterDto = { status: GoalStatus.IN_PROGRESS, search: 'Some search query' };
      const result = await goalsService.getGoals(filters, mockUser);
      expect(goalRepository.getGoals).toHaveBeenCalled();
      expect(result).toEqual('someValue');
    });
  });

  describe('getGoalById', () => {
    it('calls goalRepository.findOne() and succesffuly retrieve and return the goal', async () => {
      const mockGoal = { title: 'Test goal', description: 'Test desc' };
      goalRepository.findOne.mockResolvedValue(mockGoal);

      const result = await goalsService.getGoalById(1, mockUser);
      expect(result).toEqual(mockGoal);

      expect(goalRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: 1,
          userId: mockUser.id,
        },
      });
    });

    it('throws an error as goal is not found', () => {
      goalRepository.findOne.mockResolvedValue(null);
      expect(goalsService.getGoalById(1, mockUser)).rejects.toThrow(NotFoundException);
    });
  });

  describe('createGoal', () => {
    it('calls goalRepository.create() and returns the result', async () => {
      goalRepository.createGoal.mockResolvedValue('someGoal');

      expect(goalRepository.createGoal).not.toHaveBeenCalled();
      const createGoalDto = { title: 'Test goal', description: 'Test desc' };
      const result = await goalsService.createGoal(createGoalDto, mockUser);
      expect(goalRepository.createGoal).toHaveBeenCalledWith(createGoalDto, mockUser);
      expect(result).toEqual('someGoal');
    });
  });

  describe('deleteGoal', () => {
    it('calls goalRepository.deleteGoal() to delete a goal', async () => {
      goalRepository.delete.mockResolvedValue({ affected: 1 });
      expect(goalRepository.delete).not.toHaveBeenCalled();
      await goalsService.deleteGoal(1, mockUser);
      expect(goalRepository.delete).toHaveBeenCalledWith({ id: 1, userId: mockUser.id });
    });

    it('throws an error as goal could not be found', () => {
      goalRepository.delete.mockResolvedValue({ affected: 0 });
      expect(goalsService.deleteGoal(1, mockUser)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateGoalStatus', () => {
    it('updates a goal status', async () => {
      const save = jest.fn().mockResolvedValue(true);

      goalsService.getGoalById = jest.fn().mockResolvedValue({
        status: GoalStatus.OPEN,
        save,
      });

      expect(goalsService.getGoalById).not.toHaveBeenCalled();
      expect(save).not.toHaveBeenCalled();
      const result = await goalsService.updateGoalStatus(1, GoalStatus.DONE, mockUser);
      expect(goalsService.getGoalById).toHaveBeenCalled();
      expect(save).toHaveBeenCalled();
      expect(result.status).toEqual(GoalStatus.DONE);
    });
  });

});