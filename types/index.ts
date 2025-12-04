export interface ProductData {
  products: string[];
}

export interface CategoryItem {
  id: ProductData;
  en: ProductData;
  [key: string]: ProductData | undefined;
}

export interface CategoryData {
  [categoryName: string]: CategoryItem;
}

export interface Translations {
  [key: string]: string;
}

export interface FullData {
  categoryData: CategoryData;
  translations: {
    [lang: string]: Translations;
  };
}

export interface Inquiry {
  type: 'category' | 'product';
  id: string;
  category?: string;
  translatedName?: string;
}
