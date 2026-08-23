import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Loader2, ArrowDown, Share2, Map, Copy } from 'lucide-react';
import axios from 'axios';
import { motion } from 'framer-motion';

export default function PublicItinerary() {
    const { tripId } = useParams();
    const [trip, setTrip] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPublicTrip = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/trips/public/${tripId}`);
                setTrip(res.data);
            } catch (err) {
                console.error("Failed to fetch public trip", err);
            } finally {
                setLoading(false);
            }
        };
        fetchPublicTrip();
    }, [tripId]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-slate-50 dark:bg-slate-950">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
            </div>
        );
    }

    if (!trip) {
        return (
            <div className="text-center py-20 min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center">
                <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Trip not found</h2>
                <p className="text-slate-500 mb-8">This trip might be private or doesn't exist.</p>
                <Link to="/" className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg hover:bg-blue-700 transition-colors">
                    Go to GlobeTrotter Home
                </Link>
            </div>
        );
    }

    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
            {/* Minimal Navbar for Public View */}
            <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2">
                        <Map className="w-6 h-6 text-blue-600" />
                        <span className="font-black text-xl tracking-tight text-slate-900 dark:text-white">Globe<span className="text-blue-600">Trotter</span></span>
                    </Link>
                    <div className="flex gap-3">
                        <button onClick={handleCopyLink} className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-sm">
                            <Share2 className="w-4 h-4" /> Share
                        </button>
                        <Link to="/signup" className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors text-sm">
                            <Copy className="w-4 h-4" /> Create Your Own
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Header */}
            {trip.cover_photo && (
                <div className="w-full h-64 md:h-96 relative">
                    <img src={trip.cover_photo} alt="Cover" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40"></div>
                </div>
            )}
            
            <div className={`max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 ${trip.cover_photo ? '-mt-20 relative z-10' : 'pt-12'}`}>
                <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 text-center mb-12">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-bold text-sm mb-4">
                        Shared Itinerary
                    </span>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">{trip.name}</h1>
                    <p className="text-lg text-slate-600 dark:text-slate-300 mb-6 max-w-2xl mx-auto">{trip.description}</p>
                    
                    <div className="flex items-center justify-center gap-2 text-sm font-bold text-slate-500 bg-slate-50 dark:bg-slate-800/50 py-3 px-6 rounded-2xl inline-flex">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white text-xs">
                            {trip.author_name ? trip.author_name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        Curated by {trip.author_name}
                    </div>
                </div>

                {/* Days Loop */}
                <div className="space-y-8">
                    {trip.stops && trip.stops.length > 0 ? trip.stops.map((stop, sIndex) => (
                        <motion.div 
                            key={stop.stop_id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="p-6 md:p-8">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 font-black text-xl shrink-0">
                                        {sIndex + 1}
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black text-slate-900 dark:text-white">{stop.city}</h3>
                                        <p className="text-slate-500 font-semibold">{stop.dates || 'Dates TBA'}</p>
                                    </div>
                                </div>
                                
                                {stop.info && (
                                    <p className="text-slate-600 dark:text-slate-300 mb-8 whitespace-pre-wrap leading-relaxed">
                                        {stop.info}
                                    </p>
                                )}

                                <div className="space-y-4">
                                    {stop.activities && stop.activities.map((activity, aIndex) => (
                                        <div key={activity.activity_id} className="flex gap-4 items-center bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                                            <div className="w-16 text-center text-sm font-bold text-slate-400">
                                                {activity.time || '--:--'}
                                            </div>
                                            <div className="w-px h-10 bg-slate-200 dark:bg-slate-700"></div>
                                            <div className="flex-1 font-bold text-slate-700 dark:text-slate-200">
                                                {activity.name}
                                            </div>
                                            <div className="text-blue-600 dark:text-blue-400 font-black">
                                                ${parseFloat(activity.cost).toFixed(0)}
                                            </div>
                                        </div>
                                    ))}
                                    {(!stop.activities || stop.activities.length === 0) && (
                                        <div className="text-center p-6 text-slate-400 font-semibold border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                                            Free time / Self-exploration
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )) : (
                        <div className="text-center py-12 text-slate-500 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
                            This itinerary doesn't have any specific details yet.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
