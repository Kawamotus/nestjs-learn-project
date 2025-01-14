import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    //whitelist = remove chaves que não estão no dto, ou seja, não permite campos que não tenham sido esperados anteriormente
    //forbidNonWhitelisted = devolve um erro quando tenta passar um campo que não existe
    //transform = tenta forçar o param a virar o dado esperado (quando possível) - talvez n seja bom usar, perde performance
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: false,
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
