import HomeContent from "../components/HomeContent";
import fullData from "../data.json";

export const metadata = {
  title: {
    template: '%s | PASOKARI',
    default: 'PASOKARI: Pasokan Kualitas Andal',
  },
  description: 'Solusi Terpercaya Produk Pangan Berkualitas',
}

async function getProducts() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch data');
    return res.json();
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return fullData.categoryData;
  }
}

export default async function Home() {
  const categoryData = await getProducts();

  return (
    <HomeContent initialCategoryData={categoryData} />
  );
}