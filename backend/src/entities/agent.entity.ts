import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Property } from './property.entity';

@Entity('agents')
export class Agent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text' })
  bio: string;

  @Column()
  photo: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @OneToMany(() => Property, (property) => property.agent)
  properties: Property[];
}
