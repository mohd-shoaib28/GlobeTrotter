import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader2, Search, Trash2, Shield, User, Map, ExternalLink, X, Eye } from 'lucide-react';

export default function ManageUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedUserForTrips, setSelectedUserForTrips] = useState(null);
    const [userTrips, setUserTrips] = useState([]);
    const [loadingTrips, setLoadingTrips] = useState(false);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/admin/users', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(res.data);
        } catch (err) {
            console.error("Failed to fetch users", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this user? All their trips will be permanently deleted.")) return;
        
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/admin/users/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(users.filter(u => u.user_id !== id));
        } catch (err) {
            alert("Failed to delete user.");
        }
    };

    const handleViewTrips = async (user) => {
        setSelectedUserForTrips(user);
        setLoadingTrips(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`http://localhost:5000/api/admin/users/${user.user_id}/trips`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUserTrips(res.data);
        } catch (err) {
            alert("Failed to load user trips.");
        } finally {
            setLoadingTrips(false);
        }
    };

    const filteredUsers = users.filter(u => 
        u.name.toLowerCase().includes(search.toLowerCase()) || 
        u.email.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return <div className="flex h-full items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-blue-600" /></div>;

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Manage Users</h1>
                <div className="relative w-64">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="Search users..." 
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
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Joined</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                            {filteredUsers.map(user => (
                                <tr key={user.user_id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 font-bold">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-900 dark:text-white">{user.name}</div>
                                                <div className="text-sm text-slate-500">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {user.role === 'admin' ? (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">
                                                <Shield className="w-3 h-3" /> Admin
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                                                <User className="w-3 h-3" /> User
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                                        {new Date(user.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button 
                                            onClick={() => handleViewTrips(user)}
                                            className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-lg transition-colors mr-2"
                                            title="View User Trips"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(user.user_id)}
                                            disabled={user.role === 'admin'}
                                            className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                                            title={user.role === 'admin' ? "Cannot delete admin" : "Delete user"}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filteredUsers.length === 0 && (
                    <div className="p-8 text-center text-slate-500 font-medium">No users found.</div>
                )}
            </div>

            {/* View Trips Modal */}
            {selectedUserForTrips && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 w-full max-w-2xl max-h-[80vh] overflow-y-auto relative shadow-2xl">
                        <button 
                            onClick={() => setSelectedUserForTrips(null)}
                            className="absolute top-6 right-6 p-2 bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                            {selectedUserForTrips.name}'s Trips
                        </h2>
                        <p className="text-slate-500 mb-6 text-sm">Viewing all trips created by this user.</p>
                        
                        {loadingTrips ? (
                            <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>
                        ) : userTrips.length === 0 ? (
                            <div className="text-center p-8 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 text-slate-500">
                                This user hasn't created any trips yet.
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {userTrips.map(trip => (
                                    <div key={trip.trip_id} className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/30">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
                                                <Map className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-900 dark:text-white">{trip.name}</div>
                                                <div className="text-xs text-slate-500">
                                                    {trip.start_date ? new Date(trip.start_date).toLocaleDateString() : 'Unscheduled'}
                                                </div>
                                            </div>
                                        </div>
                                        <a 
                                            href={`/itinerary/${trip.trip_id}`} 
                                            target="_blank" 
                                            rel="noreferrer"
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600 rounded-lg text-sm font-semibold transition-colors"
                                        >
                                            View Itinerary <ExternalLink className="w-3.5 h-3.5" />
                                        </a>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
