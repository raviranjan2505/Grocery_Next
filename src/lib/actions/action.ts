import axiosInstance from "@/lib/axios";
import { API_ROUTES, API_BASE_URL } from "@/utils/api";

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

// ✅ Get product details from your actual API
export const getProductDetails = async (
  slag: string
): Promise<Product | null> => {
  try {
    const res = await axiosInstance.get<Product>(`${API_ROUTES.PRODUCTS}/slag/${slag}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching product details:", error);
    return null;
  }
};

// types for products
export interface SliderProduct {
  id: number;
  categoryId: string;
  title: string;
  subtitle: string;
  price: number;
  img: string;
  deliveryTime: string;
}

export interface CategoryResponse {
  categoryId: number;
  categoryName: string;
  slagurl: string;
  catimg: string | null;
  subcategories: CategoryResponse[];
}

// ✅ Get all categories
export const getCategories = async (): Promise<CategoryResponse[]> => {
  try {
    const res = await axiosInstance.get<{ data: CategoryResponse[] }>(API_ROUTES.CATEGORIES);
    return res.data.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

// ✅ Get category by ID
export async function getCategoryById(id: number) {
  try {
    const res = await axiosInstance.get(`${API_ROUTES.CATEGORIES}/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching category by ID:", error);
    return null;
  }
}

// ✅ Get products by category slug
export async function getProductsBySlug(slug: string) {
  try {
    const res = await axiosInstance.get(`${API_ROUTES.PRODUCTS}/category/${slug}`);
   
    return res.data;
  } catch (error) {
    console.error("Error fetching products by slug:", error);
    return [];
  }
}

// ✅ Fetch categories WITH products (slider)
export const getCategoriesForSlider = async (): Promise<
  { slug: string; name: string; products: SliderProduct[] }[]
> => {
  try {
    const res = await axiosInstance.get(`${API_ROUTES.PRODUCTS}/homeproducts`);
    const json = res.data;
    
    const categories = json.data.map((cat: any) => {
      const products: SliderProduct[] = cat.homeProductItems.map((p: any) => ({
        id: p.pid,
        categoryId: cat.name, 
        title: p.productName,
        subtitle: p.productSlag,
        slag: p.productSlag,
        price: p.dp,
        img: p.defaultImage.startsWith("http")
          ? p.defaultImage
          : `${API_BASE_URL}${p.defaultImage}`,
        deliveryTime: "2-3 Days",
      }));

      return {
        slug: cat.name.toLowerCase().replace(/\s+/g, "-"), // create slug from name
        name: cat.name,
        products,
      };
    });

    console.log("categories responsesdsds ✅", categories);
    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

// ✅ Get products by category slug from slider
export const getProductsByCategory = async (
  slug: string
): Promise<SliderProduct[]> => {
  const categories = await getCategoriesForSlider();
  const category = categories.find((c) => c.slug === slug);
  return category ? category.products : [];
};


// types for banners
export interface Banner {
  imgId: number;
  pid: number;
  imgName: string;
  imgUrl: string;
  defaultImg: boolean;
  isActive: boolean;
  bannerTypeId: number;
  bannerTypeName: string;
  link: number;
  linkType: number;
  displayOrder: number;
  categoryId: number;
  productId: number;
}

// ✅ Fetch Active Banners
export const getActiveBanners = async (): Promise<Banner[]> => {
  try {
    const res = await axiosInstance.get<{ data: Banner[] }>(
      `${API_ROUTES.BANNERS}/active`
    );

    // Attach base URL if image path is relative
    return res.data.data.map((b: Banner) => ({
      ...b,
      imgUrl: b.imgUrl.startsWith("http")
        ? b.imgUrl
        : `${API_BASE_URL}${b.imgUrl}`,
    }));
  } catch (error) {
    console.error("Error fetching banners:", error);
    return [];
  }
};
