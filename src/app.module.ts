import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import {ConfigModule, ConfigService} from '@nestjs/config'
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/users.entity';
import { Report } from './reports/report.entity';
const cookieSession = require('cookie-session'); //cannot use 'import' for cookie session

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'sqlite',
          database: config.get<string>('DB_NAME'),
          entities: [User, Report], // Report entity added so that typeorm knows it exists
          synchronize: true
        }
      }
    }),

    UsersModule,

    ReportsModule], //end of 'imports' array value

  controllers: [AppController],

  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({whitelist: true}),
    },
  ], //end 'providers' array value
})//end of @Module decorator

export class AppModule {

//In the "@Module.imports" decorator.parameter above we setup the ConfigModule,
// now here, inside the AppModule, we can use dependency injection to link and access it so that we can use it to supply us with the environement variables in the .env.xx files.
  constructor( private configService: ConfigService){}

  configure( consumer: MiddlewareConsumer) {
    consumer
    .apply(
      cookieSession({keys: [this.configService.get('COOKIE_KEY')]})
    ).forRoutes('*');
  }
}//end of AppModule class
