import React, { useState } from 'react';
import { Calendar, Plus, CheckCircle2, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ItineraryBuilder() {
    const [itinerarySections, setItinerarySections] = useState([
        {
            stopId: 1,
            city: 'Tokyo, Japan',
            dates: 'Apr 10 - Apr 14',
            activities: [
                { name: 'Visit Senso-ji Temple', time: '09:00 AM', cost: 15, category: 'Sightseeing' },
            ]
        }
    ]);

    const addStop = () => {
        setItinerarySections([...itinerarySections, {
            stopId: Date.now(),
            city: 'New Destination',
            dates: 'Select Dates',
            activities: []
        }]);
    };

    const removeStop = (id) => {
        setItinerarySections(itinerarySections.filter(stop => stop.stopId !== id));
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Itinerary Builder</h1>
                    <p className="text-sm text-slate-500">Add destinations and map out your daily plan</p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={addStop}
                    className="flex items-center gap-2 bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-xl shadow-md"
                >
                    <Plus className="w-4 h-4" /> Add Stop
                </motion.button>
            </div>

            <div className="space-y-6">
                <AnimatePresence>
                    {itinerarySections.map((section, idx) => (
                        <motion.div
                            key={section.stopId}
                            initial={{ opacity: 0, height: 0, y: -20 }}
                            animate={{ opacity: 1, height: 'auto', y: 0 }}
                            exit={{ opacity: 0, height: 0, scale: 0.9 }}
                            transition={{ duration: 0.3 }}
                            className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm overflow-hidden"
                        >

                            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-2">
                                <div className="flex items-center gap-3">
                                    <span className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">{idx + 1}</span>
                                    <input
                                        type="text"
                                        defaultValue={section.city}
                                        className="font-bold text-lg text-slate-900 dark:text-white bg-transparent outline-none focus:border-b-2 border-blue-500"
                                    />
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                                        <Calendar className="w-4 h-4 text-blue-600" /> {section.dates}
                                    </span>
                                    <button onClick={() => removeStop(section.stopId)} className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950 transition-colors">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2.5">
                                {section.activities.length === 0 ? (
                                    <p className="text-xs text-slate-400 italic">No activities added to this stop yet.</p>
                                ) : (
                                    section.activities.map((act, aIdx) => (
                                        <div key={aIdx} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                                <div>
                                                    <p className="font-semibold text-sm text-slate-900 dark:text-white">{act.name}</p>
                                                    <p className="text-xs text-slate-400">{act.category} • {act.time}</p>
                                                </div>
                                            </div>
                                            <span className="font-bold text-sm text-slate-700 dark:text-slate-200">${act.cost}</span>
                                        </div>
                                    ))
                                )}
                            </div>

                            <div className="pt-2 flex justify-end">
                                <button className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                                    <Plus className="w-3.5 h-3.5" /> Find Activity
                                </button>
                            </div>

                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}