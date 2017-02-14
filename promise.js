var getFromApi = function(endpoint, query={}) {
    const url = new URL(`https://api.spotify.com/v1/${endpoint}`);
    Object.keys(query).forEach(key => url.searchParams.append(key, query[key]));
    return fetch(url).then(function(response) {
        if (!response.ok) {
            return Promise.reject(response.statusText);
        }
        return response.json();
    });
};


var artist;
var getArtist = function(name) {
    
    query = {
    	q: name,
    	limit: 1,
    	type: 'artist'
    }

    return getFromApi('search', query)
    .then(result => {
    	artist = result.artists.items[0];
    	return artist;
    })
    .catch(function(err) {
    	console.error(err);
    })
    .then(() => {
    	return getFromApi(`artists/${artist.id}/related-artists`)
    	.then(item => {
    		artist.related = item.artists;
        var artistHits = artist.related.map(hit => {
          return getFromApi(`artists/${hit.id}/top-tracks?country=us`); 
          
        });
        return Promise.all(artistHits).then(items => {
          items.forEach((songs, index) =>{
            artist.related[index].tracks = songs.tracks;
          });
          return artist;
        })
    	})
    })
};

// const url = new URL('https://www.omdbapi.com/');
// const data = {
//     s: 'office space',
//     r:'json'
// };
// Object.keys(data).forEach(key => url.searchParams.append(key, data[key]));

// fetch(url).then(response => {
//   if (!response.ok) {
//     return Promise.reject(response.statusText);
//   }
//   return response.json();
// }).then(response => {
//   console.log(response.Search[0].Title);
// }).catch(err => {
//   console.error(err);
// });

