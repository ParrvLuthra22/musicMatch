import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { Save, LogOut } from 'lucide-react';

const SettingsPage = () => {
    const { logout } = useContext(AuthContext);
    const [preferences, setPreferences] = useState({
        ageRange: { min: 18, max: 50 },
        distance: 50,
        genderPreference: 'everyone'
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const token = localStorage.getItem('token');
                const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/profile/me`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (data.preferences) {
                    setPreferences({
                        ageRange: data.preferences.ageRange || { min: 18, max: 50 },
                        distance: data.preferences.distance || 50,
                        genderPreference: data.preferences.genderPreference || 'everyone'
                    });
                }
            } catch (error) {
                console.error('Error fetching settings:', error);
            }
        };
        fetchSettings();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            const token = localStorage.getItem('token');
            await axios.put(`${import.meta.env.VITE_API_URL}/api/profile/update`, { preferences }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Settings saved!');
        } catch (error) {
            console.error('Error saving settings:', error);
            alert('Failed to save settings');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white p-6 pb-24">
            <div className="max-w-md mx-auto">
                <h1 className="text-3xl font-bold mb-8">Settings</h1>

                <div className="space-y-8">
                    {/* Discovery Settings */}
                    <section className="bg-gray-900 p-6 rounded-2xl space-y-6">
                        <h2 className="text-xl font-semibold text-gray-300">Discovery Settings</h2>

                        {/* Distance */}
                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="text-sm text-gray-400">Maximum Distance</label>
                                <span className="text-sm font-medium">{preferences.distance} km</span>
                            </div>
                            <input
                                type="range"
                                min="1"
                                max="100"
                                value={preferences.distance}
                                onChange={(e) => setPreferences({ ...preferences, distance: parseInt(e.target.value) })}
                                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
                            />
                        </div>

                        {/* Age Range */}
                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="text-sm text-gray-400">Age Range</label>
                                <span className="text-sm font-medium">{preferences.ageRange.min} - {preferences.ageRange.max}</span>
                            </div>
                            <div className="flex gap-4">
                                <input
                                    type="number"
                                    min="18"
                                    max="99"
                                    value={preferences.ageRange.min}
                                    onChange={(e) => setPreferences({
                                        ...preferences,
                                        ageRange: { ...preferences.ageRange, min: parseInt(e.target.value) }
                                    })}
                                    className="w-full bg-gray-800 p-2 rounded text-white border border-gray-700 focus:border-purple-500 outline-none"
                                />
                                <span className="text-gray-500 self-center">-</span>
                                <input
                                    type="number"
                                    min="18"
                                    max="99"
                                    value={preferences.ageRange.max}
                                    onChange={(e) => setPreferences({
                                        ...preferences,
                                        ageRange: { ...preferences.ageRange, max: parseInt(e.target.value) }
                                    })}
                                    className="w-full bg-gray-800 p-2 rounded text-white border border-gray-700 focus:border-purple-500 outline-none"
                                />
                            </div>
                        </div>

                        {/* Gender Preference */}
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Show Me</label>
                            <select
                                value={preferences.genderPreference}
                                onChange={(e) => setPreferences({ ...preferences, genderPreference: e.target.value })}
                                className="w-full bg-gray-800 p-3 rounded-lg text-white border border-gray-700 focus:border-purple-500 outline-none"
                            >
                                <option value="everyone">Everyone</option>
                                <option value="male">Men</option>
                                <option value="female">Women</option>
                                <option value="non-binary">Non-binary People</option>
                            </select>
                        </div>
                    </section>

                    {/* Actions */}
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="w-full py-3 bg-purple-600 hover:bg-purple-700 rounded-full font-bold transition-colors flex items-center justify-center gap-2"
                    >
                        {saving ? 'Saving...' : <><Save size={20} /> Save Settings</>}
                    </button>

                    <button
                        onClick={logout}
                        className="w-full py-3 bg-gray-800 hover:bg-gray-700 text-red-400 rounded-full font-bold transition-colors flex items-center justify-center gap-2"
                    >
                        <LogOut size={20} /> Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
