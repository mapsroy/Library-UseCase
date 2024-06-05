import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Member } from '../entities/member.entity';
import { BorrowedBook } from '../entities/borrowed-book.entity';
import { Book } from '../entities/book.entity';

@Injectable()
export class MemberService {
    constructor(
        @InjectRepository(Member)
        private memberRepository: Repository<Member>,
        @InjectRepository(BorrowedBook)
        private borrowedBookRepository: Repository<BorrowedBook>,
        @InjectRepository(Book)
        private bookRepository: Repository<Book>,
      ) {}
    
      async borrowBook(memberId: number, bookId: number): Promise<void> {
        const member = await this.memberRepository.findOne({
          where: { id: memberId },
          relations: ['borrowedBooks'],
        });
        const book = await this.bookRepository.findOne({
          where: { id: bookId },
          relations: ['borrowedBooks'],
        });
    
        if (!member || !book) {
          throw new Error('Member or Book not found');
        }
    
        if (book.borrowedBooks.some(b => !b.returnedDate)) {
          throw new Error('Book is already borrowed');
        }

        // Check if member has active penalty
        if (member.penaltyUntil && member.penaltyUntil > new Date()) {
            throw new Error('Member has an active penalty and cannot borrow books until the penalty period ends.');
        }

        const borrowedBooks = member.borrowedBooks.filter(b => !b.returnedDate);
        if (borrowedBooks.length >= 2) {
            throw new Error('Member cannot borrow more than 2 books');
        }
    
        const borrowedBook = new BorrowedBook();
        borrowedBook.member = member;
        borrowedBook.book = book;
        borrowedBook.borrowedDate = new Date();
        await this.borrowedBookRepository.save(borrowedBook);
      }
    
      async returnBook(memberId: number, bookId: number): Promise<void> {
        // Find the most recent borrowed book that has not been returned
        const borrowedBooks = await this.borrowedBookRepository.find({
          where: { member: { id: memberId }, book: { id: bookId }, returnedDate: null },
          order: { borrowedDate: 'DESC' }, // Ensure we get the most recent borrowed book first
          relations: ['member', 'book'],
        });
    
        if (!borrowedBooks.length) {
          throw new Error('No borrowed book found for this member');
        }
    
        const borrowedBook = borrowedBooks[0]; // Get the most recent borrowed book
        borrowedBook.returnedDate = new Date();
        await this.borrowedBookRepository.save(borrowedBook);
    
        const borrowDuration = (new Date().getTime() - borrowedBook.borrowedDate.getTime()) / (1000 * 60 * 60 * 24);
        if (borrowDuration > 7) {
          const member = borrowedBook.member;
          member.penaltyUntil = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
          await this.memberRepository.save(member);
        }
      }
    
      async getAllMembers(): Promise<Member[]> {
        const allMembers = await this.memberRepository.find({ relations: ['borrowedBooks'] });

        // Calculate number of books being borrowed by each member
        allMembers.forEach(member => {
            member['numOfBorrowedBooks'] = member.borrowedBooks.filter(book => !book.returnedDate).length;
        });

        return allMembers;
    }
}
