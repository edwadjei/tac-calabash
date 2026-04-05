import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Security
  app.use(helmet());
  app.enableCors({
    origin: process.env.WEB_APP_URL || 'http://localhost:3001',
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // API prefix
  app.setGlobalPrefix(process.env.API_PREFIX || 'api/v1');

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('TAC Calabash API')
    .setDescription(
      `## Church Management Solution API

TAC Calabash is a comprehensive church management platform designed to streamline church operations, member engagement, and administrative tasks.

### Features
- **Member Management**: Track members, families, and their spiritual journey
- **Ministry Coordination**: Organize ministries and manage member participation
- **Attendance Tracking**: Record and analyze service attendance patterns
- **Financial Management**: Handle tithes, offerings, pledges, and generate statements
- **Events & Calendar**: Manage church events and activities
- **Notifications**: Send announcements and push notifications to members
- **Follow-up System**: Track pastoral care and new visitor follow-ups
- **Reports & Analytics**: Generate comprehensive church reports

### Authentication
All endpoints (except login) require JWT Bearer token authentication.
- Access tokens expire in 15 minutes
- Use the refresh token endpoint to obtain new access tokens
- Refresh tokens expire in 7 days

### Rate Limiting
API requests are rate-limited to ensure fair usage:
- 100 requests per minute for authenticated users
- 20 requests per minute for unauthenticated endpoints

### Error Responses
All error responses follow a consistent format:
\`\`\`json
{
  "statusCode": 400,
  "message": "Error description",
  "error": "Bad Request"
}
\`\`\`
`,
    )
    .setVersion('1.0.0')
    .setContact(
      'TAC Calabash Support',
      'https://taccalabash.com',
      'support@taccalabash.com',
    )
    .setLicense('Proprietary', 'https://taccalabash.com/license')
    .addServer('http://localhost:3000', 'Development Server')
    .addServer('https://api.taccalabash.com', 'Production Server')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Enter your JWT access token',
        in: 'header',
      },
      'access-token',
    )
    .addTag('Auth', 'Authentication endpoints for login, logout, and token refresh')
    .addTag('Users', 'Admin/Staff user management (requires ADMIN role)')
    .addTag('Members', 'Church member management and profiles')
    .addTag('Ministries', 'Ministry groups and member assignments')
    .addTag('Attendance', 'Service attendance tracking and records')
    .addTag('Events', 'Church events and calendar management')
    .addTag('Finances', 'Unified finances module for contributions, pledges, chart of accounts, journal entries, and statements')
    .addTag('Notifications', 'Announcements and push notifications')
    .addTag('Follow-Up', 'Pastoral care and visitor follow-up tracking')
    .addTag('Reports', 'Dashboard analytics and report generation')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    customSiteTitle: 'TAC Calabash API Documentation',
    customfavIcon: 'https://taccalabash.com/favicon.ico',
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .info .title { font-size: 2.5em }
    `,
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'none',
      filter: true,
      showRequestDuration: true,
      syntaxHighlight: {
        activate: true,
        theme: 'monokai',
      },
    },
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application running on port ${port}`);
}
bootstrap();
