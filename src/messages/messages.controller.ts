import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDTO } from './dto/create-message.dto';
import { UpdateMessageDTO } from './dto/update-message.dto';
import { PaginationDTO } from 'src/common/dto/pagination.dto';
import { ParseIntIdPipe } from 'src/common/pipes/parse-int-id.pipe';
import { AuthTokenInterceptor } from 'src/common/interceptors/auth-token.interceptor';
import { Request } from 'express';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  // returns all messages
  //@UseInterceptors(TimingConnectionInterceptor, ErrorHandlingInterceptor)
  @Get()
  @UseInterceptors(AuthTokenInterceptor)
  //                                          utilizando esse decorator com a request do express, é possível recuperar o req que pode ser definido no middleware
  findAll(@Query() pagination: PaginationDTO, @Req() req: Request) {
    console.log(req['user']);
    return this.messagesService.findAll(pagination);
  }

  //adiciona o interceptor na requisição
  //@UseInterceptors(AddHeaderInterceptor, ErrorHandlingInterceptor)
  // returns message with specified id
  // (:something/:thing)
  @Get(':id')
  @UsePipes(ParseIntIdPipe)
  findOne(@Param('id') id: number) {
    return this.messagesService.findOne(id);
  }

  @Post()
  create(@Body() createMessageDTO: CreateMessageDTO) {
    return this.messagesService.create(createMessageDTO);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMessageDTO: UpdateMessageDTO,
  ) {
    return this.messagesService.update(id, updateMessageDTO);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.messagesService.remove(id);
  }
}
