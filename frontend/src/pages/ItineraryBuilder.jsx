import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Calendar, DollarSign, AlignLeft, CheckCircle2, ArrowLeft, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function ItineraryBuilder() {
    const { tripId } = useParams();
    const navigate = useNavigate();
    
    const [trip, setTrip] = useState(null);
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Initial Fetch
    useEffect(() => {
        const fetchTrip = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`http://localhost:5000/api/trips/${tripId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setTrip(res.data);
                
                // Map existing stops to our 'sections' UI model to match the wireframe requirements
                if (res.data.stops && res.data.stops.length > 0) {
                    setSections(res.data.stops.map((stop, idx) => ({
                        id: stop.stop_id || Date.now() + idx,
                        title: `Section ${idx + 1}: ${stop.city}`,
                        info: 'Add all necessary information about this section. This can be anything like travel details, hotel, or any other activity.',
                        dateRange: stop.dates || '',
                        budget: stop.activities?.reduce((acc, a) => acc + parseFloat(a.cost || 0), 0) || ''
                    })));
                } else {
                    // Default empty state if no stops exist
                    setSections([{
                        id: Date.now(),
                        title: 'Section 1:',
                        info: '',
                        dateRange: '',
                        budget: ''
                    }]);
                }
            } catch (err) {
                console.error("Failed to fetch trip", err);
            } finally {
                setLoading(false);
            }
        };
        if (tripId) fetchTrip();
        else setLoading(false);
    }, [tripId]);

    const handleAddSection = () => {
        setSections([...sections, {
            id: Date.now(),
            title: `Section ${sections.length + 1}:`,
            info: '',
            dateRange: '',
            budget: ''
        }]);
    };

    const handleUpdateSection = (id, field, value) => {
        setSections(sections.map(s => {
            if (s.id === id) return { ...s, [field]: value };
            return s;
        }));
    };

    const handleRemoveSection = (id) => {
        setSections(sections.filter(s => s.id !== id));
    };

    const handleSaveItinerary = async () => {
        setIsSaving(true);
        // Simulate a save operation for the UI mockup
        setTimeout(() => setIsSaving(false), 1000);
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400">
                <Loader2 className="w-8 h-8 animate-spin mb-4 text-blue-600" />
                <p className="font-medium">Loading itinerary builder...</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
            
            {/* Top Navigation Bar */}
            <div className="flex items-center justify-between mb-8">
                <button 
                    onClick={() => navigate('/trips')} 
                    className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Trips
                </button>
                <div className="flex items-center gap-4">
                    <span className="font-black text-xl tracking-tight text-slate-900 dark:text-white">Globe<span className="text-blue-600">Trotter</span></span>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-bold shadow-lg">
                        {trip ? trip.name?.charAt(0) : 'U'}
                    </div>
                </div>
            </div>

            {/* Header Content */}
            <div className="mb-8">
                <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Build Itinerary</h1>
                <p className="text-slate-500">Plan out every detail of your journey by adding sections for different locations, activities, or days.</p>
            </div>

            {/* Sections Container */}
            <div className="space-y-6">
                <AnimatePresence>
                    {sections.map((section, index) => (
                        <motion.div
                            key={section.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, height: 0, marginBottom: 0 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8 relative group overflow-hidden"
                        >
                            {/* Decorative Top Border */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                            <div className="flex justify-between items-start mb-6">
                                <input
                                    type="text"
                                    value={section.title}
                                    onChange={(e) => handleUpdateSection(section.id, 'title', e.target.value)}
                                    className="text-2xl font-bold text-slate-900 dark:text-white bg-transparent outline-none border-b-2 border-transparent focus:border-blue-500 transition-colors w-full sm:w-2/3"
                                    placeholder={`Section ${index + 1}:`}
                                />
                                {sections.length > 1 && (
                                    <button
                                        onClick={() => handleRemoveSection(section.id)}
                                        className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-all"
                                        title="Remove Section"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                )}
                            </div>

                            <div className="space-y-6">
                                {/* Information Textarea */}
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-400">
                                        <AlignLeft className="w-4 h-4" /> Section Information
                                    </label>
                                    <textarea
                                        value={section.info}
                                        onChange={(e) => handleUpdateSection(section.id, 'info', e.target.value)}
                                        className="w-full min-h-[100px] p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 transition-all resize-y leading-relaxed"
                                        placeholder="All the necessary information about this section. This can be anything like travel details, hotel, or any other activity..."
                                    />
                                </div>

                                {/* Date Range and Budget Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-400">
                                            <Calendar className="w-4 h-4" /> Date Range
                                        </label>
                                        <input
                                            type="text"
                                            value={section.dateRange}
                                            onChange={(e) => handleUpdateSection(section.id, 'dateRange', e.target.value)}
                                            className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 transition-all font-medium"
                                            placeholder="e.g. Oct 10 to Oct 15"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-400">
                                            <DollarSign className="w-4 h-4" /> Budget
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <span className="text-slate-400 font-bold">$</span>
                                            </div>
                                            <input
                                                type="number"
                                                value={section.budget}
                                                onChange={(e) => handleUpdateSection(section.id, 'budget', e.target.value)}
                                                className="w-full pl-8 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 transition-all font-medium"
                                                placeholder="Budget for this section"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Action Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4 items-center justify-center border-t border-slate-200 dark:border-slate-800 pt-10">
                <button
                    onClick={handleAddSection}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-blue-600 hover:border-blue-600 dark:hover:text-blue-400 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 font-bold transition-all"
                >
                    <Plus className="w-5 h-5" /> Add another Section
                </button>
                
                <button
                    onClick={handleSaveItinerary}
                    disabled={isSaving}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-600/20 active:scale-95 transition-all disabled:opacity-70"
                >
                    {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                    {isSaving ? 'Saving...' : 'Save Itinerary'}
                </button>
            </div>
            
        </div>
    );
}