import React from 'react';
import { useApp } from '../context/AppContext';
import { Cpu, ArrowRight, Sparkles } from 'lucide-react';

export function CategoriesPage() {
  const { categories, setFilters, setCurrentView } = useApp();

  return (
    <div className="max-w-[1440px] 2xl:max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-10 space-y-8">
      <div>
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <span className="text-xs font-black text-indigo-600 uppercase tracking-widest">Hardware Catalog</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 mt-1">
          Hardware & Accessory Categories
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">Browse computer systems, gaming peripherals, and high-performance components</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {categories.map(cat => (
          <div
            key={cat.id}
            onClick={() => {
              setFilters(prev => ({ ...prev, category: cat.name }));
              setCurrentView('products');
            }}
            className="glossy-card glossy-card-hover glossy-glass-shine rounded-3xl p-6 cursor-pointer group space-y-4 shadow-xs"
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 group-hover:border-indigo-300 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-all shadow-xs">
              <Cpu className="w-7 h-7" />
            </div>

            <div>
              <h3 className="font-extrabold text-slate-900 text-lg group-hover:text-indigo-600 transition-colors">{cat.name}</h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{cat.description}</p>
            </div>

            <div className="flex items-center text-xs font-bold text-indigo-600 gap-1.5 pt-2 border-t border-slate-100/80">
              <span>Explore {cat.name}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
