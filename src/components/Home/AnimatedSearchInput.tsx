// "use client"

// import { useEffect, useState } from "react"
// import { Search } from "lucide-react"

// const placeholderItems: string[] = [
//   'Search "milk"',
//   'Search "bread"',
//   'Search "sugar"',
//   'Search "butter"',
//   'Search "paneer"',
//   'Search "chocolate"',
//   'Search "curd"',
//   'Search "rice"',
//   'Search "egg"',
//   'Search "chips"',
// ]

// export default function AnimatedSearchInput() {
//   const [index, setIndex] = useState<number>(0)
//   const [inputValue, setInputValue] = useState<string>("")

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setIndex((prev) => (prev + 1) % placeholderItems.length)
//     }, 2000)
//     return () => clearInterval(interval)
//   }, [])

//   return (
//     <div className="relative w-full md:w-96"> {/* ⬅️ Increased width */}
//       {/* Search icon */}
//       <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />

//       {/* Input field with left padding for the icon */}
//       <input
//         type="text"
//         value={inputValue}
//         onChange={(e) => setInputValue(e.target.value)}
//         className="pl-10 pr-3 py-2 rounded-lg border focus:outline-none focus:ring w-full"
//       />

//       {/* Animated placeholder overlay (only when empty) */}
//       {inputValue === "" && (
//         <div className="absolute left-10 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none overflow-hidden h-[20px]">
//           <div
//             style={{
//               transform: `translateY(-${index * 20}px)`,
//               transition: "transform 0.5s ease-in-out",
//             }}
//           >
//             {placeholderItems.map((text, i) => (
//               <div key={i} className="h-[20px] flex items-center">
//                 {text}
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }



"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

const placeholderItems: string[] = [
  'Search "milk"',
  'Search "bread"',
  'Search "sugar"',
  'Search "butter"',
  'Search "paneer"',
  'Search "chocolate"',
  'Search "curd"',
  'Search "rice"',
  'Search "egg"',
  'Search "chips"',
];

interface SearchResult {
  product_slagurl: string;
  category_slagurl: string;
  productname: string;
  categoryname: string;
}

export default function AnimatedSearchInput() {
  const router = useRouter();
  const [index, setIndex] = useState<number>(0);
  const [inputValue, setInputValue] = useState<string>("");
  const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  // Rotate placeholder
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % placeholderItems.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Fetch suggestions when typing
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (inputValue.trim().length < 2) {
        setSuggestions([]);
        return;
      }

      try {
        setLoading(true);
        const res = await fetch(
          `https://forestgarden.nexusitsoftech.com/api/Products/searchbytext?searchText=${encodeURIComponent(
            inputValue
          )}`
        );
        const data = await res.json();
        const productArray = Array.isArray(data) ? data : data?.data || [];
        setSuggestions(productArray);
      } catch (error) {
        console.error("Error fetching search suggestions:", error);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 400);
    return () => clearTimeout(debounceTimer);
  }, [inputValue]);

  // Handle search submit
  const handleSearch = (value?: string) => {
    const query = value || inputValue.trim();
    if (query) {
      router.push(`/products/search?query=${encodeURIComponent(query)}`);
      setSuggestions([]); // hide suggestions
    }
  };

  return (
    <div className="relative w-full md:w-96">
      {/* Search Icon */}
      <Search
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 cursor-pointer"
        onClick={() => handleSearch()}
      />

      {/* Input */}
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSearch();
        }}
        placeholder=""
        className="pl-10 pr-3 py-2 rounded-lg border focus:outline-none focus:ring w-full"
      />

      {/* Animated placeholder overlay */}
      {inputValue === "" && (
        <div className="absolute left-10 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none overflow-hidden h-[20px]">
          <div
            style={{
              transform: `translateY(-${index * 20}px)`,
              transition: "transform 0.5s ease-in-out",
            }}
          >
            {placeholderItems.map((text, i) => (
              <div key={i} className="h-[20px] flex items-center">
                {text}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Suggestions dropdown */}
      {suggestions.length > 0 && (
        <ul className="absolute z-50 mt-1 left-0 w-full bg-white border rounded-lg shadow-md max-h-60 overflow-y-auto">
          {loading && (
            <li className="px-4 py-2 text-gray-400 text-sm">Loading...</li>
          )}
          {suggestions.map((item, i) => (
            <li
              key={i}
              onClick={() => handleSearch(item.productname)}
              className="px-4 py-2 cursor-pointer hover:bg-gray-100"
            >
              <div className="font-medium">{item.productname}</div>
              <div className="text-sm text-gray-500">
                {item.categoryname}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
