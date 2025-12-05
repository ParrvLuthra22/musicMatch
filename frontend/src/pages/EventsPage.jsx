import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapPin, Music } from 'lucide-react';
import EventCard from '../components/EventCard';
import LoadingState from '../components/LoadingState';
import EmptyState from '../components/EmptyState';
import { useNavigate } from 'react-router-dom';

const EventsPage = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [location, setLocation] = useState('New York'); // Default, could be dynamic
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEvents = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/events/nearby?location=${location}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setEvents(data);
            } catch (error) {
                console.error('Error fetching events:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, [location]);

    return (
        <div className="min-h-screen bg-black text-white pb-20">
            {/* Header */}
            <div className="p-6 pt-12 bg-gradient-to-b from-purple-900/20 to-black">
                <h1 className="text-3xl font-bold mb-2">Discover Events</h1>
                <div className="flex items-center gap-2 text-gray-400">
                    <MapPin size={16} />
                    <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="bg-transparent border-b border-gray-700 focus:border-purple-500 outline-none text-white w-32"
                    />
                </div>
            </div>

            {/* Content */}
            <div className="px-4">
                {loading ? (
                    <LoadingState />
                ) : events.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                        {events.map(event => (
                            <EventCard key={event.id} event={event} />
                        ))}
                    </div>
                ) : (
                    <EmptyState
                        title="No events found"
                        description={`No upcoming events found for your artists in ${location}. Try changing the location or syncing more artists.`}
                    />
                )}
            </div>
        </div>
    );
};

export default EventsPage;
