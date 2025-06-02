import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPhotosColumnToProduct1680000000004 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE product
      ADD COLUMN photos TEXT DEFAULT NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE product
      DROP COLUMN photos
    `);
  }
}
