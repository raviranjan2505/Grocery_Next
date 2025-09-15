import ProductCard, { UIProductCard } from "@/components/Home/ProductCard";
import { notFound } from "next/navigation";
import { getCategoriesById } from "@/lib/actions/action";

interface CategoryPageProps {
  params: {
    categoriesId: string;
  };
}


export default async function CategoryPage({ params }: CategoryPageProps) {
  const { categoriesId } = params;
  const getCategories = await getCategoriesById(categoriesId)

  return (
    <main className="px-4 md:px-8 py-6">
      <h1 className="text-2xl font-bold mb-6 capitalize">
        {categoriesId.replace("-", " ")}
      </h1>

      {getCategories.length === 0 ? (
        <p className="text-gray-500">No products found in this category.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {getCategories.map((p) => {
            const cardData: UIProductCard = {
              id: String(p.id),
              categoryId: p.category,
              title: p.title,
              subtitle: p.brand,
              price: p.price,
              img: p.thumbnail,
              deliveryTime: "9 MINS",
            };
            return <ProductCard key={p.id} product={cardData} />;
          })}
        </div>
      )}
    </main>
  );
}
