import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import {
    Save, LogOut, Settings as SettingsIcon, Sliders,
    Bell, Lock, User, Palette, AlertTriangle, ChevronRight,
    Download, Shield, Eye, Smartphone, Music
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Switch from '../components/ui/Switch';
import Slider from '../components/ui/Slider';

const SettingsPage = () => {
    const { logout, user } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Form States
    const [account, setAccount] = useState({
        email: '',
        phone: '',
        spotifyConnected: false
    });

    const [notifications, setNotifications] = useState({
        newMatches: true,
        newMessages: true,
        playlistUpdates: true,
        concertSuggestions: false,
        emailNotifications: true
    });

    const [privacy, setPrivacy] = useState({
        profileVisible: true,
        showListeningActivity: true
    });

    const [discovery, setDiscovery] = useState({
        ageRange: { min: 18, max: 35 },
        distance: 25,
        genderPreference: 'everyone',
        musicThreshold: 70
    });

    const [appearance, setAppearance] = useState({
        fontSize: 'medium' // small, medium, large
    });

    // Mock Fetch
    useEffect(() => {
        // In a real app, we'd fetch all these nested settings from an API
        // For now, we'll just simulate loading existing user prefs + defaults
        setTimeout(() => {
            if (user) {
                setAccount({
                    email: user.email || 'user@example.com',
                    phone: user.phone || '',
                    spotifyConnected: true
                });
                // Keeping defaults for others as they might not be in the current user object structure
            }
            setLoading(false);
        }, 500);
    }, [user]);

    const handleSave = async () => {
        setSaving(true);
        // Simulate API call
        setTimeout(() => {
            setSaving(false);
            // Ideally use a Toast here
            alert('Settings saved successfully!');
        }, 1000);
    };

    const handleDeleteAccount = () => {
        if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
            alert("Account deletion simulated.");
            logout();
        }
    };

    if (loading) {
        return <div className="min-h-screen bg-bg-dark flex items-center justify-center text-primary">Loading settings...</div>;
    }

    const SectionHeader = ({ icon: Icon, title }) => (
        <div className="flex items-center gap-3 pb-4 border-b border-white/10 mb-6">
            <div className="p-2 bg-primary/10 rounded-lg">
                <Icon size={20} className="text-primary" />
            </div>
            <h2 className="text-lg font-bold font-display tracking-wide uppercase">{title}</h2>
        </div>
    );

    const SettingRow = ({ label, description, children }) => (
        <div className="flex items-center justify-between py-2">
            <div className="pr-4">
                <div className="font-medium text-white">{label}</div>
                {description && <div className="text-sm text-gray-400 mt-1">{description}</div>}
            </div>
            <div className="shrink-0">
                {children}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-bg-dark text-white p-4 md:p-8 pb-32 font-body ml-0 md:ml-64">
            <div className="max-w-2xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/5 rounded-2xl border border-white/10 shadow-lg shadow-primary/5">
                        <SettingsIcon size={32} className="text-primary animate-spin-slow" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black font-display tracking-tight">Settings</h1>
                        <p className="text-gray-400">Manage your account and preferences</p>
                    </div>
                </div>

                {/* Account Settings */}
                <Card className="p-6">
                    <SectionHeader icon={User} title="Account" />
                    <div className="space-y-4">
                        <Input
                            label="Email"
                            value={account.email}
                            onChange={(e) => setAccount({ ...account, email: e.target.value })}
                        />
                        <Input
                            label="Phone Number (Optional)"
                            value={account.phone}
                            onChange={(e) => setAccount({ ...account, phone: e.target.value })}
                        />
                        <div className="bg-bg-surface p-4 rounded-xl border border-white/10 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="bg-[#1DB954] p-2 rounded-full">
                                    <Music size={20} className="text-black" />
                                </div>
                                <div>
                                    <div className="font-bold">Spotify</div>
                                    <div className={`text-xs ${account.spotifyConnected ? 'text-green-400' : 'text-gray-500'}`}>
                                        {account.spotifyConnected ? 'Connected' : 'Disconnected'}
                                    </div>
                                </div>
                            </div>
                            <Button
                                size="sm"
                                variant={account.spotifyConnected ? 'outline' : 'primary'}
                                onClick={() => window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/spotify`}
                            >
                                {account.spotifyConnected ? 'Reconnect' : 'Connect'}
                            </Button>
                        </div>
                        <Button variant="outline" size="sm" className="w-full">Change Password</Button>
                    </div>
                </Card>

                {/* Discovery Preferences */}
                <Card className="p-6">
                    <SectionHeader icon={Sliders} title="Discovery" />
                    <div className="space-y-8">
                        <div>
                            <div className="flex justify-between mb-4">
                                <label className="font-bold text-gray-300">Maximum Distance</label>
                                <span className="text-primary font-bold">{discovery.distance} km</span>
                            </div>
                            <Slider
                                value={discovery.distance}
                                onChange={(e) => setDiscovery({ ...discovery, distance: parseInt(e.target.value) })}
                                max={100}
                            />
                        </div>

                        <div>
                            <div className="flex justify-between mb-4">
                                <label className="font-bold text-gray-300">Age Range</label>
                                <span className="text-primary font-bold">{discovery.ageRange.min} - {discovery.ageRange.max}</span>
                            </div>
                            {/* Simplified dual slider simulation using two inputs for now or custom logic */}
                            <div className="flex gap-4">
                                <div className="w-full">
                                    <label className="text-xs text-gray-500 mb-1 block">Min Age</label>
                                    <Slider
                                        value={discovery.ageRange.min}
                                        onChange={(e) => setDiscovery({ ...discovery, ageRange: { ...discovery.ageRange, min: Math.min(parseInt(e.target.value), discovery.ageRange.max) } })}
                                        min={18} max={50}
                                    />
                                </div>
                                <div className="w-full">
                                    <label className="text-xs text-gray-500 mb-1 block">Max Age</label>
                                    <Slider
                                        value={discovery.ageRange.max}
                                        onChange={(e) => setDiscovery({ ...discovery, ageRange: { ...discovery.ageRange, max: Math.max(parseInt(e.target.value), discovery.ageRange.min) } })}
                                        min={18} max={100}
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="font-bold text-gray-300 mb-3 block">Show Me</label>
                            <div className="grid grid-cols-3 gap-2">
                                {['Male', 'Female', 'Everyone'].map(gender => (
                                    <button
                                        key={gender}
                                        onClick={() => setDiscovery({ ...discovery, genderPreference: gender.toLowerCase() })}
                                        className={`py-2 px-4 rounded-lg font-medium text-sm transition-all border ${discovery.genderPreference === gender.toLowerCase()
                                            ? 'bg-primary text-black border-primary'
                                            : 'bg-bg-surface text-gray-400 border-white/10 hover:border-white/30'
                                            }`}
                                    >
                                        {gender}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between mb-4">
                                <label className="font-bold text-gray-300">Music Compatibility Threshold</label>
                                <span className={`font-bold ${discovery.musicThreshold > 80 ? 'text-green-400' : 'text-yellow-400'}`}>{discovery.musicThreshold}%</span>
                            </div>
                            <Slider
                                value={discovery.musicThreshold}
                                onChange={(e) => setDiscovery({ ...discovery, musicThreshold: parseInt(e.target.value) })}
                                min={0} max={100}
                            />
                            <p className="text-xs text-gray-500 mt-2">Only show people with a match score above this %.</p>
                        </div>
                    </div>
                </Card>

                {/* Notification Preferences */}
                <Card className="p-6">
                    <SectionHeader icon={Bell} title="Notifications" />
                    <div className="space-y-4 divide-y divide-white/5">
                        <SettingRow label="New Matches">
                            <Switch
                                checked={notifications.newMatches}
                                onCheckedChange={(c) => setNotifications({ ...notifications, newMatches: c })}
                            />
                        </SettingRow>
                        <SettingRow label="New Messages">
                            <Switch
                                checked={notifications.newMessages}
                                onCheckedChange={(c) => setNotifications({ ...notifications, newMessages: c })}
                            />
                        </SettingRow>
                        <SettingRow label="Concert Suggestions">
                            <Switch
                                checked={notifications.concertSuggestions}
                                onCheckedChange={(c) => setNotifications({ ...notifications, concertSuggestions: c })}
                            />
                        </SettingRow>
                        <SettingRow label="Email Notifications">
                            <Switch
                                checked={notifications.emailNotifications}
                                onCheckedChange={(c) => setNotifications({ ...notifications, emailNotifications: c })}
                            />
                        </SettingRow>
                    </div>
                </Card>

                {/* Privacy & Security */}
                <Card className="p-6">
                    <SectionHeader icon={Shield} title="Privacy" />
                    <div className="space-y-4 divide-y divide-white/5">
                        <SettingRow label="Public Profile" description="Allow others to see your profile in discovery">
                            <Switch
                                checked={privacy.profileVisible}
                                onCheckedChange={(c) => setPrivacy({ ...privacy, profileVisible: c })}
                            />
                        </SettingRow>
                        <SettingRow label="Show Listening Activity" description="Display your recent Spotify tracks">
                            <Switch
                                checked={privacy.showListeningActivity}
                                onCheckedChange={(c) => setPrivacy({ ...privacy, showListeningActivity: c })}
                            />
                        </SettingRow>
                    </div>
                    <div className="mt-6 pt-6 border-t border-white/10 flex flex-col gap-3">
                        <Button variant="outline" className="justify-between group">
                            <span className="flex items-center"><Lock size={16} className="mr-2" /> Blocked Users</span>
                            <ChevronRight size={16} className="text-gray-500 group-hover:text-white" />
                        </Button>
                        <Button variant="outline" className="justify-between group">
                            <span className="flex items-center"><Download size={16} className="mr-2" /> Download My Data</span>
                            <ChevronRight size={16} className="text-gray-500 group-hover:text-white" />
                        </Button>
                    </div>
                </Card>

                {/* Appearance */}
                <Card className="p-6">
                    <SectionHeader icon={Palette} title="Appearance" />
                    <div className="flex items-center justify-between">
                        <span className="font-medium text-white">Font Size</span>
                        <div className="bg-bg-surface p-1 rounded-lg border border-white/10 flex">
                            {['small', 'medium', 'large'].map(size => (
                                <button
                                    key={size}
                                    onClick={() => setAppearance({ ...appearance, fontSize: size })}
                                    className={`px-3 py-1 rounded-md text-sm capitalize transition-all ${appearance.fontSize === size ? 'bg-white/10 text-white font-bold' : 'text-gray-500 hover:text-gray-300'}`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>
                </Card>

                {/* Danger Zone */}
                <div className="border border-red-500/20 rounded-2xl p-6 bg-red-500/5">
                    <SectionHeader icon={AlertTriangle} title="Danger Zone" />
                    <div className="flex flex-col gap-4">
                        <Button variant="outline" className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white">
                            Deactivate Account
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDeleteAccount}
                        >
                            Delete Account
                        </Button>
                        <p className="text-xs text-center text-gray-500 mt-2">
                            Deleting your account will remove all your matches, messages, and music data permanently.
                        </p>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="flex flex-col gap-4 sticky bottom-4 z-20">
                    <Button
                        size="lg"
                        onClick={handleSave}
                        isLoading={saving}
                        className="shadow-[0_4px_20px_rgba(0,255,255,0.4)]"
                    >
                        <Save size={20} className="mr-2" /> Save Changes
                    </Button>
                    <Button variant="ghost" onClick={logout} className="text-gray-400 hover:text-white">
                        <LogOut size={18} className="mr-2" /> Log Out
                    </Button>
                </div>

                <div className="text-center pb-8">
                    <p className="text-xs text-gray-600">TuneMate v1.0.2</p>
                    <div className="flex justify-center gap-4 mt-2 text-xs text-gray-500">
                        <a href="#" className="hover:text-primary">Terms of Service</a>
                        <span>•</span>
                        <a href="#" className="hover:text-primary">Privacy Policy</a>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default SettingsPage;
