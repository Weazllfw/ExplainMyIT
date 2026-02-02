import { defineConfig } from 'sanity';
import { deskTool } from 'sanity/desk';
import { visionTool } from '@sanity/vision';
import { schemas } from './sanity/schemas';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'rifsjrqi';
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';

export default defineConfig({
  name: 'explainmyit',
  title: 'Explain My IT Blog',
  
  projectId,
  dataset,
  
  plugins: [
    deskTool(),
    visionTool(),
  ],
  
  schema: {
    types: schemas,
  },
  
  // Studio settings
  basePath: '/studio', // Will be available at /studio in your Next.js app
});
