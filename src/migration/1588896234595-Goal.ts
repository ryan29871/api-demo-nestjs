import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class Goal1588896234595 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(
      new Table({
        name: 'goal',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
          },
          {
            name: 'title',
            type: 'varchar',
            length: '100',
          },
          {
            name: 'description',
            type: 'varchar',
            length: '100',
          },
          {
            name: 'status',
            type: 'varchar',
            length: '100',
          },
          {
            name: 'userId',
            type: 'int',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable('goal');
  }

}
