import { PortableText, PortableTextComponents } from '@portabletext/react';

/**
 * Custom components for rendering Sanity Portable Text
 * Styled to match your design system and optimize for readability
 */
const components: PortableTextComponents = {
  block: {
    h2: ({ children }) => (
      <h2 className="text-3xl font-bold mt-12 mb-4 text-gray-900">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-2xl font-bold mt-8 mb-3 text-gray-900">{children}</h3>
    ),
    normal: ({ children }) => (
      <p className="mb-6 text-lg leading-relaxed text-gray-700">{children}</p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-slate-300 pl-6 my-8 italic text-gray-600">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mb-6 space-y-2 list-disc list-outside ml-6 text-lg text-gray-700">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="mb-6 space-y-2 list-decimal list-outside ml-6 text-lg text-gray-700">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="pl-2">{children}</li>,
    number: ({ children }) => <li className="pl-2">{children}</li>,
  },
  marks: {
    strong: ({ children }) => <strong className="font-bold text-gray-900">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    code: ({ children }) => (
      <code className="bg-gray-100 text-slate-700 px-2 py-0.5 rounded text-base font-mono">
        {children}
      </code>
    ),
    link: ({ children, value }) => {
      const target = value?.blank ? '_blank' : undefined;
      const rel = value?.blank ? 'noopener noreferrer' : undefined;
      return (
        <a
          href={value?.href}
          target={target}
          rel={rel}
          className="text-slate-700 underline hover:text-slate-900 transition-colors"
        >
          {children}
        </a>
      );
    },
  },
  types: {
    code: ({ value }) => (
      <pre className="bg-gray-900 text-gray-100 p-6 rounded-lg overflow-x-auto my-8">
        <code className="text-sm font-mono">{value.code}</code>
      </pre>
    ),
  },
};

interface PortableTextRendererProps {
  value: any[];
}

/**
 * Renders Sanity Portable Text with custom styling
 * Optimized for readability and SEO
 */
export default function PortableTextRenderer({ value }: PortableTextRendererProps) {
  if (!value || !Array.isArray(value)) {
    return null;
  }

  return (
    <div className="prose prose-lg prose-slate max-w-none">
      <PortableText value={value} components={components} />
    </div>
  );
}
