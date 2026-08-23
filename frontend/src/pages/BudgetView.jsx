import React, { useState, useEffect } from 'react';
import { ArrowLeft, Wallet, PieChart, DollarSign, TrendingUp } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function BudgetView() {
    const { tripId } = useParams();
    const navigate = useNavigate();
    const [trip, setTrip] = useState(null);
    const [loading, setLoading] = useState(true);

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

    if (loading) return <div className="p-12 text-center text-slate-500">Loading budget...</div>;
    if (!trip) return <div className="p-12 text-center text-rose-500">Trip not found.</div>;

    // Calculate costs
    let totalCost = 0;
    const categoryTotals = {};

    if (trip.stops) {
        trip.stops.forEach(stop => {
            if (stop.activities) {
                stop.activities.forEach(act => {
                    const cost = parseFloat(act.cost) || 0;
                    totalCost += cost;
                    categoryTotals[act.category] = (categoryTotals[act.category] || 0) + cost;
                });
            }
        });
    }

    const categories = Object.keys(categoryTotals);
    // Hardcoded colors for a few categories
    const colors = ['bg-blue-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500', 'bg-indigo-500'];

    return (
        <div className="max-w-4xl mx-auto space-y-8 p-4 sm:p-6">
            <button onClick={() => navigate(`/itinerary/${tripId}`)} className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white">
                <ArrowLeft className="w-4 h-4" /> Back to Itinerary
            </button>

            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Budget & Costs</h1>
                <p className="text-sm text-slate-500 mt-1">Financial breakdown for {trip.name}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1 space-y-6">
                    {/* Total Box */}
                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 text-white shadow-lg">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-white/10 rounded-lg"><Wallet className="w-5 h-5 text-blue-400" /></div>
                            <span className="font-semibold text-slate-300">Total Estimated Cost</span>
                        </div>
                        <h2 className="text-5xl font-black">${totalCost.toFixed(2)}</h2>
                        <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between text-sm">
                            <span className="text-slate-400">Avg. Per Day</span>
                            <span className="font-bold text-emerald-400">~${(totalCost / (trip.stops?.length || 1)).toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800">
                        <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-blue-600" /> Quick Stats
                        </h3>
                        <ul className="space-y-4 text-sm">
                            <li className="flex justify-between">
                                <span className="text-slate-500">Destinations</span>
                                <span className="font-bold text-slate-900 dark:text-white">{trip.stops?.length || 0}</span>
                            </li>
                            <li className="flex justify-between">
                                <span className="text-slate-500">Paid Activities</span>
                                <span className="font-bold text-slate-900 dark:text-white">
                                    {trip.stops?.reduce((acc, stop) => acc + (stop.activities?.filter(a => parseFloat(a.cost) > 0).length || 0), 0)}
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="md:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-8 flex items-center gap-2">
                        <PieChart className="w-5 h-5 text-blue-600" /> Expense Breakdown
                    </h2>

                    {categories.length === 0 ? (
                        <div className="text-center p-8 text-slate-400">
                            No expenses recorded yet. Add activities with costs to see the breakdown.
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {categories.map((cat, idx) => {
                                const amount = categoryTotals[cat];
                                const percentage = totalCost > 0 ? (amount / totalCost) * 100 : 0;
                                const colorClass = colors[idx % colors.length];

                                return (
                                    <div key={cat}>
                                        <div className="flex justify-between items-end mb-2">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-3 h-3 rounded-full ${colorClass}`}></div>
                                                <span className="font-bold text-slate-700 dark:text-slate-200">{cat}</span>
                                            </div>
                                            <span className="font-semibold text-slate-900 dark:text-white">${amount.toFixed(2)} <span className="text-xs text-slate-400 ml-1">({percentage.toFixed(0)}%)</span></span>
                                        </div>
                                        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3">
                                            <div className={`${colorClass} h-3 rounded-full`} style={{ width: `${percentage}%` }}></div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
