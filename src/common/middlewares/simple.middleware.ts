import { NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

//um middleware pode ser uma classe ou uma função
//ele acessa de maneira mais "crua" a req e res
export class SimpleMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const authorization = req.headers?.authorization;

    if (authorization) {
      req['user'] = {
        nome: 'teste',
        why: 'recuperado com sucesso',
        token: authorization.split(' ')[1],
      };
    }
    //tambem é possivel lançar exceções

    res.setHeader('Cabecalho', 'by middleware');

    //chama o proximo middleware
    //se utilizar "return next()" nada abaixo será executado
    next();
    //é possível executar algo aqui, mas seria executado após o(s) proximo(s) middleware(s)

    //o res.on() pode executar coisas após passar pelo controller e todo o resto
    res.on('finish', () => {});
  }
}
