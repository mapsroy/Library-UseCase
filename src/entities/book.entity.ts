import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { BorrowedBook } from './borrowed-book.entity';

@Entity()
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  code: string;

  @Column()
  title: string;

  @Column()
  author: string;

  @Column()
  stock: number;

  @OneToMany(() => BorrowedBook, borrowedBook => borrowedBook.book)
  borrowedBooks: BorrowedBook[];
}