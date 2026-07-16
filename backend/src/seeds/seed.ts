import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import { Agent } from '../entities/agent.entity';
import { Property } from '../entities/property.entity';
import { User } from '../entities/user.entity';
import { Inquiry } from '../entities/inquiry.entity';

dotenv.config();

const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '3306', 10),
  username: process.env.DATABASE_USER || 'root',
  password: process.env.DATABASE_PASSWORD || '',
  database: process.env.DATABASE_NAME || 'real_estate_db',
  entities: [Agent, Property, User, Inquiry],
  synchronize: true,
});

async function run() {
  console.log('Connecting to database for seeding...');
  await AppDataSource.initialize();
  console.log('Database connected!');

  const agentRepo = AppDataSource.getRepository(Agent);
  const propertyRepo = AppDataSource.getRepository(Property);
  const userRepo = AppDataSource.getRepository(User);
  const inquiryRepo = AppDataSource.getRepository(Inquiry);

  // Clear tables to prevent duplicate keys
  console.log('Clearing database tables...');
  await inquiryRepo.delete({});
  await propertyRepo.delete({});
  await agentRepo.delete({});
  await userRepo.delete({});

  console.log('Seeding admin user...');
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = userRepo.create({
    username: 'admin',
    password: hashedPassword,
    role: 'admin',
  });
  await userRepo.save(admin);
  console.log('Admin user seeded: admin / admin123');

  console.log('Seeding agents...');
  const agentsData = [
    {
      name: 'Alexander Vance',
      bio: 'With over 12 years of experience in ultra-high-net-worth estate transactions, Alexander specializes in architectural landmarks and coastal penthouses.',
      photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
      email: 'alexander@gravityestates.com',
      phone: '+1 (555) 302-8821',
    },
    {
      name: 'Elena Rostova',
      bio: 'Elena is a leading specialist in contemporary minimalist residences. Her background in interior architecture provides clients with unrivaled design curation.',
      photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
      email: 'elena@gravityestates.com',
      phone: '+1 (555) 302-8822',
    },
    {
      name: 'Marcus Sterling',
      bio: 'Marcus has built his reputation on discreet, off-market transactions in historic luxury districts. His clients appreciate his precise financial valuations and absolute discretion.',
      photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
      email: 'marcus@gravityestates.com',
      phone: '+1 (555) 302-8823',
    },
  ];

  const seededAgents = [];
  for (const agentData of agentsData) {
    const agent = agentRepo.create(agentData);
    const savedAgent = await agentRepo.save(agent);
    seededAgents.push(savedAgent);
  }
  console.log(`${seededAgents.length} agents seeded.`);

  console.log('Seeding properties...');
  const propertiesData = [
    {
      title: 'The Obsidian Pavilion',
      description: 'A minimalist concrete masterpiece built into the sheer cliffside. Features absolute floor-to-ceiling glass paneling, a 25-meter black quartz infinity pool, smart-home automation, subterranean garage, and uninterrupted views of the Pacific coastline.',
      price: 18500000,
      location: 'Malibu, CA',
      images: [
        'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80',
      ],
      beds: 5,
      baths: 6,
      sqft: 8400,
      type: 'Villa',
      status: 'Buy',
      agent: seededAgents[0],
    },
    {
      title: 'Aura Heights Penthouse',
      description: 'Exquisite dual-level penthouse sitting atop the city skyline. Features a private glass elevator, sweeping double-height lounge, architectural floating staircase, wraparound terrace with hot tub, and direct private access to downtown cultural landmarks.',
      price: 9200000,
      location: 'New York, NY',
      images: [
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
      ],
      beds: 3,
      baths: 4,
      sqft: 4200,
      type: 'Penthouse',
      status: 'Buy',
      agent: seededAgents[1],
    },
    {
      title: 'Sienna Ridge Residence',
      description: 'An earth-toned retreat inspired by Italian rural estates, redesigned for modern editorial living. Composed of reclaimed stone and oak beams, featuring custom minimalist millwork, an olive grove garden, open-air pavilion, and full service wellness spa.',
      price: 12400000,
      location: 'Napa Valley, CA',
      images: [
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
      ],
      beds: 4,
      baths: 5,
      sqft: 6700,
      type: 'Villa',
      status: 'Buy',
      agent: seededAgents[2],
    },
    {
      title: 'Concrete Brutalist Loft',
      description: 'Raw concrete panels, industrial ceiling height, and minimalist layout. Perfect for galleries or modern lifestyle creatives. Positioned in the art district with high-security private entry, steel framed window structures, and architectural solar panels.',
      price: 3400000,
      location: 'Portland, OR',
      images: [
        'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?auto=format&fit=crop&w=800&q=80',
      ],
      beds: 2,
      baths: 2,
      sqft: 3100,
      type: 'Apartment',
      status: 'Rent',
      agent: seededAgents[1],
    },
    {
      title: 'Elysian Estate Residence',
      description: 'Surrounded by ancient redwoods, this steel-frame architectural design bridges nature and ultra-luxury living. Double-tier heated pool deck, indoor waterfall feature, home theater, guest house, and biometric security systems throughout.',
      price: 24500000,
      location: 'Aspen, CO',
      images: [
        'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80',
      ],
      beds: 6,
      baths: 8,
      sqft: 11200,
      type: 'Villa',
      status: 'Sold',
      agent: seededAgents[0],
    },
  ];

  for (const propData of propertiesData) {
    const prop = propertyRepo.create(propData);
    await propertyRepo.save(prop);
  }
  console.log('Properties seeded successfully.');

  console.log('Database seeding completed successfully.');
  await AppDataSource.destroy();
}

run().catch((error) => {
  console.error('Error during seeding:', error);
  process.exit(1);
});
