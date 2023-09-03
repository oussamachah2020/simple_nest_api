import { Body, Controller, Post, Put, Req } from '@nestjs/common';
import { Request } from 'express';
import { PostsService } from './posts.service';
import { IPost } from './interface/posts.interface';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Post('create')
  createPost(@Req() req: Request & { user: any }, @Body() post: IPost) {
    return this.postsService.createPost(req, post);
  }

  @Put('update-post')
  updatePost(@Req() req: Request & { user: any }, @Body() post: IPost) {
    return this.postsService.updatePost(req, post);
  }
}
