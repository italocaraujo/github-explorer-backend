import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { AppModule } from './app.module';
import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { AxiosError } from 'axios';
import 'dotenv/config';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    
    if (exception instanceof AxiosError) {
      console.error('GitHub API Error:', {
        status: exception.response?.status,
        data: exception.response?.data,
        headers: exception.config?.headers
      });

      response.status(exception.response?.status || 500).json({
        statusCode: exception.response?.status || 500,
        message: 'Erro na comunicação com a API do GitHub',
        ...(process.env.NODE_ENV !== 'production' && {
          details: exception.response?.data
        })
      });
    } else if (exception instanceof HttpException) {
      response.status(exception.getStatus()).json(exception.getResponse());
    } else {
      console.error('Erro inesperado:', exception);
      response.status(500).json({
        statusCode: 500,
        message: 'Erro interno do servidor'
      });
    }
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'http://localhost:3001', 
      'https://github-explorer-frontend-omega.vercel.app' 
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.setGlobalPrefix('api');
  app.useGlobalFilters(new AllExceptionsFilter());

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`🚀 Servidor rodando em http://localhost:${port}/api`);
}
bootstrap();