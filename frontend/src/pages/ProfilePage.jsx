import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import PhotoUpload from '../components/PhotoUpload';
import MusicDNASection from '../components/profile/MusicDNASection';
import EditProfileModal from '../components/profile/EditProfileModal';
import Button from '../components/ui/Button';
import { Edit2, MapPin, User, Camera, Settings as SettingsIcon } from 'lucide-react';
import { motion } from 'framer-motion';

import { ProfileSkeleton } from '../components/Skeletons';

const ProfilePage = () => {
    const { userId } = useParams();
    const { user: currentUser } = useContext(AuthContext);
    const [profileUser, setProfileUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // For modal submission loading

    // Initial preferences state to pass to modal
    const [preferences, setPreferences] = useState(null);

    const isOwnProfile = !userId || userId === currentUser?._id;

    const fetchProfile = async () => {
        try {
            // If it's our own profile, we might already have data in context,
            // but let's simulate a fetch or fetch fresh data if needed
            if (isOwnProfile) {
                setProfileUser(currentUser);
                if (currentUser?.preferences) setPreferences(currentUser.preferences);
                setLoading(false);
                return;
            }

            // Fetch other user's profile
            const token = localStorage.getItem('token');
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProfileUser(data);
            if (data.preferences) setPreferences(data.preferences);
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            // Add artificial delay to show off the skeleton if it's too fast
            setTimeout(() => setLoading(false), 500);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, [userId, currentUser, isOwnProfile]);

    const handleUpdate = async (updatedData) => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            // updatedData contains { name, bio, age, gender, preferences }
            const { data } = await axios.put(`${import.meta.env.VITE_API_URL}/api/profile/update`, updatedData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProfile(data);
            if (data.preferences) setPreferences(data.preferences);
            setIsEditModalOpen(false);
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile');
        } finally {
            setIsLoading(false);
        }
    };

    const handlePhotoSuccess = (newPhotoUrl) => {
        setProfile(prev => ({
            ...prev,
            photos: [...prev.photos, newPhotoUrl]
        }));
    };

    const handleDeletePhoto = async (photoUrl) => {
        if (!confirm('Delete this photo?')) return;
        try {
            const filename = photoUrl.split('/').pop();
            const token = localStorage.getItem('token');
            await axios.delete(`${import.meta.env.VITE_API_URL}/api/profile/photo/${filename}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProfile(prev => ({
                ...prev,
                photos: prev.photos.filter(p => p !== photoUrl)
            }));
        } catch (error) {
            console.error('Error deleting photo:', error);
        }
    };

    if (!profile) return (
        <div className="min-h-screen bg-bg-dark flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary shadow-[0_0_15px_rgba(0,255,255,0.5)]"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-bg-dark pb-32 font-body selection:bg-primary selection:text-black">
            {/* --- Header / Cover Section --- */}
            <div className="relative h-[400px] w-full overflow-hidden">
                {/* Background Blur similar to Spotify Artist Page */}
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-30 blur-3xl scale-110"
                    style={{ backgroundImage: `url(${profile.photos[0] || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1000'})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-bg-dark/50 to-bg-dark" />

                <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 z-10 flex flex-col md:flex-row items-end gap-8">
                    {/* Profile Photo (Main) */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative w-40 h-40 md:w-52 md:h-52 rounded-full border-4 border-bg-dark shadow-2xl overflow-hidden flex-shrink-0 group"
                    >
                        {profile.photos[0] ? (
                            <img src={profile.photos[0]} alt={profile.name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-bg-surface flex items-center justify-center text-gray-500">
                                <User size={64} />
                            </div>
                        )}
                        {/* Quick Photo Upload Trigger could go here */}
                    </motion.div>

                    {/* Basic Details */}
                    <div className="flex-1 mb-4">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <h1 className="text-5xl md:text-7xl font-bold font-display text-white tracking-tighter mb-2">
                                {profile.name}
                            </h1>
                            <div className="flex flex-wrap items-center gap-4 text-gray-300 text-lg">
                                {profile.age && <span>{profile.age} years old</span>}
                                {profile.location && (
                                    <span className="flex items-center gap-1 text-primary">
                                        <MapPin size={16} /> {profile.location.type === 'Point' ? 'Nearby' : 'Unknown'}
                                    </span>
                                )}
                            </div>
                        </motion.div>
                    </div>

                    {/* Actions */}
                    <div className="mb-6 flex gap-3">
                        <Button onClick={() => setIsEditModalOpen(true)} className="px-8 shadow-[0_0_20px_rgba(0,255,255,0.2)]">
                            <Edit2 size={18} className="mr-2" /> Edit Profile
                        </Button>
                    </div>
                </div>
            </div>

            {/* --- Main Content Container --- */}
            <div className="max-w-7xl mx-auto px-6 mt-8 space-y-12">

                {/* 1. Bio & Photos Mini-Gallery */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-6">
                        <h2 className="text-2xl font-bold font-display text-white border-b border-white/10 pb-4">About Me</h2>
                        <p className="text-xl text-gray-300 leading-relaxed max-w-2xl">
                            {profile.bio || "No bio yet. Click edit to tell your story!"}
                        </p>
                    </div>

                    {/* Mini Photo Grid for secondary photos */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="font-bold text-gray-400 uppercase tracking-widest text-sm">Photos</h3>
                            {profile.photos.length < 6 && (
                                <div className="scale-75 origin-right">
                                    <PhotoUpload onUploadSuccess={handlePhotoSuccess} />
                                </div>
                            )}
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            {profile.photos.slice(1).map((photo, i) => (
                                <div key={i} className="aspect-square rounded-lg overflow-hidden relative group cursor-pointer bg-bg-surface-light">
                                    <img src={photo} alt="Gallery" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity" onClick={() => handleDeletePhoto(photo)}>
                                        <span className="text-xs text-red-500 font-bold">DELETE</span>
                                    </div>
                                </div>
                            ))}
                            {[...Array(Math.max(0, 5 - (profile.photos.length - 1)))].map((_, i) => (
                                <div key={`empty-${i}`} className="aspect-square rounded-lg bg-white/5 border border-white/5 flex items-center justify-center">
                                    <Camera size={20} className="text-white/20" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 2. Music DNA Section */}
                <div className="pt-8">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="h-10 w-1 bg-primary rounded-full" />
                        <h2 className="text-4xl font-bold font-display text-white">Music DNA</h2>
                    </div>

                    <MusicDNASection
                        topArtists={profile.topArtists}
                        topTracks={profile.topTracks}
                        topGenres={profile.topGenres}
                        listeningStats={profile.listeningStats}
                    />
                </div>

            </div>

            {/* Edit Modal */}
            <EditProfileModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                profile={profile}
                onSave={handleUpdate}
                isLoading={isLoading}
                initialPreferences={preferences}
            />
        </div>
    );
};

export default ProfilePage;
