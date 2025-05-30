import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

@Entity('product')
export class Product {
  @PrimaryGeneratedColumn({ name: 'productId' }) // Define a coluna como productId
  productId: number;

  @Column()
  @IsNotEmpty()
  @IsString()
  name: string;

  @Column('decimal')
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  price: number;

  @Column()
  @IsNotEmpty()
  @IsString()
  description: string;
}
