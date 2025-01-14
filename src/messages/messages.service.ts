import { Injectable, NotFoundException } from '@nestjs/common';
import { Message } from './entities/message.entity';
import { CreateMessageDTO } from './dto/create-message.dto';
import { UpdateMessageDTO } from './dto/update-message.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PeopleService } from 'src/people/people.service';
import { PaginationDTO } from 'src/common/dto/pagination.dto';

@Injectable()
export class MessagesService {
  // gera acesso ao repository, ou seja, nesse caso, nossa base de dados em postgres
  // poderiamos gerar outro repositorio aqui, sem problemas, com o mesmo constructor
  constructor(
    @InjectRepository(Message)
    //fica no imports do module
    private readonly messageRepository: Repository<Message>,
    private readonly peopleRepository: PeopleService,
  ) {}

  throwNotFoundError() {
    throw new NotFoundException('Message not found');
  }

  async findAll(paginationDTO?: PaginationDTO) {
    //caso desejado, o nest poderia resolver a promisse sozinho, apenas passando o this.messageRepository.find(); no return, direto, porém, caso os dados sejam manipulados, é necessário utilizar o async/await
    //                           metodo gerado pelo typeorm, ali em cima, no constructor
    //                           que serve para acessar a base de dados de maneira "simples",
    //                           nesse caso, achando e retornando uma promisse dos results, por isso o async/await
    //    valores padrão, caso o usuário não forneça
    const { limit = 10, offset = 0 } = paginationDTO;
    const messagesResult = await this.messageRepository.find({
      //quantos registros serão exibidos
      take: limit,
      //quantos registros vão ser pulados
      skip: offset,
      relations: ['from', 'to'],
      order: { id: 'desc' },
      select: { from: { id: true, name: true }, to: { id: true, name: true } },
    });
    return messagesResult;
  }

  async findOne(id: number) {
    //o find acha dentro de um array
    //const message = this.messages.find((item) => item.id === id);
    const message = await this.messageRepository.findOne({
      //where: { id }, também funciona, e claro, o where é do sql
      where: { id: id },
      relations: ['from', 'to'],
      select: { from: { id: true, name: true }, to: { id: true, name: true } },
    });

    if (message) return message;

    //throw new HttpException('Message not found', HttpStatus.NOT_FOUND);
    this.throwNotFoundError();
  }

  async create(createMessageDTO: CreateMessageDTO) {
    const { fromId, toId } = createMessageDTO;

    const from = await this.peopleRepository.findOne(fromId);
    const to = await this.peopleRepository.findOne(toId);

    if (!from || !to) {
      throw new NotFoundException('One or both persons not found');
    }

    const newMessage = {
      text: createMessageDTO.text,
      read: false,
      date: new Date(),
      from: from,
      to: to,
    };

    const createdMessage = await this.messageRepository.create(newMessage);

    await this.messageRepository.save(createdMessage);

    return {
      ...createdMessage,
      from: {
        id: createdMessage.from.id,
      },
      to: {
        id: createdMessage.to.id,
      },
    };
  }

  async update(id: number, updateMessageDTO: UpdateMessageDTO) {
    const message = await this.findOne(id);

    message.text = updateMessageDTO?.text ?? message.text;
    message.read = updateMessageDTO?.read ?? message.read;
    await this.messageRepository.save(message);

    return message;
  }

  async remove(id: number) {
    //                                           esse já mete o where sozinho
    const message = await this.messageRepository.findOneBy({ id });

    if (!message) return this.throwNotFoundError();

    return this.messageRepository.remove(message);
  }
}
