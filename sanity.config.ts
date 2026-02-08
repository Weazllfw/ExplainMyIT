import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
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
    structureTool(),
    visionTool(),
  ],
  
  schema: {
    types: schemas,
  },
});
