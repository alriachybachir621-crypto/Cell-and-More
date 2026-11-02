import React from 'react';
import { Smartphone, Headphones, Zap, Shield, ArrowUpRight } from 'lucide-react';
import { ProductCategory } from '@/types';

interface CategoryCardsProps {
  onSelectCategory: (category: ProductCategory) => void;
}

interface CategoryInfo {
  name: ProductCategory;
  title: string;
  description: string;
  icon: React.ElementType;
  gradient: string;
  badge: string;
}

const CATEGORIES: CategoryInfo[] = [
  {
    name: 'Phones',
    title: 'Phones & Devices',
    description: 'Flagship & budget smartphones: iPhone, Samsung Galaxy, Xiaomi, and more.',
    icon: Smartphone,
    gradient: 'from-blue-600/20 to-cyan-600/10',
    badge: 'Latest Series',
  },
  {
    name: 'Accessories',
    title: 'Accessories & Audio',
    description: 'AirPods, Bluetooth speakers, wireless earbuds, smartwatches & power banks.',
    icon: Headphones,
    gradient: 'from-purple-600/20 to-blue-600/10',
    badge: 'Hi-Fi & Wireless',
  },
  {
    name: 'Chargers & Cables',
    title: 'Chargers & Cables',
    description: 'GaN fast wall adapters, ultra-durable braided cables, MagSafe & car mounts.',
    icon: Zap,
    gradient: 'from-amber-600/20 to-blue-600/10',
    badge: 'Super Fast Charge',
  },
  {
    name: 'Cases & Screen Protectors',
    title: 'Cases & Screen Protectors',
    description: 'Drop-tested shockproof cases, privacy glass, ceramic protectors & camera rings.',
    icon: Shield,
    gradient: 'from-emerald-600/20 to-blue-600/10',
    badge: 'Max Protection',
  },
];

export const CategoryCards: React.FC<CategoryCardsProps> = ({ onSelectCategory }) => {
  return (
    <section className="py-12 sm:py-16 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12">
          <div>
            <div className="text-xs font-bold text-[#1E6FD9] tracking-wider uppercase mb-1">
              Store Departments
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Browse by Category
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 mt-2 sm:mt-0">
            Select a category to view in-stock items
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.name}
                onClick={() => onSelectCategory(cat.name)}
                className={`group relative text-left p-6 rounded-2xl bg-gradient-to-br ${cat.gradient} bg-zinc-950 border border-zinc-800/80 hover:border-[#1E6FD9] transition-all duration-300 transform hover:-translate-y-1.5 focus:outline-none overflow-hidden shadow-lg hover:shadow-[0_0_25px_rgba(30,111,217,0.2)]`}
              >
                {/* Background ambient light */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#1E6FD9]/10 rounded-full blur-2xl group-hover:bg-[#1E6FD9]/20 transition-all pointer-events-none"></div>

                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-700/60 flex items-center justify-center text-[#1E6FD9] group-hover:bg-[#1E6FD9] group-hover:text-white transition-all">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-zinc-900/80 text-zinc-400 border border-zinc-800 group-hover:border-[#1E6FD9]/40 group-hover:text-white transition-colors">
                    {cat.badge}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-[#1E6FD9] transition-colors flex items-center justify-between">
                  <span>{cat.title}</span>
                  <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </h3>

                <p className="mt-2 text-xs text-zinc-400 leading-relaxed">
                  {cat.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
