import {Module} from '@nestjs/common';
import {UsersModule} from 'src/users/users.module';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {CoffeesModule} from './coffees/coffees.module';
import {TypeOrmModule} from "@nestjs/typeorm";


@Module({
  controllers: [AppController],
  imports: [CoffeesModule, UsersModule, TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'localhost',
    port:  5432 ,
    username: 'postgres',
    password: 'password',
    database: 'postgres',
    autoLoadEntities: true,
    synchronize: true
  })],
  providers: [AppService],
})
export class AppModule {}
