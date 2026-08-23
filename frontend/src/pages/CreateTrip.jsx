import React, { useState } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function CreateTrip() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [coverPhoto, setCoverPhoto] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post('http://localhost:5000/api/trips', 
                { name, description, start_date: startDate, end_date: endDate, cover_photo: coverPhoto },
                { headers: { Authorization: `Bearer ${token}` }}
            );
            
            // Redirect to the builder for this new trip
            navigate(`/builder/${res.data.trip_id}`);
        } catch (err) {
            setError('Failed to create trip. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
            <button 
                onClick={() => navigate('/trips')} 
                className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white mb-6"
            >
                <ArrowLeft className="w-4 h-4" /> Back to My Trips
            </button>
            
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Plan a New Trip</h1>
                <p className="text-sm text-slate-500 mb-8">Give your trip a name and let's start planning.</p>

                {error && (
                    <div className="p-4 mb-6 rounded-xl bg-rose-50 text-rose-600 text-sm font-semibold">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Trip Name</label>
                        <input 
                            type="text" 
                            required
                            placeholder="e.g. Summer in Europe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-blue-500 transition-colors"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Description (Optional)</label>
                        <textarea 
                            rows="3"
                            placeholder="A brief overview of your travel plans..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-blue-500 transition-colors resize-none"
                        ></textarea>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Start Date</label>
                            <input 
                                type="date" 
                                required
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-blue-500 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">End Date</label>
                            <input 
                                type="date" 
                                required
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-blue-500 transition-colors"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Cover Photo URL (Optional)</label>
                        <input 
                            type="text" 
                            placeholder="https://example.com/image.jpg"
                            value={coverPhoto}
                            onChange={(e) => setCoverPhoto(e.target.value)}
                            className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-blue-500 transition-colors"
                        />
                    </div>

                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                        <button 
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-md transition-all disabled:opacity-50"
                        >
                            <Save className="w-5 h-5" />
                            {loading ? 'Saving...' : 'Save & Start Building'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
