import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  ApiArrayEnvelope,
  ApiOkEnvelope,
} from '@core/http/swagger/api-envelope.decorator';
import { NewsService } from '@modules/content';
import {
  NewsArticleResponseDto,
  NewsReadResponseDto,
  NewsUnreadStatusResponseDto,
} from './dto/response/news-article.response.dto';
import { NewsApiMapper } from './news-api.mapper';

const READER_COOKIE = 'protravel_news_reader';
const COOKIE_MAX_AGE = 365 * 24 * 60 * 60 * 1000;

@ApiTags('news')
@Controller('news')
export class NewsController {
  constructor(private readonly news: NewsService) {}

  @Get()
  @ApiOperation({ summary: 'List published news for the mobile application' })
  @ApiArrayEnvelope(NewsArticleResponseDto)
  async list(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<NewsArticleResponseDto[]> {
    const readerId = await this.reader(request, response);
    const items = await this.news.listPublished(readerId);
    return items.map(({ article, readAt }) =>
      NewsApiMapper.toResponse(article, readAt),
    );
  }

  @Get('unread-status')
  @ApiOperation({ summary: 'Get unread news status for this reader' })
  @ApiOkEnvelope(NewsUnreadStatusResponseDto)
  async unreadStatus(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<NewsUnreadStatusResponseDto> {
    const readerId = await this.reader(request, response);
    return this.news.unreadStatus(readerId);
  }

  @Post(':newsId/read')
  @ApiOperation({ summary: 'Mark a news article as read for this reader' })
  @ApiOkEnvelope(NewsReadResponseDto)
  async markRead(
    @Param('newsId', ParseUUIDPipe) newsId: string,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<NewsReadResponseDto> {
    const readerId = await this.reader(request, response);
    const readAt = await this.news.markRead(readerId, newsId);
    return { newsId, readAt: readAt.toISOString() };
  }

  private async reader(request: Request, response: Response) {
    const candidate = this.readCookie(request.headers.cookie);
    const readerId = await this.news.resolveReader(candidate);
    if (readerId !== candidate) this.writeCookie(response, readerId);
    return readerId;
  }

  private readCookie(header?: string): string | undefined {
    return header
      ?.split(';')
      .map((part) => part.trim().split('='))
      .find(([name]) => name === READER_COOKIE)?.[1];
  }

  private writeCookie(response: Response, readerId: string): void {
    response.cookie(READER_COOKIE, readerId, {
      httpOnly: true,
      maxAge: COOKIE_MAX_AGE,
      sameSite: 'lax',
    });
  }
}
