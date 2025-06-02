import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { IsNotEmpty, IsNumber, IsPositive, IsString, IsOptional, Min } from 'class-validator';

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

  @Column('decimal', { nullable: true }) // Define a coluna como opcional
  @IsOptional()
  @IsNumber()
  @Min(0)
  discount?: number; // Desconto opcional (valor mínimo: 0)

  @Column('simple-array', { nullable: true }) // Define a coluna como opcional e aceita múltiplas fotos
  photos?: string[]; // Array de URLs das fotos
}
