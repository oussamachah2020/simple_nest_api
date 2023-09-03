import { verify } from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

const prisma = new PrismaClient();

interface DecodedTokenPayload {
  id: string;
}

export async function AuthMiddleware(
  req: Request & { user: any },
  res: Response,
  next: NextFunction
) {
  let token: string | null;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = verify(
        token,
        process.env.JWT_PRIVATE_KEY
      ) as DecodedTokenPayload;

      const user = await prisma.user.findUnique({
        where: {
          id: decoded.id,
        },
        select: {
          id: true,
        },
      });

      if (!user) {
        res.status(401);
        throw new Error('User not found');
      }

      req.user = user;

      next();
    } catch (error) {
      console.log(error);
      res.status(401);
      throw new Error('not authorized');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('not authorized, no token');
  }
}
