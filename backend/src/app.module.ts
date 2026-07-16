import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Agent } from './entities/agent.entity';
import { Property } from './entities/property.entity';
import { Inquiry } from './entities/inquiry.entity';
import { User } from './entities/user.entity';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { AgentsModule } from './modules/agents/agents.module';
import { PropertiesModule } from './modules/properties/properties.module';
import { InquiriesModule } from './modules/inquiries/inquiries.module';

// Load environment variables from .env file
dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT || '5432', 10),
      username: process.env.DATABASE_USER || 'postgres',
      password: process.env.DATABASE_PASSWORD || 'postgres',
      database: process.env.DATABASE_NAME || 'real_estate_db',
      entities: [Agent, Property, Inquiry, User],
      synchronize: true, // Auto-sync entities with database schema for development ease
      logging: false,
    }),
    AuthModule,
    UsersModule,
    AgentsModule,
    PropertiesModule,
    InquiriesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
