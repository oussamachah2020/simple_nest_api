import { Injectable } from '@nestjs/common';
import { IPost } from './interface/posts.interface';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { Request } from 'express';

const prisma = new PrismaClient();

@Injectable()
export class PostsService {
  async createPost(req: Request & { user: any }, post: IPost): Promise<any> {
    const newPost = await prisma.posts.create({
      data: {
        id: uuidv4(),
        title: post.title,
        content: post.content,
        authorId: req.user.id,
        created_at: new Date(),
        updated_at: new Date(),
      },
      select: {
        title: true,
        content: true,
        updated_at: true,
        created_at: true,
        author: {
          select: {
            fullName: true,
            email: true,
          },
        },
      },
    });

    if (newPost) {
      return newPost;
    }
  }

  async updatePost(req: Request & { user: any }, post: IPost): Promise<any> {
    const updatedPost = await prisma.posts.updateMany({
      where: {
        authorId: req.user.id,
      },
      data: {
        title: post.title,
        content: post.content,
        updated_at: new Date(),
      },
    });
    if (updatedPost) {
      return updatedPost;
    }
  }

  // async deletePost(req: Request & { user: any }): Promise<any> {
  //   const deletedPost = await prisma.posts.delete({
  //     where: {
  //       id: ""
  //     }
  //   })
  // }
}
