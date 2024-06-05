import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from './entities/member.entity';
import { Book } from './entities/book.entity';
import { BorrowedBook } from './entities/borrowed-book.entity';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MemberService } from './member/member.service';
import { BookService } from './book/book.service';
import { MemberController } from './member/member.controller';
import { BookController } from './book/book.controller';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'library',
      entities: [Member, Book, BorrowedBook],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Member, Book, BorrowedBook]),
  ],
  controllers: [AppController, MemberController, BookController],
  providers: [AppService, MemberService, BookService],
})
export class AppModule {}
