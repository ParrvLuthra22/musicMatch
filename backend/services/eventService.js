const axios = require('axios');

const TICKETMASTER_API_URL = 'https://app.ticketmaster.com/discovery/v2/events.json';

const searchEvents = async (query, location, date) => {
    // Mock Data if API Key is missing
    if (!process.env.TICKETMASTER_API_KEY) {
        console.log('Using Mock Events (No API Key found)');
        return [
            {
                id: 'mock1',
                name: 'Summer Vibes Festival',
                url: 'http://example.com',
                images: [{ url: 'https://images.unsplash.com/photo-1459749411177-229323b34124?w=800&q=80' }],
                dates: { start: { dateTime: new Date(Date.now() + 86400000).toISOString() } }, // Tomorrow
                venues: [{ name: 'Central Park', city: 'New York', country: 'USA' }]
            },
            {
                id: 'mock2',
                name: 'Jazz Night Live',
                url: 'http://example.com',
                images: [{ url: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800&q=80' }],
                dates: { start: { dateTime: new Date(Date.now() + 172800000).toISOString() } }, // Day after tomorrow
                venues: [{ name: 'Blue Note', city: 'New York', country: 'USA' }]
            },
            {
                id: 'mock3',
                name: 'Techno Bunker',
                url: 'http://example.com',
                images: [{ url: 'https://images.unsplash.com/photo-1574169208507-84376144848b?w=800&q=80' }],
                dates: { start: { dateTime: new Date(Date.now() + 259200000).toISOString() } }, // 3 days later
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
            // Assuming location is "city" for now, or lat/long if available
            // Ticketmaster supports 'city', 'latlong', 'geoPoint'
            // For simplicity, let's assume we pass a city name or nothing
            if (typeof location === 'string') {
                params.city = location;
            }
        }

        if (date) {
            // Format: YYYY-MM-DDTHH:mm:ssZ
            // Ticketmaster expects startDateTime
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
        // Return empty array instead of crashing, unless it's a critical error
        return [];
    }
};

const getEventsForArtists = async (artists, location) => {
    // Ticketmaster allows searching by attractionId or keyword.
    // Searching for multiple artists might require multiple requests or a complex query.
    // For simplicity, we'll search for the top few artists individually or use a broader query if possible.
    // Or we can just search for events in the location and filter? No, that's inefficient.
    // Let's try to fetch events for the top 3-5 artists.

    const events = [];
    const topArtists = artists.slice(0, 5); // Limit to top 5 to avoid rate limits/slow response

    for (const artist of topArtists) {
        const artistEvents = await searchEvents(artist.name, location);
        events.push(...artistEvents);
    }

    // Deduplicate by ID
    const uniqueEvents = Array.from(new Map(events.map(item => [item.id, item])).values());

    // Sort by date
    return uniqueEvents.sort((a, b) => new Date(a.dates.start.dateTime) - new Date(b.dates.start.dateTime));
};

module.exports = {
    searchEvents,
    getEventsForArtists
};
