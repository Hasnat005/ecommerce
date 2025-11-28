"use client";

import { type ChangeEvent, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import ProductGrid from "@/components/product/ProductGrid";
import { useProductEngine, type SortKey } from "@/hooks/useProductEngine";
import { products as PRODUCT_DATA } from "@/lib/mockData";

const CATEGORY_OPTIONS: string[] = [
  "All",
  ...Array.from(
    new Set(
      PRODUCT_DATA.map((product) => product.category).filter((category): category is string => Boolean(category))
    )
  ),
];

const SORT_OPTIONS: { label: string; value: SortKey }[] = [
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Top Rated", value: "rating" },
];

const CategoryOption = ({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className="flex items-center space-x-3 cursor-pointer group text-left"
  >
    <span
      className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isActive ? "bg-gradient-to-br from-indigo-500 to-purple-500 border-transparent" : "border-slate-600 group-hover:border-slate-400"}`}
    >
      {isActive && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
        </motion.span>
      )}
    </span>
    <span className={`text-sm ${isActive ? "text-slate-100 font-medium" : "text-slate-400"}`}>{label}</span>
  </button>
);

export default function ShopPage() {
  const {
    currentProducts,
    totalPages,
    currentPage,
    goToPage,
    setSortKey,
    setCategory,
    setPriceRange,
    sortKey,
    activeCategory,
    priceRange,
    availablePriceRange,
    totalItems,
  } = useProductEngine(PRODUCT_DATA, 9);

  const gridKey = `${currentPage}-${sortKey}-${activeCategory}-${priceRange[0]}-${priceRange[1]}`;

  const priceFormatter = useMemo(
    () =>
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }),
    []
  );

  const sliderMin = Math.floor(availablePriceRange.min);
  const sliderMax = Math.ceil(availablePriceRange.max);
  const [selectedMin, selectedMax] = priceRange;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage, activeCategory, sortKey, selectedMin, selectedMax]);

  const handlePrev = () => goToPage(currentPage - 1);
  const handleNext = () => goToPage(currentPage + 1);

  const handleMinPriceChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextMin = Number(event.target.value);
    if (!Number.isFinite(nextMin)) {
      return;
    }
    const clampedMin = Math.max(sliderMin, Math.min(nextMin, sliderMax));
    const adjustedMax = Math.max(clampedMin, Math.min(selectedMax, sliderMax));
    setPriceRange([clampedMin, adjustedMax]);
  };

  const handleMaxPriceChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextMax = Number(event.target.value);
    if (!Number.isFinite(nextMax)) {
      return;
    }
    const clampedMax = Math.max(sliderMin, Math.min(nextMax, sliderMax));
    const adjustedMin = Math.min(clampedMax, Math.max(selectedMin, sliderMin));
    setPriceRange([adjustedMin, clampedMax]);
  };

  const handleResetPriceFilters = () => {
    setPriceRange([sliderMin, sliderMax]);
  };

  const formatPrice = (value: number) => priceFormatter.format(Math.max(0, Math.round(value)));

  const canAdjustPrice = Number.isFinite(sliderMin) && Number.isFinite(sliderMax) && sliderMax >= sliderMin;

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex flex-col md:flex-row gap-10 lg:gap-12">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-72 flex-shrink-0">
          <div className="sticky top-28 space-y-10 rounded-3xl border border-slate-800 bg-slate-950/70 p-6">
            <div className="pb-4 border-b border-slate-800">
              <h3 className="font-semibold text-lg text-slate-100 mb-4">Categories</h3>
              <div className="space-y-3">
                {CATEGORY_OPTIONS.map((category) => (
                  <CategoryOption
                    key={category}
                    label={category}
                    isActive={activeCategory === category}
                    onClick={() => setCategory(category === "All" ? "All" : category)}
                  />
                ))}
              </div>
            </div>

            <div className="pt-2">
              <h3 className="font-semibold text-lg text-slate-100 mb-4">Price Range</h3>
              {canAdjustPrice ? (
                <div className="space-y-4">
                  <div className="relative pt-3">
                    <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-slate-800" />
                    <div
                      className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                      style={{
                        left: `${((selectedMin - sliderMin) / Math.max(1, sliderMax - sliderMin)) * 100}%`,
                        right: `${((sliderMax - selectedMax) / Math.max(1, sliderMax - sliderMin)) * 100}%`,
                      }}
                    />
                    <input
                      type="range"
                      min={sliderMin}
                      max={sliderMax}
                      value={Math.min(selectedMin, selectedMax)}
                      onChange={handleMinPriceChange}
                      className="relative w-full appearance-none bg-transparent focus:outline-none"
                    />
                    <input
                      type="range"
                      min={sliderMin}
                      max={sliderMax}
                      value={Math.max(selectedMin, selectedMax)}
                      onChange={handleMaxPriceChange}
                      className="relative w-full appearance-none bg-transparent focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center justify-between text-sm text-slate-400">
                    <div>
                      <span className="uppercase text-xs text-slate-500">Min</span>
                      <p className="font-semibold text-slate-200">{formatPrice(Math.min(selectedMin, selectedMax))}</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleResetPriceFilters}
                      className="rounded-full border border-slate-700 px-3 py-1 text-xs font-medium text-slate-300 transition hover:border-indigo-500 hover:text-indigo-300"
                    >
                      Reset
                    </button>
                    <div className="text-right">
                      <span className="uppercase text-xs text-slate-500">Max</span>
                      <p className="font-semibold text-slate-200">{formatPrice(Math.max(selectedMin, selectedMax))}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="rounded-2xl border border-slate-800/80 bg-slate-950/60 px-4 py-6 text-sm text-slate-500">
                  No price filters available for this selection.
                </p>
              )}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-1">Shop All</h1>
              <p className="text-slate-400">
                Showing <span className="font-semibold text-slate-200">{totalItems}</span> curated items
                {activeCategory !== "All" && <span className="text-slate-500"> in {activeCategory}</span>}
              </p>
            </div>

            <label className="flex items-center gap-3 text-sm text-slate-300">
              <span className="uppercase tracking-wide text-xs font-semibold text-slate-500">Sort By</span>
              <select
                value={sortKey}
                onChange={(event) => setSortKey(event.target.value as SortKey)}
                className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <ProductGrid key={gridKey} products={currentProducts} animationKey={gridKey} />

          <div className="mt-10 flex items-center justify-between rounded-full border border-slate-800 bg-slate-950/70 px-4 py-2 text-sm text-slate-300">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentPage === 1}
              className="inline-flex items-center gap-2 rounded-full px-3 py-2 font-medium text-slate-200 transition disabled:cursor-not-allowed disabled:opacity-30 hover:bg-white/10"
            >
              <ChevronLeft className="h-4 w-4" /> Prev
            </button>
            <span className="text-slate-400">
              Page <span className="font-semibold text-slate-100">{currentPage}</span> of {totalPages}
            </span>
            <button
              type="button"
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className="inline-flex items-center gap-2 rounded-full px-3 py-2 font-medium text-slate-200 transition disabled:cursor-not-allowed disabled:opacity-30 hover:bg-white/10"
            >
              Next <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
