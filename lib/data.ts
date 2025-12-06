import mongoose from 'mongoose';
import dbConnect from '@/lib/mongodb';

// --- MODEL DEFINITION ---
// We define the model here or ensure it's defined in dbConnect (but models are usually per-file or global)
// To avoid re-definition errors, we use the checks.

const categorySchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  id: { products: [String] },
  en: { products: [String] }
}, { id: false });

// Prevent OverwriteModelError
// We need to make sure we don't define it multiple times if this file is imported in multiple places
const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);

interface Category {
  key: string;
  id: { products: string[] };
  en: { products: string[] };
}

export async function getProductsFromDB() {
  try {
    await dbConnect();
    const categories = await Category.find().lean(); 
    
    const formattedData: Record<string, { id: { products: string[] }; en: { products: string[] } }> = {};
    categories.forEach((cat: unknown) => {
      const c = cat as Category;
      formattedData[c.key] = { id: c.id, en: c.en };
    });

    return formattedData;
  } catch (error) {
    console.error("Gagal ambil produk dari DB:", error);
    return null;
  }
}
