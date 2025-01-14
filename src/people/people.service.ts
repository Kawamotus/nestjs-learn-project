import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Person } from './entities/person.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PeopleService {
  constructor(
    @InjectRepository(Person)
    private readonly personRepository: Repository<Person>,
  ) {}

  throwNotFoundError() {
    throw new NotFoundException('People not found');
  }

  async create(createPersonDto: CreatePersonDto) {
    try {
      const personData = {
        name: createPersonDto.name,
        passwordHash: createPersonDto.password,
        email: createPersonDto.email,
      };
      const createdPerson = await this.personRepository.create(personData);
      return await this.personRepository.save(createdPerson);
    } catch (e) {
      if (e.code == 23505) {
        throw new ConflictException('O e-mail já está cadastrado');
      }
      throw e;
    }
  }

  async findAll() {
    const allPeople = await this.personRepository.find({
      order: { id: 'DESC' },
    });
    return allPeople;
  }

  async findOne(id: number) {
    const person = await this.personRepository.findOneBy({ id });
    if (!person) {
      throw new NotFoundException('Person not founded');
    }
    return person;
  }

  async update(id: number, updatePersonDto: UpdatePersonDto) {
    const personData = {
      name: updatePersonDto?.name,
      passwordHash: updatePersonDto?.password,
    };
    const findPerson = await this.personRepository.preload({
      id,
      ...personData,
    });

    if (!findPerson) {
      this.throwNotFoundError();
    }
    return await this.personRepository.save(findPerson);
  }

  async remove(id: number) {
    const person = await this.personRepository.findOne({ where: { id } });
    if (!person) {
      this.throwNotFoundError();
    }
    await this.personRepository.remove(person);

    return `person ${person.name} has been deleted`;
  }
}
