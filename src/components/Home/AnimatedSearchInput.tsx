
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Search } from "lucide-react";
import { API_ROUTES } from "@/utils/api";
import { API_BASE_URL } from "@/utils/api";
import type { Product } from "@/lib/data";

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

type SearchResult = Pick<
  Product,
  "id" | "productName" | "productSlug" | "productCode" | "defaultImage" | "dp" | "categoryId"
> & {
  category?: { name?: string } | null;
  brand?: { name?: string } | null;
};

export default function AnimatedSearchInput() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [index, setIndex] = useState<number>(0);
  const [inputValue, setInputValue] = useState<string>("");
  const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const RECENT_KEY = "blinkit_recent_searches";

  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    if (!open) return;
    try {
      const raw = localStorage.getItem(RECENT_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      setRecentSearches(Array.isArray(parsed) ? parsed.filter((s) => typeof s === "string") : []);
    } catch {
      setRecentSearches([]);
    }
  }, [open]);

  const resolveImg = (url?: string | null) => {
    if (!url) return "/no-image.png";
    if (url.startsWith("http")) return url;
    return `${API_BASE_URL}${url}`;
  };

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
          `${API_ROUTES.PRODUCTS}/search?q=${encodeURIComponent(inputValue)}`
        );
        const data = await res.json();

        const payload = data?.data ?? null;
        const suggestionArray = Array.isArray(payload?.suggestions)
          ? payload.suggestions
          : Array.isArray(payload?.items)
          ? payload.items
          : Array.isArray(payload)
          ? payload
          : [];

        setSuggestions(suggestionArray);
        setActiveIndex(-1);
      } catch (error) {
        console.error("Error fetching search suggestions:", error);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 400);
    return () => clearTimeout(debounceTimer);
  }, [inputValue]);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!containerRef.current) return;
      if (containerRef.current.contains(e.target as Node)) return;
      setOpen(false);
      setActiveIndex(-1);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const saveRecent = (q: string) => {
    if (typeof window === "undefined") return;
    const trimmed = q.trim();
    if (!trimmed) return;

    try {
      const raw = localStorage.getItem(RECENT_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      const arr = Array.isArray(parsed) ? parsed.filter((s) => typeof s === "string") : [];
      const next = [trimmed, ...arr.filter((s) => s.toLowerCase() !== trimmed.toLowerCase())].slice(0, 6);
      localStorage.setItem(RECENT_KEY, JSON.stringify(next));
      setRecentSearches(next);
    } catch {
      // ignore storage errors
    }
  };

  const goToSearchResults = (query: string) => {
    const q = query.trim();
    if (!q) return;
    saveRecent(q);
    router.push(`/products/search?query=${encodeURIComponent(q)}`);
    setOpen(false);
    setSuggestions([]);
    setActiveIndex(-1);
  };

  const goToProduct = (item: SearchResult) => {
    const slug = item.productSlug || item.productCode || "";
    const categoryId = item.categoryId ? String(item.categoryId) : "";
    if (!slug || !categoryId) return goToSearchResults(item.productName || "");
    saveRecent(item.productName || "");
    router.push(`/products/${encodeURIComponent(categoryId)}/${encodeURIComponent(slug)}`);
    setOpen(false);
    setSuggestions([]);
    setActiveIndex(-1);
  };

  // Handle search submit
  const handleSearch = (value?: string) => {
    const query = value || inputValue.trim();
    if (query) {
      goToSearchResults(query);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full md:w-[26rem]">
      {/* Search Icon */}
      <Search
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 cursor-pointer z-10"
        onClick={() => handleSearch()}
      />

      {/* Input */}
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            if (open && activeIndex >= 0 && activeIndex < suggestions.length) {
              e.preventDefault();
              goToProduct(suggestions[activeIndex]);
              return;
            }
            handleSearch();
          }
          if (e.key === "ArrowDown") {
            if (!open) setOpen(true);
            e.preventDefault();
            setActiveIndex((prev) => Math.min(prev + 1, suggestions.length - 1));
          }
          if (e.key === "ArrowUp") {
            e.preventDefault();
            setActiveIndex((prev) => Math.max(prev - 1, -1));
          }
          if (e.key === "Escape") {
            setOpen(false);
            setActiveIndex(-1);
          }
        }}
        placeholder=""
        className="pl-10 pr-3 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500/40 w-full"
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
      {open && (
        <div className="absolute z-50 mt-2 left-0 w-full bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden">
          {inputValue.trim().length < 2 && recentSearches.length > 0 && (
            <div className="p-3">
              <div className="text-xs font-semibold text-gray-500 mb-2">Recent Searches</div>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => goToSearchResults(q)}
                    className="px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-sm text-gray-700"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {inputValue.trim().length >= 2 && (
            <div className="max-h-[22rem] overflow-y-auto">
              {loading && (
                <div className="px-4 py-3 text-gray-400 text-sm">Searching...</div>
              )}

              {!loading && suggestions.length === 0 && (
                <div className="px-4 py-3 text-gray-500 text-sm">No results</div>
              )}

              {suggestions.map((item, i) => {
                const img = resolveImg(item.defaultImage);
                const meta = item.brand?.name || item.category?.name || "";
                const active = i === activeIndex;

                return (
                  <button
                    key={`${item.id}-${i}`}
                    type="button"
                    onMouseEnter={() => setActiveIndex(i)}
                    onClick={() => goToProduct(item)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 ${
                      active ? "bg-gray-50" : ""
                    }`}
                  >
                    <div className="h-10 w-10 rounded-lg bg-gray-100 overflow-hidden relative flex-shrink-0">
                      <Image src={img} alt={item.productName || "Product"} fill className="object-contain" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate">{item.productName}</div>
                      {meta && <div className="text-xs text-gray-500 truncate">{meta}</div>}
                    </div>
                    <div className="text-sm font-semibold text-gray-800 whitespace-nowrap">
                      â‚¹{Number(item.dp ?? 0)}
                    </div>
                  </button>
                );
              })}

              {suggestions.length > 0 && (
                <button
                  type="button"
                  onClick={() => goToSearchResults(inputValue)}
                  className="w-full px-4 py-3 text-sm font-semibold text-green-700 hover:bg-green-50 border-t border-gray-100"
                >
                  View all results for â€œ{inputValue.trim()}â€
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
