import React from 'react';
import { useApp } from '../../context/AppContext';
import { ProductCard } from './ProductCard';
import { ProductFilters } from './ProductFilters';
import { Search, FilterX, Cpu, Sparkles } from 'lucide-react';

export function ProductGrid() {
  const { products, filters, resetFilters } = useApp();

  // Apply filters
  const filteredProducts = (products || []).filter(product => {
    if (!product) return false;

    // Status filter
    if (product.status && product.status !== 'published') return false;

    // Search query
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      const matchTitle = (product.title || '').toLowerCase().includes(q);
      const matchBrand = (product.brand || '').toLowerCase().includes(q);
      const matchCategory = (product.category || '').toLowerCase().includes(q);
      const matchDesc = (product.description || '').toLowerCase().includes(q);
      if (!matchTitle && !matchBrand && !matchCategory && !matchDesc) return false;
    }

    // Category filter with intelligent alias matching
    if (filters.category && filters.category !== 'all') {
      const fCat = filters.category.toLowerCase().trim();
      const pCat = (product.category || '').toLowerCase().trim();
      const pSub = (product.subcategory || '').toLowerCase().trim();
      const pTitle = (product.title || '').toLowerCase().trim();
      
      const isDirectMatch = pCat === fCat || pCat.includes(fCat) || fCat.includes(pCat);
      const isDesktopMatch = (fCat.includes('desktop') || fCat === 'desktops') && (pCat.includes('desktop') || pCat === 'desktops');
      const isLaptopMatch = fCat.includes('laptop') && pCat.includes('laptop');
      const isKeyboardMatch = (fCat.includes('keyboard') || fCat.includes('keyboards')) && pCat.includes('keyboard');
      const isMouseMatch = (fCat.includes('mouse') || fCat.includes('mice') || fCat.includes('pads')) && (pCat.includes('mouse') || pCat.includes('pads'));
      const isAccessoriesMatch = (fCat.includes('accessor') || fCat.includes('audio & headsets') || fCat.includes('accessories')) && 
        (pCat.includes('headphone') || pCat.includes('audio') || pCat.includes('accessor') || pCat.includes('cable') || pCat.includes('dock') || pCat.includes('monitor') || pCat.includes('mic') || pCat.includes('stream'));
      
      const isGpuMatch = (fCat.includes('graphic') || fCat.includes('gpu')) && 
        (pCat.includes('graphic') || pCat.includes('gpu') || pSub.includes('gpu') || pSub.includes('graphics'));
      const isCpuMatch = (fCat.includes('processor') || fCat.includes('cpu')) && 
        (pCat.includes('processor') || pCat.includes('cpu') || pSub.includes('cpu') || pSub.includes('processor'));
      const isMoboMatch = fCat.includes('motherboard') && 
        (pCat.includes('motherboard') || pSub.includes('motherboard'));
      const isRamMatch = (fCat.includes('ram') || fCat.includes('memory')) && 
        (pCat.includes('ram') || pCat.includes('memory') || pSub.includes('ram'));
      const isStorageMatch = (fCat.includes('storage') || fCat.includes('ssd')) && 
        (pCat.includes('storage') || pCat.includes('ssd') || pSub.includes('storage') || pSub.includes('ssd') || pSub.includes('hdd'));
      const isPsuMatch = (fCat.includes('power suppl') || fCat.includes('psu')) && 
        (pCat.includes('power suppl') || pCat.includes('psu') || pSub.includes('psu') || pSub.includes('power'));
      const isCoolerMatch = (fCat.includes('cooler') || fCat.includes('cooling')) && 
        (pCat.includes('cooler') || pCat.includes('cooling') || pSub.includes('cpu_cooler') || pSub.includes('cooling') || pSub.includes('cooler') || pTitle.includes('cooler') || pTitle.includes('liquid') || pTitle.includes('fan'));
      const isCaseMatch = (fCat.includes('case') || fCat.includes('cabinet')) && 
        (pCat.includes('case') || pCat.includes('cabinet') || pSub.includes('pc_case') || pSub.includes('case') || pTitle.includes('case') || pTitle.includes('chassis'));
      
      const isComponentsMatch = (fCat.includes('component') || fCat === 'components') && 
        (isGpuMatch || isCpuMatch || isMoboMatch || isRamMatch || isStorageMatch || isPsuMatch || isCoolerMatch || isCaseMatch ||
         pCat.includes('gpu') || pCat.includes('cpu') || pCat.includes('ram') || pCat.includes('storage') || pCat.includes('ssd') || pCat.includes('motherboard') || pCat.includes('processor') || pCat.includes('graphics') || pCat.includes('power supply') || pCat.includes('psu') || pSub.includes('psu') || pSub.includes('cpu_cooler') || pSub.includes('cooling') || pSub.includes('pc_case') || pCat.includes('case') || pCat.includes('cooler'));

      if (!isDirectMatch && !isDesktopMatch && !isLaptopMatch && !isKeyboardMatch && !isMouseMatch && !isAccessoriesMatch && !isComponentsMatch && !isGpuMatch && !isCpuMatch && !isMoboMatch && !isRamMatch && !isStorageMatch && !isPsuMatch && !isCoolerMatch && !isCaseMatch) {
        return false;
      }
    }

    // Condition
    if (filters.condition && filters.condition !== 'all' && (product.condition || '').toLowerCase() !== filters.condition.toLowerCase()) {
      return false;
    }

    // Price
    if (product.price != null && filters.maxPrice != null && product.price > filters.maxPrice) {
      return false;
    }

    // Brand
    if (filters.brand && filters.brand !== 'all' && (product.brand || '').toLowerCase() !== filters.brand.toLowerCase()) {
      return false;
    }

    // Location
    if (filters.location && filters.location !== 'all' && (product.location || '').toLowerCase() !== filters.location.toLowerCase()) {
      return false;
    }

    return true;
  });

  // Apply sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (filters.sortBy === 'newest') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    if (filters.sortBy === 'price_low') {
      return a.price - b.price;
    }
    if (filters.sortBy === 'price_high') {
      return b.price - a.price;
    }
    if (filters.sortBy === 'rating') {
      return b.sellerRating - a.sellerRating;
    }
    // Default relevance: Sponsored & Featured first
    const aWeight = (a.isSponsored ? 100 : 0) + (a.isFeatured ? 50 : 0);
    const bWeight = (b.isSponsored ? 100 : 0) + (b.isFeatured ? 50 : 0);
    return bWeight - aWeight;
  });

  return (
    <div className="max-w-[1440px] 2xl:max-w-[1560px] mx-auto px-3.5 sm:px-6 lg:px-8 xl:px-10 pt-4 pb-28 md:py-8">
      {/* Title & Stats */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <Cpu className="w-6 h-6 text-indigo-600" />
            Computer Accessories & Electronics
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Showing <span className="font-bold text-slate-900">{sortedProducts.length}</span> verified hardware listings
            {filters.category !== 'all' && <span> in <strong className="text-indigo-600">{filters.category}</strong></span>}
            {filters.condition !== 'all' && <span> ({filters.condition})</span>}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <ProductFilters />
        </div>

        {/* Products Grid */}
        <div className="lg:col-span-3">
          {sortedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4 md:gap-6">
              {sortedProducts.map(product => (
                <div key={product.id}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="glossy-card rounded-3xl p-12 text-center text-slate-500 space-y-4 shadow-xs">
              <div className="w-16 h-16 rounded-full bg-indigo-50/80 flex items-center justify-center mx-auto text-indigo-500">
                <FilterX className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">No Matching Products Found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                We couldn't find any hardware matching your active filter criteria. Try adjusting your max price or resetting filters.
              </p>
              <button
                onClick={resetFilters}
                className="glossy-pill-btn text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
