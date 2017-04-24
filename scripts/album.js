var albumPicasso = {
    title: 'The Colors',
    artist: 'Pablo Picasso',
    label: 'Cubism',
    year: '1881',
    albumArtUrl: 'assets/images/album_covers/01.png',
    songs: [
        { title: 'Blue', duration: '4.26' },
        { title: 'Green', duration: '3.14' },
        { title: 'Red', duration: '3.21' },
        { title: 'Pink', duration: '4.23' },
        { title: 'Magenta', duration: '2.15' }
    ]
};

var albumMarconi = {
    title: 'The Telephone',
    artist: 'Guglielmo Marconi',
    label: 'EM',
    year: '1989',
    albumArtUrl: 'assets/images/album_covers/20.png',
    songs: [
        { title: 'Hello, Operator?', duration: '1.01' },
        { title: 'Ring, ring, ring', duration: '5.01' },
        { title: 'Fits in your pocket', duration: '3.21' },
        { title: 'Can you hear me now?', duration: '3.14' },
        { title: 'Wrong phone number', duration: '2.15' }
    ]   
};

var albumMartin = {
    title: 'Scared to be lonely',
    artist: 'Martin Garrix',
    label: 'EDM',
    year: '2016',
    albumArtUrl: 'assets/images/album_covers/20.png',
    songs: [
        { title: 'Scared to be lonely', duration: '1.01' },
        { title: 'Which way is up', duration: '4.01' },
        { title: 'Dragon', duration: '3.18' },
        { title: 'Poison', duration: '3.57' },
        { title: 'Do not look down', duration: '3.45' }
    ]   
};

var createSongRow = function(songNumber, songName, songLength) {
    var template = 
      ' <tr class="album-view-song-item">'
    + ' <td class="song-item-number">' + songNumber + '</td>'
    + ' <td class="song-item-title">' + songName + '</td>'
    + ' <td class="song-item-duration">' + songLength + '</td>'
    + '</tr>';
    
    return template;
};

// #1 - select elements that we want to populate with text dynamically
var albumTitle = document.getElementsByClassName('album-view-title')[0];
var albumArtist = document.getElementsByClassName('album-view-artist')[0];
var albumReleaseInfo = document.getElementsByClassName('album-view-release-info')[0];
var albumImage = document.getElementsByClassName('album-cover-art')[0];
var albumSongList = document.getElementsByClassName('album-view-song-list')[0];

var setCurrentAlbum = function(album) {
    
    // #2 - assign values to each part of the album (text, images)
    albumTitle.firstChild.nodeValue = album.title;
    albumArtist.firstChild.nodeValue = album.artist;
    albumReleaseInfo.firstChild.nodeValue = album.year + '' + album.label;
    albumImage.setAttribute('src', album.albumArtUrl);
    
    // #3 - clear contents of the album song list container
    albumSongList.innerHTML = '';
    
    // #4 - build list of songs from album Javascript object
    for (var i = 0; i < album.songs.length; i++) {
        albumSongList.innerHTML += createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
    }
};

windown.onload = function() {
    setCurrentAlbum(albumPicasso);
    
    var albums = [albumPicasso, albumMarconi, albumMartin];
    var index = 1;
    albumImage.addEventListener("click", function(event) {
        setCurrentAlbum(albums[index]);
        index++;
        if (index == albums.length) {
            index = 0;
        }
    });
};