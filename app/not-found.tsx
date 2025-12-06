import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center px-4">
      <h1 className="text-9xl font-bold text-green-600">404</h1>
      <h2 className="text-2xl font-semibold text-gray-800 mt-4">Halaman Tidak Ditemukan</h2>
      <p className="text-gray-600 mt-2 max-w-md">
        Maaf, halaman yang Anda cari mungkin telah dipindahkan atau tidak tersedia.
      </p>
      <Link 
        href="/"
        className="mt-8 px-6 py-3 bg-green-600 text-white font-medium rounded-full hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl"
      >
        Kembali ke Beranda
      </Link>
    </div>
  );
}
