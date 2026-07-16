import { IsString, IsNotEmpty, IsNumber, IsArray, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePropertyDto {
  @ApiProperty({ example: 'Modern Penthouse with Ocean Views' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'This stunning penthouse features floor-to-ceiling windows...' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 1250000 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ example: 'Miami, FL' })
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiProperty({ example: ['/images/properties/p1-1.jpg', '/images/properties/p1-2.jpg'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images: string[];

  @ApiProperty({ example: 3 })
  @IsNumber()
  @Min(0)
  beds: number;

  @ApiProperty({ example: 2 })
  @IsNumber()
  @Min(0)
  baths: number;

  @ApiProperty({ example: 2400 })
  @IsNumber()
  @Min(0)
  sqft: number;

  @ApiProperty({ example: 'Penthouse' })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({ example: 'Buy' })
  @IsString()
  @IsNotEmpty()
  status: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsOptional()
  agentId?: number;
}
