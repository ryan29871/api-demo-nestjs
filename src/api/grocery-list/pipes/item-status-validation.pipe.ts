import { PipeTransform, ArgumentMetadata, BadRequestException } from "@nestjs/common";
import { ItemStatus } from "../item-status.enum";

export class ItemStatusValidationPipe implements PipeTransform {
  readonly allowedStatuses = [
    ItemStatus.OPEN,
    ItemStatus.IN_PROGRESS,
    ItemStatus.DONE,
  ];
  transform(value: any, metadata: ArgumentMetadata) {
    console.log('value: ', value);
    console.log('metadata: ', metadata);

    value = value.toUpperCase();
    if (!this.isStatusValid(value)) {
      throw new BadRequestException(`"${value}" is an invalid status`)
    }

    return value;
  }

  private isStatusValid(status: any) {
    const idx = this.allowedStatuses.indexOf(status);
    return idx !== -1;
  }
}