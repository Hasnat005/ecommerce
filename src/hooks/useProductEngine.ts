import { useMemo, useState } from "react";
import type { Product } from "@/types";
import { mergeSort } from "@/lib/algorithms/mergeSort";

const DEFAULT_ITEMS_PER_PAGE = 9;

export type SortKey = "price-asc" | "price-desc" | "rating";

type UseProductEngineResult = {
  currentProducts: Product[];
  totalPages: number;
  currentPage: number;
  setSortKey: (key: SortKey) => void;
  setCategory: (category: string | "All") => void;
  setPriceRange: (range: [number, number]) => void;
  goToPage: (page: number) => void;
  sortKey: SortKey;
  activeCategory: string | "All";
  priceRange: [number, number];
  availablePriceRange: { min: number; max: number };
  totalItems: number;
};

function getNumericPrice(price: Product["price"]): number {
  if (typeof price === "number") {
    return price;
  }

  const cleaned = parseFloat(String(price).replace(/[^0-9.]/g, ""));
  return Number.isFinite(cleaned) ? cleaned : 0;
}

function calculateBounds(products: Product[]): { min: number; max: number } {
  if (products.length === 0) {
    return { min: 0, max: 0 };
  }

  const prices = products
    .map((product) => getNumericPrice(product.price))
    .filter((value) => Number.isFinite(value));

  if (prices.length === 0) {
    return { min: 0, max: 0 };
  }

  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
  };
}

export function useProductEngine(
  rawProducts: Product[],
  itemsPerPage: number = DEFAULT_ITEMS_PER_PAGE
): UseProductEngineResult {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sortKey, setSortKey] = useState<SortKey>("price-asc");
  const [activeCategory, setActiveCategory] = useState<string | "All">("All");

  const globalPriceBounds = useMemo(() => calculateBounds(rawProducts), [rawProducts]);

  const [priceRange, setPriceRangeState] = useState<[number, number]>([
    globalPriceBounds.min,
    globalPriceBounds.max,
  ]);

  const filteredProductsByCategory = useMemo(() => {
    if (activeCategory === "All") {
      return rawProducts;
    }
    return rawProducts.filter((product) => product.category === activeCategory);
  }, [activeCategory, rawProducts]);

  const availablePriceRange = useMemo(() => {
    if (filteredProductsByCategory.length === 0) {
      return globalPriceBounds;
    }

    return calculateBounds(filteredProductsByCategory);
  }, [filteredProductsByCategory, globalPriceBounds]);

  const filteredProducts = useMemo(() => {
    if (filteredProductsByCategory.length === 0) {
      return [] as Product[];
    }

    return filteredProductsByCategory.filter((product) => {
      const numericPrice = getNumericPrice(product.price);
      if (!Number.isFinite(numericPrice)) {
        return false;
      }
      return numericPrice >= priceRange[0] && numericPrice <= priceRange[1];
    });
  }, [filteredProductsByCategory, priceRange]);

  const sortedProducts = useMemo(() => {
    const direction = sortKey === "price-desc" ? "desc" : "asc";

    if (sortKey === "rating") {
      return mergeSort(filteredProducts, {
        key: "rating",
        direction: "desc",
      });
    }

    return mergeSort(filteredProducts, {
      comparator: (productA, productB) => {
        const priceA = getNumericPrice(productA.price);
        const priceB = getNumericPrice(productB.price);
        const comparison = priceA - priceB;
        return direction === "asc" ? comparison : -comparison;
      },
    });
  }, [filteredProducts, sortKey]);

  const totalItems = sortedProducts.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  const adjustedPage = Math.min(currentPage, totalPages);

  const currentProducts = useMemo(() => {
    const startIndex = (adjustedPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedProducts.slice(startIndex, endIndex);
  }, [adjustedPage, itemsPerPage, sortedProducts]);

  const handleGoToPage = (page: number) => {
    if (Number.isNaN(page)) return;
    const clamped = Math.min(Math.max(page, 1), totalPages);
    setCurrentPage(clamped);
  };

  const handleSetSortKey = (key: SortKey) => {
    setSortKey(key);
    setCurrentPage(1);
  };

  const handleSetCategory = (category: string | "All") => {
    setActiveCategory(category);

    const categoryProducts =
      category === "All"
        ? rawProducts
        : rawProducts.filter((product) => product.category === category);

    const bounds = calculateBounds(categoryProducts.length ? categoryProducts : rawProducts);

    setPriceRangeState([bounds.min, bounds.max]);
    setCurrentPage(1);
  };

  const handleSetPriceRange = (range: [number, number]) => {
    const [requestedMin, requestedMax] = range;

    if (!Number.isFinite(requestedMin) || !Number.isFinite(requestedMax)) {
      return;
    }

    const clampedMin = Math.max(availablePriceRange.min, Math.min(requestedMin, availablePriceRange.max));
    const clampedMax = Math.max(clampedMin, Math.min(requestedMax, availablePriceRange.max));

    let rangeChanged = false;

    setPriceRangeState((previous) => {
      const previousMin = previous[0];
      const previousMax = previous[1];

      if (previousMin === clampedMin && previousMax === clampedMax) {
        return previous;
      }

      rangeChanged = true;
      return [clampedMin, clampedMax];
    });

    if (rangeChanged) {
      setCurrentPage(1);
    }
  };

  return {
    currentProducts,
    totalPages,
    currentPage: adjustedPage,
    goToPage: handleGoToPage,
    setSortKey: handleSetSortKey,
    setCategory: handleSetCategory,
    setPriceRange: handleSetPriceRange,
    sortKey,
    activeCategory,
    priceRange,
    availablePriceRange,
    totalItems,
  };
}
