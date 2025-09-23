const songs = [
  {
    title: "ballad of the bees",
    artist: "cautious",
    file: "./Music/All/balladofthebees.ogg",
  },
  {
    title: "boss theme",
    artist: "cautious",
    file: "./Music/All/bosstheme.wav",
  },
  {
    title: "gone fishing",
    artist: "cautious",
    file: "./Music/All/gonefishing.ogg",
  },
  {
    title: "the great unknown",
    artist: "cautious",
    file: "./Music/All/thegreatunknown.ogg",
  }
];

let currentSongIndex = 0;

const wavesurfer = WaveSurfer.create({
  container: "#waveform",
  waveColor: "white",
  progressColor: "black",
  responsive: true,
});

window.addEventListener("resize", () => {
  if (wavesurfer) {
    wavesurfer.resize();
  }
});

function loadSong(index, autoPlay = true) {
  currentSongIndex = index;
  const song = songs[index];

  wavesurfer.load(song.file);
  document.getElementById(
    "currentSong"
  ).textContent = `${song.title} - ${song.artist}`;

  document.querySelectorAll(".song-item").forEach((item, i) => {
    item.classList.toggle("active", i === index);
  });

  if (autoPlay) {
    wavesurfer.once("ready", () => {
      wavesurfer.play();
      document.getElementById("playPauseBtn").textContent = "⏸";
    });
  }
}

function createPlaylist() {
  const playlist = document.getElementById("playlist");

  songs.forEach((song, index) => {
    const songDiv = document.createElement("div");
    songDiv.className = "song-item";
    songDiv.innerHTML = `
      <div class="song-title">${song.title}</div>
      <div class="song-artist">${song.artist}</div>
    `;

    songDiv.addEventListener("click", () => {
      loadSong(index);
    });

    playlist.appendChild(songDiv);
  });
}

document.getElementById("playPauseBtn").addEventListener("click", () => {
  const btn = document.getElementById("playPauseBtn");
  if (wavesurfer.isPlaying()) {
    wavesurfer.pause();
    btn.textContent = "▶";
  } else {
    wavesurfer.play();
    btn.textContent = "⏸";
  }
});

const volumeSlider = document.getElementById("volumeSlider");
volumeSlider.addEventListener("input", (e) => {
  const volume = parseFloat(e.target.value);
  wavesurfer.setVolume(volume);
});

wavesurfer.setVolume(1);

wavesurfer.on("finish", () => {
  const nextIndex = (currentSongIndex + 1) % songs.length;
  loadSong(nextIndex);
  wavesurfer.play();
});

createPlaylist();
loadSong(0, false);