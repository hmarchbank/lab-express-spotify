require('dotenv').config();
const express = require('express');

const hbs = require('hbs');
const bodyParser = require('body-parser')
const app = express();
app.use(bodyParser.urlencoded({ extended: true}))
// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node')

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));



app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:

// Our routes go here:

app.get('/', (req, res) => {
    res.render('home.hbs')
})

app.post('/artist-search', (req, res) => {
    spotifyApi
        .searchArtists(req.body.artist)
        .then(data => {
            let artistArray = data.body.artists.items
            res.render('artist-search-results.hbs', { artistArray})
        })
        .catch('An error occured while searching for artists')
})

app.get("/albums/:artist", (req, res) =>{
    spotifyApi
    .getArtistAlbums(req.params.artist)
    .then(data => {
        const albumArray = data.body.items
        res.render('albums.hbs', {albumArray})
    })
    .catch()
})

app.get('/albums/tracks/:album', (req, res) => {
    spotifyApi
    .getAlbumTracks(req.params.album)
    .then(data => {
        console.log(data.body.items)
        res.render('tracks.hbs', {data})
    })
    
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));


