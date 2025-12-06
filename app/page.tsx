import HomeContent from "../components/HomeContent";
import fullData from "../data.json";
import { getProductsFromDB } from "@/lib/data";

export const metadata = {
  title: {
    template: '%s | PASOKARI',
    default: 'PASOKARI: Pasokan Kualitas Andal',
  },
  description: 'Solusi Terpercaya Produk Pangan Berkualitas',
}

export default async function Home() {
  // Fetch directly from DB (Server Component)
  // Fallback to local JSON if DB fails
  const dbData = await getProductsFromDB();
  const categoryData = dbData || fullData.categoryData;

  return (
    <HomeContent initialCategoryData={categoryData} />
  );
}