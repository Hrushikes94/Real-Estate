import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { InquiriesService } from './inquiries.service';
import { Inquiry } from '../../entities/inquiry.entity';
import { CreateInquiryDto } from './dto/create-inquiry.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('inquiries')
@Controller('inquiries')
export class InquiriesController {
  constructor(private readonly inquiriesService: InquiriesService) {}

  @Post()
  @ApiOperation({ summary: 'Submit a new property inquiry' })
  @ApiResponse({ status: 201, type: Inquiry })
  create(@Body() createInquiryDto: CreateInquiryDto): Promise<Inquiry> {
    return this.inquiriesService.create(createInquiryDto);
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all inquiries (Admin only)' })
  @ApiResponse({ status: 200, type: [Inquiry] })
  findAll(): Promise<Inquiry[]> {
    return this.inquiriesService.findAll();
  }
}
