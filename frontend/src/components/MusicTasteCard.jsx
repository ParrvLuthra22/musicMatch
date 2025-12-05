import { Music, Disc } from 'lucide-react';

const MusicTasteCard = ({ topArtists, topGenres }) => {
    return (
        <div className="bg-gradient-to-br from-green-900/40 to-black p-6 rounded-2xl border border-green-900/50">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-green-400">
                <Music size={24} /> Spotify Taste
            </h2>

            <div className="mb-4">
                <h3 className="text-sm text-gray-400 mb-2 uppercase">Top Artists</h3>
                <div className="flex flex-wrap gap-2">
                    {topArtists?.slice(0, 5).map(artist => (
                        <span key={artist.id} className="px-3 py-1 bg-green-900/30 text-green-200 rounded-full text-sm border border-green-800">
                            {artist.name}
                        </span>
                    ))}
                    {!topArtists?.length && <span className="text-gray-500 text-sm">No artists found</span>}
                </div>
            </div>

            <div>
                <h3 className="text-sm text-gray-400 mb-2 uppercase">Top Genres</h3>
                <div className="flex flex-wrap gap-2">
                    {topGenres?.slice(0, 5).map(genre => (
                        <span key={genre} className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm">
                            {genre}
                        </span>
                    ))}
                    {!topGenres?.length && <span className="text-gray-500 text-sm">No genres found</span>}
                </div>
            </div>
        </div>
    );
};

export default MusicTasteCard;
