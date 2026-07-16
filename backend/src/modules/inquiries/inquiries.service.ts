import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inquiry } from '../../entities/inquiry.entity';
import { CreateInquiryDto } from './dto/create-inquiry.dto';

@Injectable()
export class InquiriesService {
  constructor(
    @InjectRepository(Inquiry)
    private readonly inquiryRepository: Repository<Inquiry>,
  ) {}

  async create(createInquiryDto: CreateInquiryDto): Promise<Inquiry> {
    const inquiry = this.inquiryRepository.create(createInquiryDto);
    return this.inquiryRepository.save(inquiry);
  }

  async findAll(): Promise<Inquiry[]> {
    return this.inquiryRepository.find({
      relations: { property: true },
      order: { createdAt: 'DESC' },
    });
  }
}
