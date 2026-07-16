const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface Agent {
  id: number;
  name: string;
  bio: string;
  photo: string;
  email: string;
  phone: string;
  properties?: Property[];
}

export interface Property {
  id: number;
  title: string;
  description: string;
  price: number;
  location: string;
  images: string[];
  beds: number;
  baths: number;
  sqft: number;
  type: string;
  status: string;
  agentId: number;
  agent?: Agent;
}

export interface Inquiry {
  id: number;
  name: string;
  email: string;
  message: string;
  propertyId?: number;
  createdAt: string;
}

export const MOCK_AGENTS: Agent[] = [
  {
    id: 1,
    name: 'Alexander Vance',
    bio: 'With over 12 years of experience in ultra-high-net-worth estate transactions, Alexander specializes in architectural landmarks and coastal penthouses.',
    photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
    email: 'alexander@gravityestates.com',
    phone: '+1 (555) 302-8821',
  },
  {
    id: 2,
    name: 'Elena Rostova',
    bio: 'Elena is a leading specialist in contemporary minimalist residences. Her background in interior architecture provides clients with unrivaled design curation.',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    email: 'elena@gravityestates.com',
    phone: '+1 (555) 302-8822',
  },
  {
    id: 3,
    name: 'Marcus Sterling',
    bio: 'Marcus has built his reputation on discreet, off-market transactions in historic luxury districts. His clients appreciate his precise financial valuations and absolute discretion.',
    photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
    email: 'marcus@gravityestates.com',
    phone: '+1 (555) 302-8823',
  },
];

export const MOCK_PROPERTIES: Property[] = [
  {
    id: 1,
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
    agentId: 1,
  },
  {
    id: 2,
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
    agentId: 2,
  },
  {
    id: 3,
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
    agentId: 3,
  },
  {
    id: 4,
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
    agentId: 2,
  },
  {
    id: 5,
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
    agentId: 1,
  },
];

let isOfflineMode = false;

export function checkOfflineStatus() {
  return isOfflineMode;
}

async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
  });
  
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`API error: ${res.status} ${errText}`);
  }
  
  if (res.status === 204) return {} as T;
  return await res.json();
}

export const api = {
  // Properties
  async getProperties(filters?: {
    minPrice?: number;
    maxPrice?: number;
    location?: string;
    type?: string;
    beds?: number;
    status?: string;
  }): Promise<Property[]> {
    try {
      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, val]) => {
          if (val !== undefined && val !== null && val !== '') {
            params.append(key, String(val));
          }
        });
      }
      const queryStr = params.toString() ? `?${params.toString()}` : '';
      return await apiFetch<Property[]>(`/properties${queryStr}`);
    } catch (err) {
      isOfflineMode = true;
      console.warn('Backend connection failed, serving properties catalog locally from mock dataset.');
      
      let list = [...MOCK_PROPERTIES];
      if (filters) {
        if (filters.status) list = list.filter(p => p.status.toLowerCase() === filters.status!.toLowerCase());
        if (filters.type) list = list.filter(p => p.type.toLowerCase() === filters.type!.toLowerCase());
        if (filters.location) list = list.filter(p => p.location.toLowerCase().includes(filters.location!.toLowerCase()));
        if (filters.beds) list = list.filter(p => p.beds >= Number(filters.beds));
        if (filters.minPrice) list = list.filter(p => p.price >= Number(filters.minPrice));
        if (filters.maxPrice) list = list.filter(p => p.price <= Number(filters.maxPrice));
      }
      
      return list.map(p => ({
        ...p,
        agent: MOCK_AGENTS.find(a => a.id === p.agentId)
      }));
    }
  },

  async getProperty(id: number): Promise<Property> {
    try {
      return await apiFetch<Property>(`/properties/${id}`);
    } catch (err) {
      isOfflineMode = true;
      const prop = MOCK_PROPERTIES.find(p => p.id === id);
      if (!prop) throw new Error('Property not found');
      return {
        ...prop,
        agent: MOCK_AGENTS.find(a => a.id === prop.agentId)
      };
    }
  },

  // Create Property
  async createProperty(data: Omit<Property, 'id' | 'agent' | 'agentId'> & { agentId: number }): Promise<any> {
    return await apiFetch<any>('/properties', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Delete Property
  async deleteProperty(id: number): Promise<any> {
    return await apiFetch<any>(`/properties/${id}`, {
      method: 'DELETE',
    });
  },

  // Agents
  async getAgents(): Promise<Agent[]> {
    try {
      return await apiFetch<Agent[]>('/agents');
    } catch (err) {
      isOfflineMode = true;
      return MOCK_AGENTS.map(a => ({
        ...a,
        properties: MOCK_PROPERTIES.filter(p => p.agentId === a.id)
      }));
    }
  },

  async getAgent(id: number): Promise<Agent> {
    try {
      return await apiFetch<Agent>(`/agents/${id}`);
    } catch (err) {
      isOfflineMode = true;
      const agent = MOCK_AGENTS.find(a => a.id === id);
      if (!agent) throw new Error('Agent not found');
      return {
        ...agent,
        properties: MOCK_PROPERTIES.filter(p => p.agentId === agent.id)
      };
    }
  },

  // Inquiries
  async submitInquiry(data: {
    name: string;
    email: string;
    message: string;
    propertyId?: number;
  }): Promise<Inquiry> {
    try {
      return await apiFetch<Inquiry>('/inquiries', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    } catch (err) {
      isOfflineMode = true;
      console.log('Inquiry submitted in offline mockup mode:', data);
      return {
        id: Math.floor(Math.random() * 1000),
        ...data,
        createdAt: new Date().toISOString()
      };
    }
  },

  // Admin Authentication
  async login(username: string, password: string): Promise<{ access_token: string; user: { id: number; username: string; role: string } }> {
    return await apiFetch<{ access_token: string; user: { id: number; username: string; role: string } }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  },

  // Get Inquiries (Admin)
  async getInquiries(): Promise<any[]> {
    try {
      return await apiFetch<any[]>('/inquiries');
    } catch (err) {
      isOfflineMode = true;
      return [
        {
          id: 1,
          name: "John Doe",
          email: "john@example.com",
          message: "I am interested in scheduling a viewing for Obsidian Pavilion next Tuesday.",
          propertyTitle: "The Obsidian Pavilion",
          createdAt: new Date().toISOString()
        }
      ];
    }
  },
};
