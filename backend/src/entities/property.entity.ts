import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Agent } from './agent.entity';
import { Inquiry } from './inquiry.entity';

@Entity('properties')
export class Property {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  price: number;

  @Column()
  location: string;

  @Column('simple-array', { nullable: true })
  images: string[];

  @Column({ type: 'int' })
  beds: number;

  @Column({ type: 'int' })
  baths: number;

  @Column({ type: 'int' })
  sqft: number;

  @Column()
  type: string; // e.g. "Apartment", "Villa", "Penthouse"

  @Column()
  status: string; // e.g. "Buy", "Rent", "Sold"

  @Column({ nullable: true })
  agentId: number;

  @ManyToOne(() => Agent, (agent) => agent.properties, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'agentId' })
  agent: Agent;

  @OneToMany(() => Inquiry, (inquiry) => inquiry.property)
  inquiries: Inquiry[];
}
