import { IsString, IsNotEmpty, IsEmail, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateInquiryDto {
  @ApiProperty({ example: 'Alice Smith' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'alice@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'I would like to schedule a viewing for this property next Thursday.' })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsOptional()
  propertyId?: number;
}
