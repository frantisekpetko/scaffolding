import { ArrayNotEmpty, IsNotEmpty } from 'class-validator';

export class Column {
  @IsNotEmpty()
  nameOfColumn: string;

  @IsNotEmpty()
  datatype: string;

  @IsNotEmpty()
  notNull: boolean;

  @IsNotEmpty()
  unique: boolean;

  @IsNotEmpty()
  index: boolean;
}

export class Relationship {
  @IsNotEmpty()
  type: string;

  @IsNotEmpty()
  table: string;
}

export class Data {
  @IsNotEmpty()
  name: string;

  @ArrayNotEmpty()
  columns: Column[];

  @ArrayNotEmpty()
  relationships: Relationship[];

  @IsNotEmpty()
  originalEntityName?: string;

  @IsNotEmpty()
  isEditedEntity?: boolean;
}
