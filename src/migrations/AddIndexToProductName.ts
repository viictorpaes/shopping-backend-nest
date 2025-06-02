import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIndexToProductName1680000000002 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE INDEX idx_product_name ON product (name)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX idx_product_name`);
  }
}
