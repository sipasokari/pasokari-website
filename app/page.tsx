import HomeContent from "../components/HomeContent";

export const metadata = {
  title: {
    template: '%s | PASOKARI',
    default: 'PASOKARI: Pasokan Kualitas Andal',
  },
  description: 'Solusi Terpercaya Produk Pangan Berkualitas',
}

export default function Home() {
  return (
    <HomeContent />
  );
}