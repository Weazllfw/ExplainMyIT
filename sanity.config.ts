import { defineConfig } from 'next-sanity';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '';
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';

export default defineConfig({
  projectId,
  dataset,
  apiVersion: '2024-01-28', // Use today's date for latest features
  useCdn: false, // Set to true in production for faster, cached responses
  
  // Studio configuration (optional, if hosting Studio in same project)
  basePath: '/studio',
  title: 'Explain My IT Blog',
});
