
// export interface DummyProduct {
//   id: number;
//   title: string;
//   description: string;
//   price: number;
//   brand: string;
//   category: string;
//   thumbnail: string;
//   images: string[];
// }
// // types for products
// export interface SliderProduct {
//   id: number;
//   categoryId: string;
//   title: string;
//   subtitle: string;
//   price: number;
//   img: string;
//   deliveryTime: string;
// }

// export const getProductDetails = async (
//   productId: string
// ): Promise<DummyProduct | null> => {
//   try {
//     const res = await fetch(`https://dummyjson.com/products/${productId}`, {
//       cache: "no-store",
//     });
//     if (!res.ok) return null;
//     return res.json();
//   } catch (error) {
//     console.error("❌ Error fetching product details:", error);
//     return null;
//   }
// };

// export const getRelatedProducts = async (
//   categoriesId: string,
// ): Promise<DummyProduct[]> => {
//   try {
//     const res = await fetch(
//       `https://dummyjson.com/products/category/${(categoriesId)}`,
//       { cache: "no-store" }
//     );
//     if (!res.ok) return [];
//     const data = await res.json();
//     console.log(data, "data of related products")

//     return data.products;
//   } catch (error) {
//     console.error("❌ Error fetching related products:", error);
//     return [];
//   }
// };

// // lib/actions/action.ts
// export interface CategoryResponse {
//   categoryId: number;
//   categoryName: string;
//   slagurl: string;
//   catimg: string | null;
//   subcategories: CategoryResponse[];
// }

// export const getCategories = async (): Promise<CategoryResponse[]> => {
//   try {
//     const res = await fetch(
//       "https://forestgarden.nexusitsoftech.com/api/Categories",
//       { cache: "no-store" }
//     );
//     if (!res.ok) return [];

//     const json = await res.json();
//     return json.data as CategoryResponse[];
//   } catch (error) {
//     console.error("❌ Error fetching categories:", error);
//     return [];
//   }
// };

// export async function getCategoryById(id: number) {

//   const res = await fetch(
//     `https://forestgarden.nexusitsoftech.com/api/Categories/${id}`,
//     { cache: "no-store" }
//   );
//   return res.json();
// }

// export async function getProductsBySlug(slug: string) {
//   const res = await fetch(
//     `https://forestgarden.nexusitsoftech.com/api/Products/category/${slug}`,
//     { cache: "no-store" }
//   );
//   return res.json();
// }


// // types for products
// export interface SliderProduct {
//   id: number;
//   categoryId: string;
//   title: string;
//   subtitle: string;
//   price: number;
//   img: string;
//   deliveryTime: string;
// }
// // ✅ 1. Fetch categories WITH products
// export const getCategoriesForSlider = async (): Promise<
//   { slug: string; name: string; products: SliderProduct[] }[]
// > => {
//   try {
//     const res = await fetch(
//       "https://forestgarden.nexusitsoftech.com/api/Products/homeproducts",
//       { cache: "no-store" }
//     );
//     if (!res.ok) return [];

//     const json = await res.json();

//     const categories = json.data.map((cat: any) => {
//       const products: SliderProduct[] = cat.homeProductItems.map((p: any) => ({
//         id: p.pid,
//         categoryId: cat.name, // category name as ID
//         title: p.productName,
//         subtitle: p.productSlag,
//         price: p.dp,
//         img: p.defaultImage.startsWith("http")
//           ? p.defaultImage
//           : `https://forestgarden.nexusitsoftech.com${p.defaultImage}`,
//         deliveryTime: "2-3 Days",
//       }));

//       return {
//         slug: cat.name.toLowerCase().replace(/\s+/g, "-"), // create slug from name
//         name: cat.name,
//         products,
//       };
//     });

//     console.log("categories responsesdsds ✅", categories);
//     return categories;
//   } catch (error) {
//     console.error("❌ Error fetching categories:", error);
//     return [];
//   }
// };

// // ✅ 2. (Optional) If you still want products by category slug
// export const getProductsByCategory = async (
//   slug: string
// ): Promise<SliderProduct[]> => {
//   const categories = await getCategoriesForSlider();
//   const category = categories.find((c) => c.slug === slug);
//   return category ? category.products : [];
// };




import axiosInstance from "@/lib/axios";
import { API_ROUTES, API_BASE_URL } from "@/utils/api";

export interface DummyProduct {
  id: number;
  title: string;
  description: string;
  price: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

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

// ✅ Get product details
export const getProductDetails = async (
  productId: string
): Promise<DummyProduct | null> => {
  try {
    const res = await axiosInstance.get<DummyProduct>(`https://dummyjson.com/products/${productId}`);
    return res.data;
  } catch (error) {
    console.error("❌ Error fetching product details:", error);
    return null;
  }
};

// ✅ Get related products
export const getRelatedProducts = async (
  categoriesId: string
): Promise<DummyProduct[]> => {
  try {
    const res = await axiosInstance.get<{ products: DummyProduct[] }>(
      `https://dummyjson.com/products/category/${(categoriesId)}}`
    );
    console.log(res.data, "data of related products");
    return res.data.products;
  } catch (error) {
    console.error("❌ Error fetching related products:", error);
    return [];
  }
};

// lib/actions/action.ts
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
    console.error("❌ Error fetching categories:", error);
    return [];
  }
};

// ✅ Get category by ID
export async function getCategoryById(id: number) {
  try {
    const res = await axiosInstance.get(`${API_ROUTES.CATEGORIES}/${id}`);
    return res.data;
  } catch (error) {
    console.error("❌ Error fetching category by ID:", error);
    return null;
  }
}

// ✅ Get products by category slug
export async function getProductsBySlug(slug: string) {
  try {
    const res = await axiosInstance.get(`${API_ROUTES.PRODUCTS}/category/${slug}`);
    return res.data;
  } catch (error) {
    console.error("❌ Error fetching products by slug:", error);
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
        categoryId: cat.name, // category name as ID
        title: p.productName,
        subtitle: p.productSlag,
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
    console.error("❌ Error fetching categories:", error);
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
