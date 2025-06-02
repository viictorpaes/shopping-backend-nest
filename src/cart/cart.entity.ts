import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Product } from '../product/product.entity';

@Entity('cart') // Define a tabela como 'cart'
export class Cart {
  @PrimaryGeneratedColumn() // Define a coluna como chave primária auto-incrementada
  id: number;

  @ManyToOne(() => Product, { onDelete: 'CASCADE', nullable: false }) // Relaciona com a entidade Product
  @JoinColumn({ name: 'productId' }) // Define a coluna como 'productId'
  product: Product;

  @Column() // Define a coluna para armazenar a quantidade do produto
  quantity: number;
}
