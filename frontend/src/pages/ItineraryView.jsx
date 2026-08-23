import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Search, Filter, SortAsc, LayoutGrid, ArrowLeft, Loader2, ArrowDown, Share2, Calendar, List } from 'lucide-react';
import axios from 'axios';
import { motion } from 'framer-motion';

export default function ItineraryView() {
    const { tripId } = useParams();
    const navigate = useNavigate();
    const [trip, setTrip] = useState(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [viewMode, setViewMode] = useState('list');
    const [isSharing, setIsSharing] = useState(false);

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

    const handleShare = async () => {
        setIsSharing(true);
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:5000/api/trips/${tripId}/public`, {
                is_public: !trip.is_public
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTrip({ ...trip, is_public: !trip.is_public });
            if (!trip.is_public) {
                const url = `${window.location.origin}/shared/${tripId}`;
                navigator.clipboard.writeText(url);
                alert(`Trip is now public! Link copied to clipboard: ${url}`);
            } else {
                alert('Trip is now private.');
            }
        } catch (err) {
            console.error("Failed to toggle sharing", err);
            alert("Failed to update sharing status.");
        } finally {
            setIsSharing(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
            <button 
                onClick={() => navigate('/trips')} 
                className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors mb-8"
            >
                <ArrowLeft className="w-4 h-4" /> Back to Trips
            </button>

            {/* Toolbar (Screen 9 Requirement) */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8 p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm items-center justify-between">
                <div className="flex gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                    <button 
                        onClick={() => setViewMode('list')}
                        className={`px-4 py-2 rounded-lg flex items-center gap-2 font-bold text-sm transition-colors ${viewMode === 'list' ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <List className="w-4 h-4" /> List
                    </button>
                    <button 
                        onClick={() => setViewMode('calendar')}
                        className={`px-4 py-2 rounded-lg flex items-center gap-2 font-bold text-sm transition-colors ${viewMode === 'calendar' ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <Calendar className="w-4 h-4" /> Calendar
                    </button>
                </div>
                
                <button 
                    onClick={handleShare}
                    disabled={isSharing}
                    className={`px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-colors ${trip.is_public ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                >
                    <Share2 className="w-4 h-4" /> {isSharing ? 'Updating...' : trip.is_public ? 'Public (Shared)' : 'Share Trip'}
                </button>
            </div>

            <div className="text-center mb-10">
                <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Itinerary for {trip.name}</h1>
            </div>

            {viewMode === 'list' ? (
                <>
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
                                        {stop.info && (
                                            <div className="p-4 rounded-xl border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-slate-700 dark:text-slate-300 whitespace-pre-wrap mb-4 shadow-sm">
                                                {stop.info}
                                            </div>
                                        )}

                                        {/* If no activities, show an empty block */}
                                        {(!stop.activities || stop.activities.length === 0) && (
                                            <div className="flex gap-4 items-center">
                                                <div className="flex-1 p-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-500">
                                                    Arrival in {stop.city}
                                                </div>
                                                <div className="w-32 p-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-right text-slate-500">
                                                    ₹0
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
                                                        ₹{parseFloat(activity.cost).toFixed(0)}
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
                </>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {trip.stops && trip.stops.length > 0 ? trip.stops.map((stop, sIndex) => (
                        <div key={stop.stop_id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                            <h3 className="font-black text-xl mb-2">Day {sIndex + 1}: {stop.city}</h3>
                            <p className="text-slate-500 text-sm mb-4">{stop.dates || 'Dates TBA'}</p>
                            <div className="space-y-2">
                                {stop.activities?.map(act => (
                                    <div key={act.activity_id} className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-sm font-semibold flex justify-between">
                                        <span>{act.time} {act.name}</span>
                                        <span className="text-blue-600">₹{act.cost}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )) : (
                        <div className="col-span-full text-center py-12 text-slate-500 border-2 border-dashed border-slate-200 rounded-3xl">
                            No itinerary sections found. Build your itinerary first.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
