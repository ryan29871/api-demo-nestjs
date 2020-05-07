import { ItemStatus } from "../item-status.enum";
import { IsOptional, IsIn, IsNotEmpty } from "class-validator";

export class GetItemsFilterDto {

    @IsOptional()
    @IsIn([ItemStatus.OPEN, ItemStatus.IN_PROGRESS, ItemStatus.DONE])
    status: ItemStatus;

    @IsOptional()
    @IsNotEmpty()
    search: string;

}