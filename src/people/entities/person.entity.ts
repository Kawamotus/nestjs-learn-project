import { IsEmail } from 'class-validator';
import { Message } from 'src/messages/entities/message.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Person {
  @PrimaryGeneratedColumn()
  id: number;

  //força a não existir emails repetidos
  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column({ length: 255 })
  passwordHash: string;

  @Column({ length: 100 })
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  //relação de uma pessoa poder enviar muitas mensagens como "from"
  //messages relacionadas ao campo "from" na entidade message
  @OneToMany(() => Message, (message) => message.from)
  messagesSended: Message[];

  //relação de uma pessoa poder receber muitas mensagens como "to"
  //messages relacionadas ao campo "to" na entidade message
  @OneToMany(() => Message, (message) => message.to)
  messagesReceived: Message[];
}
