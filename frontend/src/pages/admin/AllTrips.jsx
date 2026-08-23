import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader2, Search, Map, Calendar, ExternalLink } from 'lucide-react';

export default function AllTrips() {
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchTrips = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:5000/api/admin/trips', {
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

    const filteredTrips = trips.filter(t => 
        t.name.toLowerCase().includes(search.toLowerCase()) || 
        t.author_name?.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return <div className="flex h-full items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-blue-600" /></div>;

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">All Platform Trips</h1>
                <div className="relative w-64">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="Search trips or authors..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-blue-500 text-sm"
                    />
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-xs uppercase tracking-wider font-bold text-slate-500">
                                <th className="px-6 py-4">Trip Info</th>
                                <th className="px-6 py-4">Author</th>
                                <th className="px-6 py-4">Visibility</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                            {filteredTrips.map(trip => (
                                <tr key={trip.trip_id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 border border-blue-100 dark:border-blue-800">
                                                <Map className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-900 dark:text-white">{trip.name}</div>
                                                <div className="text-sm text-slate-500 flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" /> 
                                                    {trip.start_date ? new Date(trip.start_date).toLocaleDateString() : 'Unscheduled'}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-slate-900 dark:text-white">{trip.author_name}</div>
                                        <div className="text-sm text-slate-500">{trip.author_email}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {trip.is_public ? (
                                            <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400">Public</span>
                                        ) : (
                                            <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400">Private</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <a 
                                            href={`/itinerary/${trip.trip_id}`} 
                                            target="_blank" 
                                            rel="noreferrer"
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 rounded-lg text-sm font-semibold transition-colors"
                                        >
                                            View <ExternalLink className="w-3.5 h-3.5" />
                                        </a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filteredTrips.length === 0 && (
                    <div className="p-8 text-center text-slate-500 font-medium">No trips found.</div>
                )}
            </div>
        </div>
    );
}
