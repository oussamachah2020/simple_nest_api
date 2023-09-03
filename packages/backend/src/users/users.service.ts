import { Injectable } from '@nestjs/common';
import { Auth, IUser } from './interface/users.interface';
import { PrismaClient } from '@prisma/client';
import { hash, compare } from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import {
  generateAccessToken,
  generateRefreshToken,
} from './utils/token.generator';
import { Request } from 'express';

const prisma = new PrismaClient();

@Injectable()
export class UsersService {
  async register(
    user: IUser
  ): Promise<{ access_token: string; refresh_token: string }> {
    const hashedPassword = await hash(user.password, 10);

    const newUser = await prisma.user.create({
      data: {
        id: uuidv4(),
        fullName: user.fullName,
        email: user.email,
        password: hashedPassword,
      },
    });

    return {
      access_token: generateAccessToken(newUser.id),
      refresh_token: generateRefreshToken(newUser.id),
    };
  }

  async login(
    user: Auth
  ): Promise<{ access_token: string; refresh_token: string }> {
    const existing_user = await prisma.user.findFirst({
      where: {
        email: user.email,
      },
    });

    const matchingPassword = await compare(
      user.password,
      existing_user.password
    );

    if (existing_user && matchingPassword) {
      return {
        access_token: generateAccessToken(existing_user.id),
        refresh_token: generateRefreshToken(existing_user.id),
      };
    }
  }

  async getUser(
    req: Request & { user: any }
  ): Promise<Pick<IUser, 'fullName' | 'email'>> {
    console.log(req.user.id);

    const getUser = await prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
      select: {
        fullName: true,
        email: true,
      },
    });

    if (getUser) {
      return getUser;
    }
  }
}
