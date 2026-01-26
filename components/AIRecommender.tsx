
import React, { useEffect, useState } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { geminiService } from '../services/geminiService';
import { MOCK_RESOURCES } from '../services/mockData';
import { Resource, TVETCategory } from '../types';
import ResourceCard from './ResourceCard';

interface AIRecommenderProps {
  userCategory: TVETCategory;
  onBuy: (r: Resource) => void;
}

const AIRecommender: React.FC<AIRecommenderProps> = ({ userCategory, onBuy }) => {
  const [recommendations, setRecommendations] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecs = async () => {
      setLoading(true);
      const recIds = await geminiService.getRecommendations(userCategory, MOCK_RESOURCES);
      const filtered = MOCK_RESOURCES.filter(r => recIds.includes(r.id));
      // Fallback if AI fails or returns nothing relevant
      setRecommendations(filtered.length > 0 ? filtered : MOCK_RESOURCES.slice(0, 3));
      setLoading(false);
    };

    fetchRecs();
  }, [userCategory]);

  return (
    <section className="py-12 bg-blue-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg text-white shadow-lg shadow-blue-200">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">AI Smart Picks</h2>
              <p className="text-slate-500">Tailored resources for your <span className="font-semibold text-blue-600">{userCategory}</span> track</p>
            </div>
          </div>
          <button className="hidden md:flex items-center space-x-2 text-blue-600 font-bold hover:text-blue-700 transition-all">
            <span>View All</span>
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-2xl h-[400px] animate-pulse border border-slate-100" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {recommendations.map(resource => (
              <ResourceCard key={resource.id} resource={resource} onBuy={onBuy} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default AIRecommender;
