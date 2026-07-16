import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Property } from '../../entities/property.entity';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';

@Injectable()
export class PropertiesService {
  constructor(
    @InjectRepository(Property)
    private readonly propertyRepository: Repository<Property>,
  ) {}

  async findAll(query: {
    minPrice?: number;
    maxPrice?: number;
    location?: string;
    type?: string;
    beds?: number;
    status?: string;
  }): Promise<Property[]> {
    const qb = this.propertyRepository.createQueryBuilder('property')
      .leftJoinAndSelect('property.agent', 'agent');

    if (query.minPrice) {
      qb.andWhere('property.price >= :minPrice', { minPrice: query.minPrice });
    }
    if (query.maxPrice) {
      qb.andWhere('property.price <= :maxPrice', { maxPrice: query.maxPrice });
    }
    if (query.location) {
      qb.andWhere('LOWER(property.location) LIKE LOWER(:location)', { location: `%${query.location}%` });
    }
    if (query.type) {
      qb.andWhere('LOWER(property.type) = LOWER(:type)', { type: query.type });
    }
    if (query.beds) {
      qb.andWhere('property.beds >= :beds', { beds: query.beds });
    }
    if (query.status) {
      qb.andWhere('LOWER(property.status) = LOWER(:status)', { status: query.status });
    }

    return qb.getMany();
  }

  async findOne(id: number): Promise<Property> {
    const property = await this.propertyRepository.findOne({
      where: { id },
      relations: { agent: true, inquiries: true },
    });
    if (!property) {
      throw new NotFoundException(`Property with ID ${id} not found`);
    }
    return property;
  }

  async create(createPropertyDto: CreatePropertyDto): Promise<Property> {
    const property = this.propertyRepository.create(createPropertyDto);
    return this.propertyRepository.save(property);
  }

  async update(id: number, updatePropertyDto: UpdatePropertyDto): Promise<Property> {
    const property = await this.findOne(id);
    this.propertyRepository.merge(property, updatePropertyDto);
    return this.propertyRepository.save(property);
  }

  async remove(id: number): Promise<void> {
    const result = await this.propertyRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Property with ID ${id} not found`);
    }
  }
}
