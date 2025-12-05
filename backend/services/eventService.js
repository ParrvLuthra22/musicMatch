const axios = require('axios');

const TICKETMASTER_API_URL = 'https://app.ticketmaster.com/discovery/v2/events.json';

const searchEvents = async (query, location, date) => {
    if (!process.env.TICKETMASTER_API_KEY) {
        console.log('Using Mock Events (No API Key found)');
        return [
            {
                id: 'mock1',
                name: 'Summer Vibes Festival',
                url: 'http://example.com',
                images: [{ url: 'https://images.unsplash.com/photo-1459749411177-229323b34124?w=800&q=80' }],
                dates: { start: { dateTime: new Date(Date.now() + 86400000).toISOString() } },
                venues: [{ name: 'Central Park', city: 'New York', country: 'USA' }]
            },
            {
                id: 'mock2',
                name: 'Jazz Night Live',
                url: 'http://example.com',
                images: [{ url: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800&q=80' }],
                dates: { start: { dateTime: new Date(Date.now() + 172800000).toISOString() } },
                venues: [{ name: 'Blue Note', city: 'New York', country: 'USA' }]
            },
            {
                id: 'mock3',
                name: 'Techno Bunker',
                url: 'http://example.com',
                images: [{ url: 'https://images.unsplash.com/photo-1574169208507-84376144848b?w=800&q=80' }],
                dates: { start: { dateTime: new Date(Date.now() + 259200000).toISOString() } },
                venues: [{ name: 'Basement', city: 'New York', country: 'USA' }]
            }
        ];
    }

    try {
        const params = {
            apikey: process.env.TICKETMASTER_API_KEY,
            keyword: query,
            segmentName: 'Music',
            sort: 'date,asc',
            size: 20
        };

        if (location) {
            if (typeof location === 'string') {
                params.city = location;
            }
        }

        if (date) {
            params.startDateTime = date;
        }

        const response = await axios.get(TICKETMASTER_API_URL, { params });

        if (!response.data._embedded || !response.data._embedded.events) {
            return [];
        }

        return response.data._embedded.events.map(event => ({
            id: event.id,
            name: event.name,
            url: event.url,
            images: event.images,
            dates: event.dates,
            venues: event._embedded?.venues?.map(v => ({
                name: v.name,
                city: v.city?.name,
                country: v.country?.name
            })) || [],
            attractions: event._embedded?.attractions?.map(a => ({
                name: a.name,
                id: a.id,
                images: a.images
            })) || []
        }));
    } catch (error) {
        console.error('Error searching events:', error.response?.data || error.message);
        return [];
    }
};

const getEventsForArtists = async (artists, location) => {
    const events = [];
    const topArtists = artists.slice(0, 5);

    for (const artist of topArtists) {
        const artistEvents = await searchEvents(artist.name, location);
        events.push(...artistEvents);
    }

    const uniqueEvents = Array.from(new Map(events.map(item => [item.id, item])).values());

    return uniqueEvents.sort((a, b) => new Date(a.dates.start.dateTime) - new Date(b.dates.start.dateTime));
};

module.exports = {
    searchEvents,
    getEventsForArtists
};
