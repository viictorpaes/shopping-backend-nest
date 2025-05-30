import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Product } from '../product/product.entity';

@Entity('cart')
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product, { onDelete: 'CASCADE' }) // Configura onDelete para evitar erros de chave estrangeira
  @JoinColumn({ name: 'productId' }) // Define a coluna como productId
  product: Product;

  @Column()
  quantity: number;
}
