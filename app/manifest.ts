import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'PASOKARI Website',
    short_name: 'PASOKARI',
    description: 'Solusi Terpercaya Produk Pangan Berkualitas',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#00a859',
    icons: [
      {
        src: '/assets/logo.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/assets/logo.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
