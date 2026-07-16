import { Controller, Get, Post, Patch, Delete, Body, Param, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { PropertiesService } from './properties.service';
import { Property } from '../../entities/property.entity';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('properties')
@Controller('properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Get()
  @ApiOperation({ summary: 'Get properties with optional filtering' })
  @ApiQuery({ name: 'minPrice', required: false, type: Number })
  @ApiQuery({ name: 'maxPrice', required: false, type: Number })
  @ApiQuery({ name: 'location', required: false, type: String })
  @ApiQuery({ name: 'type', required: false, type: String })
  @ApiQuery({ name: 'beds', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, type: String })
  @ApiResponse({ status: 200, type: [Property] })
  findAll(
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
    @Query('location') location?: string,
    @Query('type') type?: string,
    @Query('beds') beds?: number,
    @Query('status') status?: string,
  ): Promise<Property[]> {
    return this.propertiesService.findAll({ minPrice, maxPrice, location, type, beds, status });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get property details by ID' })
  @ApiResponse({ status: 200, type: Property })
  @ApiResponse({ status: 404, description: 'Property not found' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Property> {
    return this.propertiesService.findOne(id);
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create new property (Admin only)' })
  @ApiResponse({ status: 201, type: Property })
  create(@Body() createPropertyDto: CreatePropertyDto): Promise<Property> {
    return this.propertiesService.create(createPropertyDto);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update property details (Admin only)' })
  @ApiResponse({ status: 200, type: Property })
  @ApiResponse({ status: 404, description: 'Property not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePropertyDto: UpdatePropertyDto,
  ): Promise<Property> {
    return this.propertiesService.update(id, updatePropertyDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete property listing (Admin only)' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 404, description: 'Property not found' })
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.propertiesService.remove(id);
  }
}
