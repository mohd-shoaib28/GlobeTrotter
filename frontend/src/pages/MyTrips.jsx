import React, { useState, useEffect } from 'react';
import { Plus, MapPin, Calendar, ArrowRight, Search, Filter, SortAsc, LayoutGrid, List } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function MyTrips() {
    const navigate = useNavigate();
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchTrips = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:5000/api/trips', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setTrips(res.data);
            } catch (err) {
                console.error("Failed to fetch trips", err);
            } finally {
                setLoading(false);
            }
        };
        fetchTrips();
    }, []);

    const now = new Date();
    
    // Categorize trips
    const categorizedTrips = {
        ongoing: [],
        upcoming: [],
        completed: []
    };

    trips.forEach(trip => {
        if (!trip.start_date || !trip.end_date) {
            categorizedTrips.upcoming.push(trip); // Default to upcoming if no dates
            return;
        }
        const start = new Date(trip.start_date);
        const end = new Date(trip.end_date);
        
        if (now >= start && now <= end) {
            categorizedTrips.ongoing.push(trip);
        } else if (now < start) {
            categorizedTrips.upcoming.push(trip);
        } else {
            categorizedTrips.completed.push(trip);
        }
    });

    const filterTrips = (tripList) => {
        return tripList.filter(t => t.name.toLowerCase().includes(search.toLowerCase()) || (t.description && t.description.toLowerCase().includes(search.toLowerCase())));
    };

    const TripCard = ({ trip }) => (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => navigate(`/builder/${trip.trip_id}`)}
            className="group cursor-pointer bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 hover:border-blue-500 transition-all shadow-sm hover:shadow-xl relative overflow-hidden"
        >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{trip.name}</h3>
            <p className="text-slate-500 text-sm mb-6 line-clamp-2">{trip.description || "No description provided."}</p>
            
            <div className="flex items-center justify-between mt-auto">
                <div className="flex items-center gap-4 text-xs font-semibold text-slate-400">
                    <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> 
                        {trip.start_date ? new Date(trip.start_date).toLocaleDateString() : 'TBD'}
                    </span>
                    <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {trip.is_public ? 'Public' : 'Private'}</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <ArrowRight className="w-4 h-4" />
                </div>
            </div>
        </motion.div>
    );

    const TripSection = ({ title, data }) => {
        const filtered = filterTrips(data);
        if (filtered.length === 0) return null;
        
        return (
            <div className="mb-12">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                    {title}
                    <span className="text-sm font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 px-3 py-1 rounded-full">{filtered.length}</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.map(trip => <TripCard key={trip.trip_id} trip={trip} />)}
                </div>
            </div>
        );
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-2">My Trips</h1>
                    <p className="text-slate-500">Manage and organize all your travel itineraries.</p>
                </div>
                <button
                    onClick={() => navigate('/create-trip')}
                    className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-500/30 transition-all active:scale-95"
                >
                    <Plus className="w-5 h-5" /> Create New Trip
                </button>
            </div>

            {/* Toolbar (Screen 6 Requirement) */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10 p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="w-5 h-5 text-slate-400" />
                    </div>
                    <input 
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search your trips..."
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

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
                </div>
            ) : trips.length > 0 ? (
                <>
                    <TripSection title="Ongoing" data={categorizedTrips.ongoing} />
                    <TripSection title="Upcoming" data={categorizedTrips.upcoming} />
                    <TripSection title="Completed" data={categorizedTrips.completed} />
                </>
            ) : (
                <div className="text-center py-32 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 border-dashed">
                    <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                        <MapPin className="w-10 h-10 text-slate-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">No trips planned yet</h3>
                    <p className="text-slate-500 mb-8 max-w-md mx-auto">It's time to pack your bags. Start planning your first itinerary to explore the world.</p>
                </div>
            )}
        </div>
    );
}
