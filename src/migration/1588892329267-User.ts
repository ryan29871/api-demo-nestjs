import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class User1588892329267 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(
      new Table({
        name: 'user',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
          },
          {
            name: 'username',
            type: 'varchar',
            length: '100',
          },
          {
            name: 'password',
            type: 'varchar',
            length: '100',
          },
          {
            name: 'salt',
            type: 'varchar',
            length: '100',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable('user');
  }

}
