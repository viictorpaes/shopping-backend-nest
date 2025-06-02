import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Product } from '../product/product.entity';

@Entity('cart')
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product, { onDelete: 'CASCADE', nullable: false }) // Configura onDelete e garante que não seja nulo
  @JoinColumn({ name: 'productId' }) // Define a coluna como productId
  product: Product;

  @Column()
  quantity: number;
}
