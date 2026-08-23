import React from 'react';
import { motion } from 'framer-motion';
import { Compass, MapPin, DollarSign, Share2, Calendar, Search, Route, LayoutDashboard, Sparkles } from 'lucide-react';

export default function LandingPage({ setAuthModal }) {
    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2 }
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            {/* Animated Hero Section */}
            <div className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

                <motion.div initial="hidden" animate="visible" variants={fadeIn} className="relative z-10 space-y-8">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-wide bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                        <Compass className="w-4 h-4 animate-spin-slow" /> EMPOWERING PERSONALIZED TRAVEL
                    </div>

                    <h1 className="text-5xl sm:text-7xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                        Dream, design, and <br />
                        <span className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
                            organize your trips.
                        </span>
                    </h1>

                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        An end-to-end travel planning platform that combines flexibility and interactivity. Add travel stops, estimate budgets automatically, visualize timelines, and share with a community.
                    </p>

                    <div className="flex flex-wrap justify-center gap-4 pt-4">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setAuthModal('signup')}
                            className="px-8 py-3.5 rounded-xl bg-blue-600 text-white font-bold shadow-lg shadow-blue-500/30"
                        >
                            Start Planning Free
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setAuthModal('login')}
                            className="px-8 py-3.5 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold border border-slate-200 dark:border-slate-800 shadow-sm"
                        >
                            Sign In
                        </motion.button>
                    </div>
                </motion.div>
            </div>

            {/* Everything you need Section */}
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
                className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24"
            >
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Everything you need for multi-city travel</h2>
                    <p className="text-slate-500 max-w-2xl mx-auto">Build functional and insightful itineraries that adapt to your trip flow.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[
                        { icon: <MapPin />, title: "Manage Stops", desc: "Easily add travel stops, assign durations, and order your journey route." },
                        { icon: <Search />, title: "Explore Cities", desc: "Search through top Indian destinations and discover localized activities of interest." },
                        { icon: <DollarSign />, title: "Live Budgeting (INR)", desc: "Get automatic trip budget estimations in INR (₹) and view cost breakdowns." },
                        { icon: <Calendar />, title: "Visualize Timelines", desc: "Review your full day-wise plan in a beautiful, structured visual calendar." },
                        { icon: <Share2 />, title: "Share Plans", desc: "Share your travel plans publicly or collaborate directly with friends." },
                        { icon: <LayoutDashboard />, title: "Smart Dashboards", desc: "Track upcoming trips as a user, or manage global trends as an Admin." }
                    ].map((feature, idx) => (
                        <motion.div key={idx} variants={fadeIn} className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 transition-colors shadow-sm hover:shadow-xl group">
                            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/40 text-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{feature.title}</h3>
                            <p className="text-slate-500 text-sm leading-relaxed">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* How it Works Section */}
            <div className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-24">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={staggerContainer}
                    className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-16"
                >
                    <div className="space-y-4">
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">How GlobeTrotter Works</h2>
                        <p className="text-slate-500">Plan your perfect trip in just three simple steps.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                        {/* Connecting Line */}
                        <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-blue-100 via-blue-500 to-blue-100 dark:from-slate-800 dark:via-blue-500 dark:to-slate-800" />

                        {[
                            { step: "01", title: "Create Your Trip", desc: "Set your start and end dates, give it a name, and upload a cover photo.", icon: <Sparkles className="w-6 h-6" /> },
                            { step: "02", title: "Build Itinerary", desc: "Add multiple cities, assign activities for each stop, and review the cost breakdown.", icon: <Route className="w-6 h-6" /> },
                            { step: "03", title: "Travel & Share", desc: "Follow your timeline view during the trip and share the final itinerary with others.", icon: <Share2 className="w-6 h-6" /> }
                        ].map((item, idx) => (
                            <motion.div key={idx} variants={fadeIn} className="relative z-10 flex flex-col items-center space-y-4">
                                <div className="w-24 h-24 rounded-full bg-slate-50 dark:bg-slate-950 border-8 border-white dark:border-slate-900 shadow-xl flex items-center justify-center text-blue-600 dark:text-blue-500 relative">
                                    <div className="absolute top-0 right-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold border-2 border-white dark:border-slate-900">
                                        {item.step}
                                    </div>
                                    {item.icon}
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white pt-4">{item.title}</h3>
                                <p className="text-slate-500 text-sm max-w-[250px] mx-auto">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>

        </div>
    );
}