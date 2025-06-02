import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDiscountColumnToProduct1680000000003 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE product
      ADD COLUMN discount DECIMAL DEFAULT NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE product
      DROP COLUMN discount
    `);
  }
}
