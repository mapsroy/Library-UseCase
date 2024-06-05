import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from '../entities/book.entity';
import { BorrowedBook } from '../entities/borrowed-book.entity';


@Injectable()
export class BookService {
    constructor(
        @InjectRepository(Book)
        private bookRepository: Repository<Book>,
        @InjectRepository(BorrowedBook)
        private borrowedBookRepository: Repository<BorrowedBook>,
      ) {}
    
      async getAllBooks(): Promise<Book[]> {
        const allBooks = await this.bookRepository.find();
        const borrowedBooks = await this.borrowedBookRepository.find({
            relations: ['book'],
        });

        // Filter out borrowed books
        const availableBooks = allBooks.filter(book => {
            const isBorrowed = borrowedBooks.some(borrowedBook => borrowedBook.book.id === book.id && !borrowedBook.returnedDate);
            return !isBorrowed;
        });

        return availableBooks;
    }
}
