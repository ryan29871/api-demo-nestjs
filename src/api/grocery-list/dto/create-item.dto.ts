import { IsNotEmpty } from 'class-validator';

export class CreateItemDto {

  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

}