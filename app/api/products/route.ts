import { NextResponse } from 'next/server';
import { getProductsFromDB } from '@/lib/data';

export async function GET() {
  const data = await getProductsFromDB();
  
  if (!data) {
    return NextResponse.json(
      { success: false, message: "Gagal mengambil data." },
      { status: 500 }
    );
  }

  return NextResponse.json(data);
}
