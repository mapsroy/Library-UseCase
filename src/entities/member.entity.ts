import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { BorrowedBook } from './borrowed-book.entity';

@Entity()
export class Member {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  code: string;

  @Column()
  name: string;

  @OneToMany(() => BorrowedBook, borrowedBook => borrowedBook.member)
  borrowedBooks: BorrowedBook[];
  
  @Column({ type: 'timestamp', nullable: true })
  penaltyUntil: Date;
  
}