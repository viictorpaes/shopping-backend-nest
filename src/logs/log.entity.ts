import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('log')
export class Log {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  action: string; // Ação realizada (ex.: "CREATE_PRODUCT", "DELETE_CART_ITEM")

  @Column()
  details: string; // Detalhes da ação (ex.: "Produto criado com ID 1")

  @CreateDateColumn()
  timestamp: Date; // Data e hora da ação
}
