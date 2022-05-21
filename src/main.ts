import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();


//2022-05-21-0802 new branch part-01-stage-02 
//2022-05-23-1651 3rd commit 
//2022-05-23-1648 2nd commit 
//2022-05-23-1647 First commit 



