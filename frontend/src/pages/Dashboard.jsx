import React from 'react';
import { Compass, Calendar, Search, Palmtree, Mountain, Utensils, Bike, Camera, Sparkles, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Dashboard({ userId }) {
    // Animation variants
    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const fadeUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    const quickCategories = [
        { title: 'City Breaks', icon: <Compass className="w-5 h-5 text-blue-500" />, count: '45 Destinations' },
        { title: 'Beach Holiday', icon: <Palmtree className="w-5 h-5 text-emerald-500" />, count: '28 Destinations' },
        { title: 'Alpine Trekking', icon: <Mountain className="w-5 h-5 text-amber-500" />, count: '18 Destinations' },
        { title: 'Food & Culinary', icon: <Utensils className="w-5 h-5 text-rose-500" />, count: '32 Destinations' },
        { title: 'Road Trips', icon: <Bike className="w-5 h-5 text-purple-500" />, count: '14 Routes' },
        { title: 'Sightseeing', icon: <Camera className="w-5 h-5 text-indigo-500" />, count: '50+ Places' },
    ];

    return (
        <div className="space-y-12">

            {/* Animated Hero Banner */}
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-blue-50/70 via-white to-transparent dark:from-slate-900 dark:via-slate-950 border border-slate-200/80 dark:border-slate-800/80 p-8 sm:p-14 text-center"
            >
                <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

                <div className="relative z-10 max-w-3xl mx-auto space-y-6">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                        <Sparkles className="w-3.5 h-3.5" /> WELCOME TO YOUR TRAVEL HUB
                    </div>

                    <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                        Where are we going next?
                    </h1>

                    {/* Search Bar Widget */}
                    <div className="pt-4 max-w-2xl mx-auto">
                        <div className="p-2 sm:p-2.5 rounded-2xl bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center gap-2">
                            <div className="flex items-center gap-2 w-full px-3 py-2 border-b sm:border-b-0 sm:border-r border-slate-100 dark:border-slate-800">
                                <Search className="w-4 h-4 text-blue-600" />
                                <input type="text" placeholder="Search cities..." className="w-full text-sm bg-transparent outline-none" />
                            </div>
                            <button className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-all shadow-md">
                                Explore
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Categories Grid */}
            <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="space-y-4">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Explore by Experience</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                    {quickCategories.map((cat, idx) => (
                        <motion.div
                            key={idx}
                            variants={fadeUp}
                            whileHover={{ y: -5 }}
                            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 hover:shadow-lg transition-colors cursor-pointer group"
                        >
                            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                                {cat.icon}
                            </div>
                            <h3 className="mt-3 font-semibold text-sm text-slate-900 dark:text-white">{cat.title}</h3>
                            <p className="text-xs text-slate-400 mt-0.5">{cat.count}</p>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

        </div>
    );
}