import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

@Entity('product')
export class Product {
  @PrimaryGeneratedColumn() // Define a coluna como id
  id: number;

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
