
import React from 'react';
import { Star, Download, FileText, Lock } from 'lucide-react';
import { Resource } from '../types';

interface ResourceCardProps {
  resource: Resource;
  onBuy: (r: Resource) => void;
  isPurchased?: boolean;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ resource, onBuy, isPurchased = false }) => {
  return (
    <div className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <img 
          src={resource.thumbnailUrl} 
          alt={resource.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
           <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider text-slate-800 shadow-lg border border-white/50">
             Preview Available
           </div>
        </div>
        {/* Simulated Watermarking */}
        {!isPurchased && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-20 rotate-45">
            <span className="text-3xl font-black text-slate-900 border-4 border-slate-900 px-4 whitespace-nowrap">CBET PREVIEW</span>
          </div>
        )}
        <div className="absolute top-3 left-3 flex space-x-1">
          <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase shadow-lg">
            {resource.category}
          </span>
          <span className="bg-slate-800 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase shadow-lg">
            {resource.fileType}
          </span>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-teal-600 uppercase tracking-wider">{resource.level}</span>
          <div className="flex items-center space-x-1 text-amber-500">
            <Star className="h-3.5 w-3.5 fill-current" />
            <span className="text-xs font-bold">{resource.rating}</span>
          </div>
        </div>
        
        <h3 className="font-bold text-slate-900 mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">
          {resource.title}
        </h3>
        <p className="text-sm text-slate-500 line-clamp-2 mb-4 h-10">
          {resource.description}
        </p>

        <div className="flex items-center justify-between mt-auto">
          <div className="flex flex-col">
            <span className="text-xs text-slate-400">Price</span>
            <span className="text-lg font-bold text-slate-900">Ksh {resource.price}</span>
          </div>
          
          {isPurchased ? (
            <button className="bg-teal-500 hover:bg-teal-600 text-white p-2.5 rounded-xl transition-all shadow-md active:scale-95">
              <Download className="h-5 w-5" />
            </button>
          ) : (
            <button 
              onClick={() => onBuy(resource)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-md active:scale-95 flex items-center space-x-2"
            >
              <span>Get Now</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResourceCard;
