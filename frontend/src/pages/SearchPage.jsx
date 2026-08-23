import React, { useState, useEffect } from 'react';
import { Search, Filter, SortAsc, LayoutGrid, MapPin, DollarSign, ArrowRight, Loader2, X, Plus } from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

export default function SearchPage() {
    const [activeTab, setActiveTab] = useState('activities'); // 'activities' | 'cities'
    const [query, setQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [maxCostFilter, setMaxCostFilter] = useState('');
    const [countryFilter, setCountryFilter] = useState('');
    
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // Modal State
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [trips, setTrips] = useState([]);
    const [selectedTrip, setSelectedTrip] = useState(null);
    const [stops, setStops] = useState([]);
    const [selectedStopId, setSelectedStopId] = useState('');
    const [adding, setAdding] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');

    useEffect(() => {
        const fetchResults = async () => {
            setLoading(true);
            try {
                let url = `http://localhost:5000/api/search?type=${activeTab}&query=${query}`;
                if (activeTab === 'activities') {
                    if (categoryFilter) url += `&category=${categoryFilter}`;
                    if (maxCostFilter) url += `&max_cost=${maxCostFilter}`;
                } else {
                    if (countryFilter) url += `&country=${countryFilter}`;
                }
                
                const res = await axios.get(url);
                setResults(res.data);
            } catch (err) {
                console.error("Search failed", err);
            } finally {
                setLoading(false);
            }
        };
        
        const timeoutId = setTimeout(() => {
            fetchResults();
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [query, activeTab, categoryFilter, maxCostFilter, countryFilter]);

    // Fetch trips when modal opens
    useEffect(() => {
        if (selectedActivity && trips.length === 0) {
            const fetchTrips = async () => {
                try {
                    const token = localStorage.getItem('token');
                    if (!token) return;
                    const res = await axios.get('http://localhost:5000/api/trips', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setTrips(res.data);
                } catch (err) {
                    console.error("Failed to fetch trips", err);
                }
            };
            fetchTrips();
        }
    }, [selectedActivity, trips.length]);

    // Fetch stops when a trip is selected
    useEffect(() => {
        if (selectedTrip) {
            const fetchStops = async () => {
                try {
                    const token = localStorage.getItem('token');
                    const res = await axios.get(`http://localhost:5000/api/trips/${selectedTrip}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setStops(res.data.stops || []);
                    setSelectedStopId(res.data.stops?.[0]?.stop_id || '');
                } catch (err) {
                    console.error("Failed to fetch stops", err);
                }
            };
            fetchStops();
        } else {
            setStops([]);
            setSelectedStopId('');
        }
    }, [selectedTrip]);

    const handleAddActivity = async () => {
        if (!selectedStopId || !selectedActivity) return;
        setAdding(true);
        try {
            const token = localStorage.getItem('token');
            await axios.post(`http://localhost:5000/api/stops/${selectedStopId}/activities`, {
                name: selectedActivity.name,
                category: selectedActivity.category || 'General',
                time: '',
                cost: selectedActivity.estimated_cost || 0
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSuccessMsg('Added successfully!');
            setTimeout(() => {
                setSuccessMsg('');
                setSelectedActivity(null);
                setSelectedTrip(null);
            }, 2000);
        } catch (err) {
            console.error("Failed to add", err);
            alert("Failed to add");
        } finally {
            setAdding(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white mb-6">Discover</h1>
            
            {/* Tabs */}
            <div className="flex gap-4 mb-8 border-b border-slate-200 dark:border-slate-800 pb-px">
                <button 
                    onClick={() => { setActiveTab('activities'); setQuery(''); }}
                    className={`pb-4 px-2 text-sm font-bold border-b-2 transition-colors ${activeTab === 'activities' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                >
                    Activity Search
                </button>
                <button 
                    onClick={() => { setActiveTab('cities'); setQuery(''); }}
                    className={`pb-4 px-2 text-sm font-bold border-b-2 transition-colors ${activeTab === 'cities' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                >
                    City Search
                </button>
            </div>
            
            {/* Search Toolbar */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10 p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="w-5 h-5 text-slate-400" />
                    </div>
                    <input 
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder={activeTab === 'activities' ? "Search activities..." : "Search cities..."}
                        className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:border-blue-500 transition-colors"
                    />
                </div>
                
                {/* Dynamic Filters */}
                <div className="flex gap-2">
                    {activeTab === 'activities' ? (
                        <>
                            <select 
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                className="px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 outline-none"
                            >
                                <option value="">All Categories</option>
                                <option value="Food">Food</option>
                                <option value="Sightseeing">Sightseeing</option>
                                <option value="Entertainment">Entertainment</option>
                            </select>
                            <select 
                                value={maxCostFilter}
                                onChange={(e) => setMaxCostFilter(e.target.value)}
                                className="px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 outline-none"
                            >
                                <option value="">Any Cost</option>
                                <option value="50">Under ₹50</option>
                                <option value="100">Under ₹100</option>
                                <option value="200">Under ₹200</option>
                            </select>
                        </>
                    ) : (
                        <select 
                            value={countryFilter}
                            onChange={(e) => setCountryFilter(e.target.value)}
                            className="px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 outline-none"
                        >
                            <option value="">All Countries</option>
                            <option value="France">France</option>
                            <option value="Japan">Japan</option>
                            <option value="USA">USA</option>
                        </select>
                    )}
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
                                    <span className="flex items-center gap-1.5">
                                        <MapPin className="w-4 h-4" /> 
                                        {activeTab === 'activities' ? `${item.city_name}, ${item.country}` : item.country}
                                    </span>
                                    {activeTab === 'activities' && (
                                        <>
                                            <span className="flex items-center gap-1.5"><DollarSign className="w-4 h-4" /> Est. ₹{item.estimated_cost}</span>
                                            <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs">{item.category}</span>
                                        </>
                                    )}
                                </div>
                            </div>
                            <button 
                                onClick={() => {
                                    if (localStorage.getItem('token')) {
                                        setSelectedActivity(item);
                                        setSelectedTrip('');
                                    } else {
                                        alert("Please login first.");
                                    }
                                }}
                                className="mt-4 sm:mt-0 px-6 py-2.5 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-bold hover:bg-blue-600 hover:text-white transition-colors flex items-center justify-center gap-2"
                            >
                                Add to Trip <ArrowRight className="w-4 h-4" />
                            </button>
                        </motion.div>
                    ))
                ) : (
                    <div className="text-center py-20 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 border-dashed text-slate-500">
                        No results found matching your search.
                    </div>
                )}
            </div>

            {/* Add to Trip Modal */}
            <AnimatePresence>
                {selectedActivity && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl relative"
                        >
                            <button 
                                onClick={() => setSelectedActivity(null)}
                                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-full bg-slate-100 dark:bg-slate-800 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
                                Add {activeTab === 'cities' ? 'City' : 'Activity'}
                            </h3>
                            <p className="text-slate-500 mb-6 font-medium text-sm">
                                Adding <strong className="text-blue-600">{selectedActivity.name}</strong> to your itinerary.
                            </p>

                            {successMsg ? (
                                <div className="p-4 bg-emerald-50 text-emerald-600 rounded-xl font-bold text-center">
                                    {successMsg}
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Select Trip</label>
                                        <select 
                                            value={selectedTrip || ''} 
                                            onChange={(e) => setSelectedTrip(e.target.value)}
                                            className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-blue-500 transition-colors font-medium"
                                        >
                                            <option value="" disabled>Select a trip...</option>
                                            {trips.map(t => <option key={t.trip_id} value={t.trip_id}>{t.name}</option>)}
                                        </select>
                                    </div>

                                    {selectedTrip && (
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Select Section / Stop</label>
                                            {stops.length > 0 ? (
                                                <select 
                                                    value={selectedStopId} 
                                                    onChange={(e) => setSelectedStopId(e.target.value)}
                                                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-blue-500 transition-colors font-medium"
                                                >
                                                    {stops.map((s, idx) => (
                                                        <option key={s.stop_id} value={s.stop_id}>{s.city || `Section ${idx + 1}`}</option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <div className="p-3 bg-amber-50 text-amber-700 rounded-xl text-sm font-bold">
                                                    This trip has no sections yet. Please build your itinerary sections first.
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <button
                                        onClick={handleAddActivity}
                                        disabled={adding || !selectedStopId}
                                        className="w-full py-3.5 mt-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                                    >
                                        {adding ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                                        {adding ? 'Adding...' : 'Confirm Addition'}
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
