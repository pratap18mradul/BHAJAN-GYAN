const songs = [
    { name: 'Shri Ganesh Chalisha', file: 'songs/ganesh-chalisa.mp3', cover: 'images/ganesh-chalisa.jpg', info: 'A devotional prayer dedicated to Lord Ganesh.' },
    { name: 'Gayatri Mantra', file: 'songs/gayatri-mantra.mp3', cover: 'images/gayatri-mantra.png', info: 'A peaceful mantra for focus, calm, and devotion.' },
    { name: 'Shri Hanuman Chalisa', file: 'songs/hanuman-chalisa.mp3', cover: 'images/hanuman-chalisa.jpg', info: 'A powerful hymn devoted to Lord Hanuman.' },
    { name: 'Shri Ram Bhajan', file: 'songs/ram-bhajan.mp3', cover: 'images/ram-bhajan.jpg', info: 'A soulful bhajan celebrating Lord Ram.' },
    { name: 'Shri Ram Bhajan 2', file: 'songs/ram-bhajan-2.mp3', cover: 'images/ram-bhajan-2.jpg', info: 'A gentle Ram bhajan for quiet listening.' },
    { name: 'Shri Ram Bhajan 3', file: 'songs/ram-bhajan-3.mp3', cover: 'images/ram-bhajan-3.jpg', info: 'A devotional track filled with Ram naam.' },
    { name: 'Shri Durga Aarti', file: 'songs/durga-aarti.mp3', cover: 'images/durga-aarti.jpg', info: 'An aarti in praise of Maa Durga.' },
    { name: 'Shri Krishna Bhajan', file: 'songs/krishna-bhajan.mp3', cover: 'images/krishna-bhajan.jpg', info: 'A sweet Krishna bhajan with devotional mood.' },
    { name: 'Shri Krishna Bhajan 2', file: 'songs/krishna-bhajan-2.mp3', cover: 'images/krishna-bhajan-2.jpg', info: 'A calming bhajan devoted to Shri Krishna.' },
    { name: 'Aarambh Hai Prachnd', file: 'songs/aarambh-hai-prachnd.mp3', cover: 'images/aarambh-hai-prachnd.jpg', info: 'An energetic devotional song with strong rhythm.' }
];

const audio = new Audio(songs[0].file);
let songIndex = 0;

const progressBar = document.getElementById('myprogressbar');
const songItems = Array.from(document.querySelectorAll('.songitem'));
const previousButton = document.getElementById('previousbutton');
const masterPlayButton = document.getElementById('masterplay');
const masterPlayIcon = masterPlayButton.querySelector('i');
const nextButton = document.getElementById('nextbutton');
const songInfo = document.querySelector('.songinfo');
const currentSongText = document.querySelector('.songinfo span');
const currentTimeText = document.getElementById('currenttime');
const durationTimeText = document.getElementById('durationtime');
const navLinks = Array.from(document.querySelectorAll('.navlink'));
const viewTitle = document.getElementById('viewtitle');
const viewMessage = document.getElementById('viewmessage');
const songList = document.querySelector('.songlist');
const songBanner = document.querySelector('.songbanner');
const nowPlayingCard = document.querySelector('.nowplayingcard');
const nowPlayingCover = document.getElementById('nowplayingcover');
const nowPlayingTitle = document.getElementById('nowplayingtitle');
const nowPlayingAbout = document.getElementById('nowplayingabout');
const savedFavourites = JSON.parse(localStorage.getItem('bhajanFavourites') || '[]');
const favourites = new Set(savedFavourites);

songItems.forEach((item, index) => {
    item.dataset.songIndex = index;

    const favouriteButton = document.createElement('button');
    favouriteButton.type = 'button';
    favouriteButton.className = 'favoritebutton';
    favouriteButton.setAttribute('aria-label', 'Add to favourites');
    favouriteButton.innerHTML = '<i class="fa-solid fa-heart"></i>';

    const songListPlay = item.querySelector('.songlistplay');
    item.insertBefore(favouriteButton, songListPlay);
});

const songItemButtons = Array.from(document.querySelectorAll('.songitem .songlistplay .fa-circle-play'));
const songItemPlayAreas = Array.from(document.querySelectorAll('.songitem .songlistplay'));
const favouriteButtons = Array.from(document.querySelectorAll('.favoritebutton'));

function formatTime(seconds) {
    if (!Number.isFinite(seconds)) {
        return '00:00';
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

function updateTimeDisplay() {
    currentTimeText.textContent = formatTime(audio.currentTime);
    durationTimeText.textContent = `-${formatTime(audio.duration - audio.currentTime)}`;
}

function saveFavourites() {
    localStorage.setItem('bhajanFavourites', JSON.stringify(Array.from(favourites)));
}

function updateFavouriteButtons() {
    favouriteButtons.forEach((button, index) => {
        const isFavourite = favourites.has(index);
        button.classList.toggle('favourite', isFavourite);
        button.setAttribute('aria-label', isFavourite ? 'Remove from favourites' : 'Add to favourites');
    });
}

function pauseIcon(icon) {
    icon.classList.remove('fa-circle-pause');
    icon.classList.add('fa-circle-play');
}

function playIcon(icon) {
    icon.classList.remove('fa-circle-play');
    icon.classList.add('fa-circle-pause');
}

function resetSongItemButtons() {
    songItemButtons.forEach(pauseIcon);
}

function updatePlayerUi() {
    currentSongText.textContent = songs[songIndex].name;
    nowPlayingCover.src = songs[songIndex].cover;
    nowPlayingCover.alt = `${songs[songIndex].name} cover`;
    nowPlayingTitle.textContent = songs[songIndex].name;
    nowPlayingAbout.textContent = songs[songIndex].info;

    songItems.forEach((item, index) => {
        item.classList.toggle('active', index === songIndex && !audio.paused);
    });

    resetSongItemButtons();

    if (audio.paused) {
        pauseIcon(masterPlayIcon);
        songInfo.classList.remove('is-playing');
        nowPlayingCard.classList.remove('is-playing');
        return;
    }

    playIcon(masterPlayIcon);
    playIcon(songItemButtons[songIndex]);
    songInfo.classList.add('is-playing');
    nowPlayingCard.classList.add('is-playing');
}

function setView(view) {
    songList.classList.toggle('full-view', view !== 'home');
    songBanner.classList.toggle('hidden', view !== 'home');

    navLinks.forEach((link) => {
        link.classList.toggle('active', link.dataset.view === view);
    });

    viewMessage.classList.remove('show', 'song-detail');
    viewMessage.textContent = '';

    if (view === 'about') {
        viewTitle.textContent = 'About BHAJAN';
        viewMessage.textContent = 'BHAJAN is your peaceful devotional music player. Tap hearts to save favourites, and control playback from the black player box. Thanks for listening our bhajan. CREATED BY MRADUL PRATAP';
        viewMessage.classList.add('show');
        songItems.forEach((item) => item.classList.add('hidden'));
        return;
    }

    if (view === 'favourites') {
        viewTitle.textContent = 'Your Favourites';
        let visibleCount = 0;

        songItems.forEach((item, index) => {
            const shouldShow = favourites.has(index);
            item.classList.toggle('hidden', !shouldShow);
            if (shouldShow) {
                visibleCount += 1;
            }
        });

        if (visibleCount === 0) {
            viewMessage.textContent = 'No favourites yet. Go to Home and tap the heart on any song.';
            viewMessage.classList.add('show');
        }

        return;
    }

    viewTitle.textContent = 'BHAJAN- Reunite With The God';
    songItems.forEach((item) => item.classList.remove('hidden'));
}

function loadSong(index) {
    songIndex = (index + songs.length) % songs.length;
    audio.src = songs[songIndex].file;
    progressBar.value = 0;
    updateTimeDisplay();
    updatePlayerUi();
}

function playSong() {
    audio.play();
}

function pauseSong() {
    audio.pause();
}

function toggleCurrentSong() {
    if (audio.paused) {
        playSong();
    } else {
        pauseSong();
    }
}

function playSelectedSong(index) {
    if (songIndex === index && !audio.paused) {
        pauseSong();
        return;
    }

    if (songIndex !== index) {
        loadSong(index);
    }

    playSong();
}

function playNextSong() {
    loadSong(songIndex + 1);
    playSong();
}

function playPreviousSong() {
    loadSong(songIndex - 1);
    playSong();
}

masterPlayButton.addEventListener('click', toggleCurrentSong);
nextButton.addEventListener('click', playNextSong);
previousButton.addEventListener('click', playPreviousSong);

songItemPlayAreas.forEach((button, index) => {
    button.addEventListener('click', (event) => {
        event.stopPropagation();

        playSelectedSong(index);
    });
});

songItems.forEach((item, index) => {
    item.addEventListener('click', () => {
        playSelectedSong(index);
    });

    item.addEventListener('dblclick', () => {
        playSelectedSong(index);
    });
});

favouriteButtons.forEach((button, index) => {
    button.addEventListener('click', (event) => {
        event.stopPropagation();

        if (favourites.has(index)) {
            favourites.delete(index);
        } else {
            favourites.add(index);
        }

        saveFavourites();
        updateFavouriteButtons();

        const activeView = document.querySelector('.navlink.active')?.dataset.view;
        if (activeView === 'favourites') {
            setView('favourites');
        }
    });
});

navLinks.forEach((link) => {
    link.addEventListener('click', () => setView(link.dataset.view));
});

audio.addEventListener('play', updatePlayerUi);
audio.addEventListener('pause', updatePlayerUi);
audio.addEventListener('loadedmetadata', updateTimeDisplay);

audio.addEventListener('timeupdate', () => {
    if (!audio.duration) {
        updateTimeDisplay();
        return;
    }

    progressBar.value = Math.floor((audio.currentTime / audio.duration) * 100);
    updateTimeDisplay();
});

progressBar.addEventListener('input', () => {
    if (!audio.duration) {
        return;
    }

    audio.currentTime = (progressBar.value * audio.duration) / 100;
    updateTimeDisplay();
});

audio.addEventListener('ended', playNextSong);

updateTimeDisplay();
updateFavouriteButtons();
setView('home');
updatePlayerUi();
