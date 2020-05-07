import { PipeTransform, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { GoalStatus } from '../goal-status.enum';

export class GoalStatusValidationPipe implements PipeTransform {
  readonly allowedStatuses = [GoalStatus.OPEN, GoalStatus.IN_PROGRESS, GoalStatus.DONE];
  transform(value: any, metadata: ArgumentMetadata) {
    console.log('value: ', value);
    console.log('metadata: ', metadata);

    value = value.toUpperCase();
    if (!this.isStatusValid(value)) {
      throw new BadRequestException(`"${value}" is an invalid status`);
    }

    return value;
  }

  private isStatusValid(status: any) {
    const idx = this.allowedStatuses.indexOf(status);
    return idx !== -1;
  }
}
