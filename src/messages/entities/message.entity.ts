import { Person } from 'src/people/entities/person.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Message {
  //faz o id ser gerado automaticamente na base de dados
  @PrimaryGeneratedColumn()
  id: number;

  //indica que é uma coluna e os tipos dela/nela
  @Column({ type: 'varchar', length: 255 })
  text: string;

  //quando não indicado o tipo, ele pega automático
  @Column({ default: false })
  read: boolean;

  @Column()
  date: Date;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  //@ManyToOne() -> muitas mensagens podem estar relacionadas a 1 pessoa
  //                       quando apagar/atualizar - mexe com tudo que tem relação com a pessoa
  @ManyToOne(() => Person, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  //a coluna que une Person e Message
  @JoinColumn({ name: 'from' })
  from: Person;

  @ManyToOne(() => Person, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'to' })
  to: Person;
}
