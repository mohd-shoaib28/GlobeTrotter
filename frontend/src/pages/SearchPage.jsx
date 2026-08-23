import React, { useState, useEffect } from 'react';
import { Search, Filter, SortAsc, LayoutGrid, MapPin, DollarSign, ArrowRight, Loader2 } from 'lucide-react';
import axios from 'axios';
import { motion } from 'framer-motion';

export default function SearchPage() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchResults = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`http://localhost:5000/api/search?query=${query}`);
                setResults(res.data);
            } catch (err) {
                console.error("Search failed", err);
            } finally {
                setLoading(false);
            }
        };
        
        // Debounce search
        const timeoutId = setTimeout(() => {
            fetchResults();
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [query]);

    return (
        <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white mb-8">Discover Activities</h1>
            
            {/* Search Toolbar (Screen 8 Requirement) */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10 p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="w-5 h-5 text-slate-400" />
                    </div>
                    <input 
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search for cities or activities (e.g., Paragliding, Paris)"
                        className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:border-blue-500 transition-colors"
                    />
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2">
                        <LayoutGrid className="w-4 h-4" /> Group by
                    </button>
                    <button className="px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2">
                        <Filter className="w-4 h-4" /> Filter
                    </button>
                    <button className="px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2">
                        <SortAsc className="w-4 h-4" /> Sort by...
                    </button>
                </div>
            </div>

            {/* Results List */}
            <div className="space-y-4">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Results</h2>
                
                {loading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                    </div>
                ) : results.length > 0 ? (
                    results.map((item, idx) => (
                        <motion.div 
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between hover:border-blue-500 hover:shadow-md transition-all group"
                        >
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{item.name}</h3>
                                <div className="flex items-center gap-4 text-sm font-semibold text-slate-500">
                                    <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {item.city_name}, {item.country}</span>
                                    <span className="flex items-center gap-1.5"><DollarSign className="w-4 h-4" /> Est. ${item.estimated_cost}</span>
                                    <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs">{item.category}</span>
                                </div>
                            </div>
                            <button className="mt-4 sm:mt-0 px-6 py-2.5 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-bold hover:bg-blue-600 hover:text-white transition-colors flex items-center justify-center gap-2">
                                Add to Trip <ArrowRight className="w-4 h-4" />
                            </button>
                        </motion.div>
                    ))
                ) : (
                    <div className="text-center py-20 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 border-dashed text-slate-500">
                        No activities found matching your search.
                    </div>
                )}
            </div>
        </div>
    );
}
