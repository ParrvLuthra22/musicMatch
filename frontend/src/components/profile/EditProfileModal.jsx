import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Camera, User, Sliders } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import PhotoUpload from '../PhotoUpload';

const EditProfileModal = ({
    isOpen,
    onClose,
    profile,
    onSave,
    isLoading,
    initialPreferences
}) => {
    const [activeTab, setActiveTab] = useState('info');
    const [formData, setFormData] = useState({
        name: profile?.name || '',
        bio: profile?.bio || '',
        age: profile?.age || '',
        gender: profile?.gender || ''
    });
    const [preferences, setPreferences] = useState(initialPreferences || {
        distance: 50,
        ageRange: { min: 18, max: 50 },
        genderPreference: 'everyone'
    });

    // Local photo state tracking is tricky because PhotoUpload handles uploads immediately.
    // For this implementation, we assume PhotoUpload callbacks handle the backend sync, 
    // and we just trigger a refresh or receive updated photo list via props if needed.
    // However, the prompt implies "Save button" saves everything. 
    // Given existing architecture where PhotoUpload uploads directly, we'll keep that pattern
    // but maybe allow deleting photos here?
    // Start with basic Info & Preferences editing.

    const handleSave = () => {
        onSave({ ...formData, preferences });
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    onClick={onClose}
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-2xl bg-bg-card border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                >
                    {/* Hedaer */}
                    <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
                        <h2 className="text-xl font-bold font-display">Edit Profile</h2>
                        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="flex border-b border-white/10">
                        <button
                            onClick={() => setActiveTab('info')}
                            className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'info' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-white'}`}
                        >
                            Personal Info
                        </button>
                        <button
                            onClick={() => setActiveTab('preferences')}
                            className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'preferences' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-white'}`}
                        >
                            Preferences
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-bg-surface">
                        {activeTab === 'info' ? (
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        label="Name"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    />
                                    <Input
                                        label="Age"
                                        type="number"
                                        value={formData.age}
                                        onChange={e => setFormData({ ...formData, age: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1.5 ml-1 font-display tracking-wide">
                                        Gender
                                    </label>
                                    <select
                                        value={formData.gender}
                                        onChange={e => setFormData({ ...formData, gender: e.target.value })}
                                        className="flex h-12 w-full rounded-xl border border-white/10 bg-bg-card px-4 py-2 text-white placeholder:text-gray-600 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none appearance-none"
                                    >
                                        <option value="">Select</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="non-binary">Non-binary</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <Textarea
                                    label="Bio"
                                    className="h-32"
                                    value={formData.bio}
                                    onChange={e => setFormData({ ...formData, bio: e.target.value })}
                                    placeholder="Tell us about your music taste..."
                                />
                                <div className="text-right text-xs text-gray-500">
                                    {formData.bio.length}/500
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="bg-white/5 p-4 rounded-xl space-y-4">
                                    <label className="block text-sm font-medium text-gray-300">Maximum Distance: {preferences.distance}km</label>
                                    <input
                                        type="range"
                                        min="1"
                                        max="100"
                                        value={preferences.distance}
                                        onChange={(e) => setPreferences({ ...preferences, distance: parseInt(e.target.value) })}
                                        className="w-full h-2 bg-brand-surface-light rounded-lg appearance-none cursor-pointer accent-primary"
                                    />
                                </div>

                                <div className="bg-white/5 p-4 rounded-xl space-y-4">
                                    <label className="block text-sm font-medium text-gray-300">Age Range: {preferences.ageRange.min} - {preferences.ageRange.max}</label>
                                    <div className="flex gap-4">
                                        <Input
                                            type="number"
                                            value={preferences.ageRange.min}
                                            onChange={e => setPreferences({ ...preferences, ageRange: { ...preferences.ageRange, min: parseInt(e.target.value) } })}
                                        />
                                        <Input
                                            type="number"
                                            value={preferences.ageRange.max}
                                            onChange={e => setPreferences({ ...preferences, ageRange: { ...preferences.ageRange, max: parseInt(e.target.value) } })}
                                        />
                                    </div>
                                </div>

                                <div className="bg-white/5 p-4 rounded-xl space-y-2">
                                    <label className="block text-sm font-medium text-gray-300">Show Me</label>
                                    <select
                                        value={preferences.genderPreference}
                                        onChange={(e) => setPreferences({ ...preferences, genderPreference: e.target.value })}
                                        className="w-full bg-bg-card p-3 rounded-lg text-white border border-white/10 outline-none"
                                    >
                                        <option value="everyone">Everyone</option>
                                        <option value="male">Men</option>
                                        <option value="female">Women</option>
                                        <option value="non-binary">Non-binary People</option>
                                    </select>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-4 border-t border-white/10 bg-bg-card flex justify-end gap-3">
                        <Button variant="ghost" onClick={onClose}>Cancel</Button>
                        <Button onClick={handleSave} isLoading={isLoading}>Save Changes</Button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default EditProfileModal;
