/**
 * App Icon (Favicon)
 * Next.js will automatically generate favicon from this
 */

import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const size = {
  width: 32,
  height: 32,
};

export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0F172A', // brand-navy
          borderRadius: '6px',
        }}
      >
        <div
          style={{
            fontSize: 20,
            fontWeight: 'bold',
            color: '#06B6D4', // brand-cyan
            display: 'flex',
          }}
        >
          IT
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
