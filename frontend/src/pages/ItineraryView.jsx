import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Search, Filter, SortAsc, LayoutGrid, ArrowLeft, Loader2, ArrowDown } from 'lucide-react';
import axios from 'axios';
import { motion } from 'framer-motion';

export default function ItineraryView() {
    const { tripId } = useParams();
    const navigate = useNavigate();
    const [trip, setTrip] = useState(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchTrip = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`http://localhost:5000/api/trips/${tripId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setTrip(res.data);
            } catch (err) {
                console.error("Failed to fetch trip", err);
            } finally {
                setLoading(false);
            }
        };
        fetchTrip();
    }, [tripId]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
            </div>
        );
    }

    if (!trip) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Trip not found</h2>
                <button onClick={() => navigate('/trips')} className="mt-4 text-blue-600 font-bold hover:underline">Return to My Trips</button>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
            <button 
                onClick={() => navigate('/trips')} 
                className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors mb-8"
            >
                <ArrowLeft className="w-4 h-4" /> Back to Trips
            </button>

            {/* Toolbar (Screen 9 Requirement) */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8 p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="w-5 h-5 text-slate-400" />
                    </div>
                    <input 
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search bar ......"
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

            <div className="text-center mb-10">
                <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Itinerary for {trip.name}</h1>
            </div>

            {/* Header row */}
            <div className="flex px-4 md:px-24 text-center font-bold text-slate-500 text-lg mb-6">
                <div className="flex-1 text-left">Physical Activity</div>
                <div className="w-32 text-right">Expense</div>
            </div>

            {/* Days Loop */}
            <div className="space-y-12">
                {trip.stops && trip.stops.length > 0 ? trip.stops.map((stop, sIndex) => (
                    <motion.div 
                        key={stop.stop_id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: sIndex * 0.1 }}
                        className="relative"
                    >
                        {/* Day Label (Left Floating) */}
                        <div className="absolute left-0 top-2 hidden md:block">
                            <div className="px-6 py-2 rounded-2xl border-2 border-slate-800 dark:border-slate-200 font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-900 shadow-sm">
                                Day {sIndex + 1}
                            </div>
                        </div>

                        {/* Activities List for this Day */}
                        <div className="md:ml-32">
                            {/* Mobile Day Label */}
                            <div className="md:hidden mb-4">
                                <div className="inline-block px-4 py-1.5 rounded-xl border border-slate-800 font-bold text-sm">Day {sIndex + 1} ({stop.city})</div>
                            </div>
                            
                            <div className="space-y-4">
                                {/* If no activities, show an empty block */}
                                {(!stop.activities || stop.activities.length === 0) && (
                                    <div className="flex gap-4 items-center">
                                        <div className="flex-1 p-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-500">
                                            Arrival in {stop.city}
                                        </div>
                                        <div className="w-32 p-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-right text-slate-500">
                                            $0
                                        </div>
                                    </div>
                                )}

                                {stop.activities && stop.activities.map((activity, aIndex) => (
                                    <React.Fragment key={activity.activity_id}>
                                        <div className="flex gap-4 items-center">
                                            <div className="flex-1 p-4 sm:p-5 rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm font-bold text-slate-700 dark:text-slate-300">
                                                {activity.name} {activity.time && <span className="text-sm font-normal text-slate-400 ml-2">({activity.time})</span>}
                                            </div>
                                            <div className="w-24 sm:w-32 p-4 sm:p-5 rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm font-bold text-slate-700 dark:text-slate-300 text-right">
                                                ${parseFloat(activity.cost).toFixed(0)}
                                            </div>
                                        </div>
                                        
                                        {/* Connector Arrow (if not last activity) */}
                                        {aIndex < stop.activities.length - 1 && (
                                            <div className="flex justify-center -my-1 relative z-10 w-full sm:w-[calc(100%-8rem)]">
                                                <ArrowDown className="w-5 h-5 text-slate-400" />
                                            </div>
                                        )}
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )) : (
                    <div className="text-center py-12 text-slate-500 border-2 border-dashed border-slate-200 rounded-3xl">
                        No itinerary sections found. Build your itinerary first.
                    </div>
                )}
            </div>
        </div>
    );
}
