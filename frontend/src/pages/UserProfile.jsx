import React, { useState, useEffect } from 'react';
import { User, Mail, Shield, Save, LogOut, Camera, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

export default function UserProfile() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [bio, setBio] = useState('');
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setName(localStorage.getItem('userName') || 'GlobeTrotter User');
        setEmail('user@globetrotter.app'); // Mock email since it's not saved to localStorage in this demo

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

    const handleSave = (e) => {
        e.preventDefault();
        alert("Profile updated successfully!");
    };

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/';
    };

    const now = new Date();
    const preplannedTrips = trips.filter(t => !t.end_date || new Date(t.end_date) >= now);
    const previousTrips = trips.filter(t => t.end_date && new Date(t.end_date) < now);

    const TripCard = ({ trip }) => (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col h-[250px]"
        >
            <div className="h-32 bg-slate-100 dark:bg-slate-800 relative">
                <div className="absolute inset-0 flex items-center justify-center font-black text-4xl text-slate-200 dark:text-slate-700 select-none">
                    {trip.name.substring(0, 3).toUpperCase()}
                </div>
            </div>
            <div className="p-4 flex flex-col flex-grow">
                <h4 className="font-bold text-slate-900 dark:text-white truncate">{trip.name}</h4>
                <div className="mt-auto">
                    <button 
                        onClick={() => navigate(`/itinerary/${trip.trip_id}`)}
                        className="w-full py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                        View Trip
                    </button>
                </div>
            </div>
        </motion.div>
    );

    return (
        <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-10">
            {/* User Details Section (Screen 7 Top) */}
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col md:flex-row p-8 gap-8 items-start">
                <div className="relative group cursor-pointer shrink-0 mx-auto md:mx-0">
                    <div className="w-40 h-40 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-5xl font-bold text-white shadow-xl overflow-hidden border-4 border-white dark:border-slate-900">
                        {name.charAt(0).toUpperCase()}
                    </div>
                    <div className="absolute bottom-2 right-2 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white dark:border-slate-900 group-hover:bg-blue-700 transition-colors">
                        <Camera className="w-5 h-5" />
                    </div>
                </div>

                <div className="flex-1 w-full">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">{name}</h1>
                            <p className="text-slate-500">{email}</p>
                        </div>
                    </div>
                    
                    <form onSubmit={handleSave} className="space-y-4">
                        <div>
                            <label className="text-sm font-bold text-slate-500 uppercase tracking-wider pl-1 mb-1 block">Bio / Details</label>
                            <textarea 
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:border-blue-500 transition-colors resize-none"
                                rows="3"
                                placeholder="Write a short bio or user details here..."
                            />
                        </div>
                        <div className="flex justify-end gap-3">
                            <button type="button" onClick={handleLogout} className="px-6 py-2.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 font-bold transition-colors">
                                Logout
                            </button>
                            <button type="submit" className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md transition-colors">
                                Save Details
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Preplanned Trips Section */}
            <div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6">Preplanned Trips</h2>
                {preplannedTrips.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {preplannedTrips.map(trip => <TripCard key={trip.trip_id} trip={trip} />)}
                    </div>
                ) : (
                    <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 border-dashed text-slate-500">
                        No preplanned trips yet.
                    </div>
                )}
            </div>

            {/* Previous Trips Section */}
            <div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6">Previous Trips</h2>
                {previousTrips.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {previousTrips.map(trip => <TripCard key={trip.trip_id} trip={trip} />)}
                    </div>
                ) : (
                    <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 border-dashed text-slate-500">
                        No previous trips found.
                    </div>
                )}
            </div>
        </div>
    );
}
