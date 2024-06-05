import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { Member } from './member.entity';
import { Book } from './book.entity';

@Entity()
export class BorrowedBook {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Member, member => member.borrowedBooks)
  member: Member;

  @ManyToOne(() => Book, book => book.borrowedBooks)
  book: Book;

  @CreateDateColumn()
  borrowedDate: Date;

  @Column({ nullable: true })
  returnedDate: Date;
}