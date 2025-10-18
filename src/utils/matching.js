export const calculateMatchScore = (user1, user2) => {
  const genres1 = new Set(user1.top_genres);
  const genres2 = new Set(user2.top_genres);
  const artists1 = new Set(user1.top_artists);
  const artists2 = new Set(user2.top_artists);

  // Calculate Jaccard similarity for genres
  const genreIntersection = new Set([...genres1].filter(x => genres2.has(x)));
  const genreUnion = new Set([...genres1, ...genres2]);
  const genreSimilarity = genreUnion.size > 0 ? genreIntersection.size / genreUnion.size : 0;

  // Calculate Jaccard similarity for artists
  const artistIntersection = new Set([...artists1].filter(x => artists2.has(x)));
  const artistUnion = new Set([...artists1, ...artists2]);
  const artistSimilarity = artistUnion.size > 0 ? artistIntersection.size / artistUnion.size : 0;

  // Weighted average (artists weight more than genres)
  const score = (genreSimilarity * 0.3 + artistSimilarity * 0.7) * 100;
  
  return Math.round(score);
};

export const getSharedInterests = (user1, user2) => {
  const sharedGenres = user1.top_genres.filter(genre => user2.top_genres.includes(genre));
  const sharedArtists = user1.top_artists.filter(artist => user2.top_artists.includes(artist));
  
  return {
    genres: sharedGenres,
    artists: sharedArtists,
  };
};