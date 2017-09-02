var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';

// Store the state of currently playing songs
var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;
var currentSoundFile = null;
var currentVolume = 80;

var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');
var $playPauseButton = $('.main-controls .play-pause');

var setSong = function(songNumber) {
    if (currentSoundFile) {
        currentSoundFile.stop();
    }
    currentlyPlayingSongNumber = parseInt(songNumber);
    currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
    
    currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
        formats: [ 'mp3'],
        preload: true
    });
    updatePlayerBarSong();
    setVolume(currentVolume);
};

var seek = function(time){
    if (currentSoundFile) {
        currentSoundFile.setTime(time);
    }
}

var setVolume = function(volume) {
    if (currentSoundFile) {
        currentSoundFile.setVolume(volume);
    }
};

var getSongNumberCell = function(number) {
    return $('.song-item-number[data-song-number="' + number + '"]');
}

var createSongRow = function(songNumber, songName, songLength) {
    var template =
        '<tr class="album-view-song-item">'
      + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
      + '  <td class="song-item-title">' + songName + '</td>'
      + '  <td class="song-item-duration">' + filterTimeCode(songLength) + '</td>'
      + '</tr>'
      ;

    var $row = $(template);
    
    var clickHandler = function() {
        var songNumber = parseInt($(this).attr('data-song-number'));
        
        if (currentlyPlayingSongNumber !== null) {
            var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
            currentlyPlayingCell.html(currentlyPlayingSongNumber);
        }
        if (currentlyPlayingSongNumber !== songNumber) {
            $(this).html(pauseButtonTemplate);
		    setSong(songNumber);
            currentSoundFile.play();
            updateSeekBarWhileSongPlays(); // this is new ***
            // currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
            
            var $volumeFill = $('.volume .fill');
            var $volumeThumb = $('.volume .thumb');
            $volumeFill.width(currentVolume + '%');
            $volumeThumb.css({left: currentVolume +'%'});
            
            updatePlayerBarSong();

	    } else if (currentlyPlayingSongNumber === songNumber) {
            if (currentSoundFile.isPaused()) {
                $(this).html(playButtonTemplate);
                $('.main-controls .play-pause').html(playerBarPauseButton);
                currentSoundFile.play();
                updateSeekBarWhileSongPlays();
        } 
        else {
            $(this).html(playButtonTemplate);
            $('.main-controls .play-pause').html(playerBarPlayButton);
		    currentSoundFile.pause();
        }
	   }
    };
    
    var onHover = function(event) {
        var songNumberCell = $(this).find('.song-item-number');
        var songNumber = parseInt(songNumberCell.attr('data-song-number'));
        
        if (songNumber !== currentlyPlayingSongNumber) {
            songNumberCell.html(playButtonTemplate);
        }
    };
    
    var offHover = function(event) {
        var songNumberCell = $(this).find('.song-item-number');
        var songNumber = parseInt(songNumberCell.attr('data-song-number'));
        
        if (songNumber !== currentlyPlayingSongNumber) {
            songNumberCell.html(songNumber);
        }
    };
    
    $row.find('.song-item-number').click(clickHandler);
    $row.hover(onHover, offHover);
    return $row;
};

var setCurrentAlbum = function(album) {
    currentAlbum = album;
    // select elements that we want to populate with text dynamically
    var $albumTitle = $('.album-view-title');
    var $albumArtist = $('.album-view-artist');
    var $albumReleaseInfo = $('.album-view-release-info');
    var $albumImage = $('.album-cover-art');
    var $albumSongList = $('.album-view-song-list');
    
    // assign values to each part of the album (text, images)
    $albumTitle.text(album.title);
    $albumArtist.text(album.artist);
    $albumReleaseInfo.text(album.year + ' ' + album.label);
    $albumImage.attr('src', album.albumArtUrl);
    
    // clear contents of the album song list container
    $albumSongList.empty();
    
    // build list of songs from album Javascript object
    for (var i = 0; i < album.songs.length; i++) {
        var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
        $albumSongList.append($newRow);
    }
};

var setCurrentTimeInPlayerBar = function(currentTime){
    var $currentTimeElement = $('.seek-control .current-time');
    $currentTimeElement.text(filterTimeCode(currentTime));
    //if (currentSoundFile){
        //filterTimeCode
    //    $('.current-time').text(filterTimeCode(currentTime));
    //}
};

var setTotalTimeInPlayer = function(totalTime){
    var $totalTimeElement = $('.seek-control .total-time');
    $totalTimeElement.text(filterTimeCode(totalTime));
    //if (currentSoundFile){
    //    $('.total-time').text(filterTimeCode(totalTime));
    //}
};

var filterTimeCode = function(timeInSeconds){
    var seconds = Number.parseFloat(timeInSeconds);
    var wholeSeconds = Math.floor(seconds));
    var minutes = Math.floor(wholeSeconds / 60);
    
    var remainingSeconds = wholeSeconds % 60;
    
    //var remainingSeconds = wholeSeconds % 60;
    //var output = minutes + ':';
    //console.log('timeInSeconds:', timeInSeconds);
    //console.log(seconds, wholeSeconds, minutes, remainingSeconds);
    
    if (wholeSeconds < 10){
        //output += '0';
        return minutes + ':0' + remainingSeconds;
    } else {
        return minutes + ':' + remainingSeconds;
    }
};

var updateSeekBarWhileSongPlays = function(){
    if (currentSoundFile) {
        // #10
        currentSoundFile.bind('timeupdate', function(event){
            var currentTime = this.getTime();
            var songLength = this.getDuration();
            
            // #11
            var seekBarFillRatio = currentTime / songLength;
            //var seekBarFillRatio = this.getTime() / this.getDuration();
            var $seekBar = $('.seek-control .seek-bar');
            updateSeekPercentage($seekBar, seekBarFillRatio);
            setCurrentTimeInPlayerBar(filterTimeCode(currentTime));
            //setTotalTimeInPlayerBar(filterTimeCode(currentSoundFile.getDuration()));
        });
    }
};

var updateSeekPercentage = function($seekBar, seekBarFillRatio){
    var offsetXPercent = seekBarFillRatio * 100;
    // #1
    offsetXPercent = Math.max(0, offsetXPercent);
    offsetXPercent = Math.min(100, offsetXPercent);
    
    // #2
    var percentageString = offsetXPercent + '%';
    $seekBar.find('.fill').width(percentageString);
    $seekBar.find('.thumb').css({left: percentageString});
};

var setupSeekBars = function(){
    // #6
    var $seekBars = $('.player-bar .seek-bar');
    
    $seekBars.click(function(event) {
        // #3
        var offsetX = event.pageX - $(this).offset().left;
        var barWidth = $(this).width();
        // #4
        var seekBarFillRatio = offsetX / barWidth;
        // Differentiate behavior based on which seek bar this is (bighead does not include this)
        if ($(this).parent().attr('class') == 'seek-control'){
            seek(seekBarFillRatio * currentSoundFile.getDuration());
        } else {
            setVolume(seekBarFillRatio * 100);
        }
        // #5
        updateSeekPercentage($(this), seekBarFillRatio);
    });
    
    $seekBars.find('.thumb').mousedown(function(event) {
        // #8
        var $seekBar = $(this).parent();
        // #9
        $(document).bind('mousemove.thumb', function(event) {
            var offsetX = event.pageX - $seekBar.offset().left;
            var barWidth = $seekBar.width();
            var seekBarFillRatio = offsetX / barWidth;
            // Differentiate behavior based on which seek bar this is
            if ($seekBar.parent().attr('class') == 'seek-control'){
                seek(seekBarFillRatio * currentSoundFile.getDuration());
            } else {
                setVolume(seekBarFillRatio);
            }
            
            updateSeekPercentage($seekBar, seekBarFillRatio);
        });
        // #10
        $(document).bind('mouseup.thumb', function() {
            $(document).unbind('mousemove.thumb');
            $(document).unbind('mouseup.thumb');
        });
    });
};

var trackIndex = function(album, song) {
    return album.songs.indexOf(song);
};

var updatePlayerBarSong = function() {
    $('.currently-playing .song-name').text(currentSongFromAlbum.title);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);
    $('.main-controls .play-pause').html(playerBarPauseButton);
    setTotalTimeInPlayer(currentSongFromAlbum.duration);
};

var nextSong = function() {
    var getLastSongNumber = function(index) {
        return index == 0 ? currentAlbum.songs.length : index;
    };
    
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    // Note that we're _incrementing_ the song here
    currentSongIndex++;
    
    if (currentSongIndex >= currentAlbum.songs.length) {
        currentSongIndex = 0;
    }
    
    setSong(currentSongIndex + 1);
    currentSoundFile.play();
    currentSongFromAlbum = currentAlbum.songs[currentSongIndex];
    updatePlayerBarSong();
    updateSeekBarWhileSongPlays();
    
    $('.currently-playing .song-name').text(currentSongFromAlbum.name);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.name + " - " + currentAlbum.name);
    $('.main-controls .play-pause').html(playerBarPauseButton);
    
    // Save the last song number before changing it
    var lastSongNumber = getLastSongNumber(currentSongIndex);
    
    var $nextSongNumberCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
    var $lastSongNumberCell = $('.song-item-number[data-song-number="' + lastSongNumber + '"]');
    
    $nextSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
};

var previousSong = function() {
    var getLastSongNumber = function(index) {
        return index == (currentAlbum.songs.length - 1) ? 1 : index + 2;
    };
    
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    // Note that we're _decrementing_ the index here
    currentSongIndex--;
    
    if (currentSongIndex < 0) {
        currentSongIndex = currentAlbum.songs.length - 1;        
    }
    
    setSong(currentSongIndex + 1);
    currentSoundFile.play();
    updatePlayerBarSong();
    updateSeekBarWhileSongPlays();
    currentSongFromAlbum = currentAlbum.songs[currentSongIndex];
    
    // Why don't I need this code snipet any more???
    // Set a new current song
    // currentlyPlayingSongNumber = currentSongIndex + 1;

    // Update the Player Bar information
    // updatePlayerBarSong();

    $('.currently-playing .song-name').text(currentSongFromAlbum.name);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.name + " - " + currentAlbum.name);
    $('.main-controls .play-pause').html(playerBarPauseButton);

    var lastSongNumber = getLastSongNumber(currentSongIndex);
    var $previousSongNumberCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
    var $lastSongNumberCell = $('.song-item-number[data-song-number="' + lastSongNumber + '"]');

    $previousSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
};

var togglePlayFromPlayerbar = function(){
    var $currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
    if(currentSoundFile.isPaused()){
        $currentlyPlayingCell.html(pauseButtonTemplate);
        $(this).html(playerBarPauseButton);
        currentSoundFile.play();
    }
    else if(currentSoundFile){
        $currentlyPlayingCell.html(playButtonTemplate);
        $(this).html(playerBarPlayButton);
        currentSoundFile.pause();
    }
};

$(document).ready(function() {
    setCurrentAlbum(albumPicasso);
    setupSeekBars();
    $previousButton.click(previousSong);
    $nextButton.click(nextSong);
    $playPauseButton.click(togglePlayFromPlayerbar);
});