/**
 * Sanity-specific types for blog posts
 */

export interface SanityBlogPost {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  excerpt: string;
  publishedAt: string;
  readingTime?: number;
  body: PortableTextBlock[];
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
    noIndex?: boolean;
  };
}

export interface PortableTextBlock {
  _type: string;
  _key: string;
  style?: string;
  listItem?: string;
  children?: PortableTextChild[];
  level?: number;
  markDefs?: PortableTextMarkDef[];
}

export interface PortableTextChild {
  _type: string;
  _key: string;
  text: string;
  marks?: string[];
}

export interface PortableTextMarkDef {
  _type: string;
  _key: string;
  href?: string;
  blank?: boolean;
}
