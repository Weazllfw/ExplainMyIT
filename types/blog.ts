export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: any; // Can be string (MDX) or PortableText array (Sanity)
  readingTime?: number;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
    noIndex?: boolean;
  };
}

export interface BlogFrontmatter {
  title: string;
  date: string;
  excerpt: string;
}
