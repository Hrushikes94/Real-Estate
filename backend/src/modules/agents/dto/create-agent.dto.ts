import { IsString, IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAgentDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Experienced luxury real estate agent...' })
  @IsString()
  @IsNotEmpty()
  bio: string;

  @ApiProperty({ example: '/images/agents/john-doe.jpg' })
  @IsString()
  @IsNotEmpty()
  photo: string;

  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '+1 (555) 123-4567' })
  @IsString()
  @IsNotEmpty()
  phone: string;
}
