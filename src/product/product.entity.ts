import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('product')
export class Product {
  @PrimaryGeneratedColumn({ name: 'productId' }) // Define a coluna como productId
  productId: number;

  @Column()
  name: string;

  @Column('decimal')
  price: number;

  @Column()
  description: string;
}
