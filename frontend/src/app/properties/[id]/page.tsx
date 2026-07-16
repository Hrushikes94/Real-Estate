import PropertyDetailClient from './PropertyDetailClient';
import { MOCK_PROPERTIES } from '@/utils/api';

// Tell Next.js which paths to pre-render at build time
export function generateStaticParams() {
  return MOCK_PROPERTIES.map((prop) => ({
    id: prop.id.toString(),
  }));
}

// Server Component wrapper for metadata and routing
export default async function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return <PropertyDetailClient params={resolvedParams} />;
}
