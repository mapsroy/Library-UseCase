import { Controller, Get, Post, Param, ParseIntPipe } from '@nestjs/common';
import { MemberService } from './member.service';

@Controller('member')
export class MemberController {
    constructor(private readonly memberService: MemberService) {}

    @Get()
    getAllMembers() {
      return this.memberService.getAllMembers();
    }
  
    @Post(':memberId/borrow/:bookId')
    borrowBook(@Param('memberId', ParseIntPipe) memberId: number, @Param('bookId', ParseIntPipe) bookId: number) {
      return this.memberService.borrowBook(memberId, bookId);
    }
  
    @Post(':memberId/return/:bookId')
    returnBook(@Param('memberId', ParseIntPipe) memberId: number, @Param('bookId', ParseIntPipe) bookId: number) {
      return this.memberService.returnBook(memberId, bookId);
    }
}
