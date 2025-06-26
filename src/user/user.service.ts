import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

 // adjust the path if needed

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getAllUsers() {
    return this.prisma.user.findMany();
  }

  async getUserById(userId: string) {
    return this.prisma.user.findUnique({
      where: { user_id: Number(userId) },
    });
  }

  // Add more methods as needed
}

