console.log('this is loaded');

exports.spotify = {
    id: process.env.SPOTIFY_ID,
    secret: process.env.SPOTIFY_SECRET
};

exports.artist = {
    api_key: process.env.BANDS_IN_TOWN_KEY
}