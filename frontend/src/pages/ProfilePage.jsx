import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import PhotoUpload from '../components/PhotoUpload';
import MusicTasteCard from '../components/MusicTasteCard';
import { Edit2, Save, X, MapPin, Music } from 'lucide-react';

const ProfilePage = () => {
    const { user: authUser } = useContext(AuthContext);
    const [profile, setProfile] = useState(null);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        bio: '',
        age: '',
        gender: ''
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/profile/me`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setProfile(data);
                setFormData({
                    name: data.name,
                    bio: data.bio || '',
                    age: data.age || '',
                    gender: data.gender || ''
                });
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };
        fetchProfile();
    }, []);

    const handleUpdate = async () => {
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.put(`${import.meta.env.VITE_API_URL}/api/profile/update`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProfile(data);
            setEditing(false);
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile');
        }
    };

    const handlePhotoSuccess = (newPhotoUrl) => {
        setProfile(prev => ({
            ...prev,
            photos: [...prev.photos, newPhotoUrl]
        }));
    };

    const handleDeletePhoto = async (photoUrl) => {
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

    if (!profile) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-black text-white p-6 pb-24">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">My Profile</h1>
                    <button
                        onClick={() => editing ? handleUpdate() : setEditing(true)}
                        className={`px-4 py-2 rounded-full font-semibold flex items-center gap-2 ${editing ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-800 hover:bg-gray-700'}`}
                    >
                        {editing ? <><Save size={18} /> Save</> : <><Edit2 size={18} /> Edit</>}
                    </button>
                </div>

                {/* Photos */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                    {profile.photos.map((photo, index) => (
                        <div key={index} className="relative aspect-square rounded-xl overflow-hidden group">
                            <img src={photo} alt="Profile" className="w-full h-full object-cover" />
                            {editing && (
                                <button
                                    onClick={() => handleDeletePhoto(photo)}
                                    className="absolute top-2 right-2 p-1 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X size={14} />
                                </button>
                            )}
                        </div>
                    ))}
                    {editing && profile.photos.length < 6 && (
                        <PhotoUpload onUploadSuccess={handlePhotoSuccess} />
                    )}
                </div>

                {/* Basic Info */}
                <div className="space-y-6 bg-gray-900 p-6 rounded-2xl mb-8">
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Name</label>
                        {editing ? (
                            <input
                                type="text"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                className="w-full bg-gray-800 p-2 rounded text-white border border-gray-700 focus:border-purple-500 outline-none"
                            />
                        ) : (
                            <p className="text-xl font-semibold">{profile.name}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Age</label>
                            {editing ? (
                                <input
                                    type="number"
                                    value={formData.age}
                                    onChange={e => setFormData({ ...formData, age: e.target.value })}
                                    className="w-full bg-gray-800 p-2 rounded text-white border border-gray-700 focus:border-purple-500 outline-none"
                                />
                            ) : (
                                <p className="text-lg">{profile.age || 'Not set'}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Gender</label>
                            {editing ? (
                                <select
                                    value={formData.gender}
                                    onChange={e => setFormData({ ...formData, gender: e.target.value })}
                                    className="w-full bg-gray-800 p-2 rounded text-white border border-gray-700 focus:border-purple-500 outline-none"
                                >
                                    <option value="">Select</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="non-binary">Non-binary</option>
                                    <option value="other">Other</option>
                                </select>
                            ) : (
                                <p className="text-lg capitalize">{profile.gender || 'Not set'}</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Bio</label>
                        {editing ? (
                            <textarea
                                value={formData.bio}
                                onChange={e => setFormData({ ...formData, bio: e.target.value })}
                                className="w-full bg-gray-800 p-2 rounded text-white border border-gray-700 focus:border-purple-500 outline-none h-24"
                            />
                        ) : (
                            <p className="text-gray-300">{profile.bio || 'No bio yet.'}</p>
                        )}
                    </div>
                </div>

                {/* Spotify Stats (Read Only) */}
                <MusicTasteCard topArtists={profile.topArtists} topGenres={profile.topGenres} />
            </div>
        </div>
    );
};

export default ProfilePage;
