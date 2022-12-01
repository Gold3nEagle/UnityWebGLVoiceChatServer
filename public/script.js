var myStream = null;

const peers = {};

var myPeerID;
var peer = new Peer("", {
  secure: true,
  host: "/",
  port: "3001",
});

peer.on("open", function (id) {
  myPeerID = id;
  document.getElementById("my-id").innerHTML = id;
  console.log("My peer ID is: " + id);
});

getLocalStream(true);

function getLocalStream(mute) {
  navigator.mediaDevices
    .getUserMedia({ video: false, audio: true })
    .then((stream) => {
      myStream = stream;
      setupMyAudio(mute);
    })
    .catch((err) => {
      console.error(`you got an error: ${err}`);
    });
}

function setupMyAudio(mute) {
  const video = document.createElement("video");
  video.srcObject = myStream;
  video.style.width = 0;
  video.style.height = 0;
  video.muted = mute;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
  document.body.appendChild(video);
}

/**
 * this function will try to start a call with another peer using thier peer ID
 * @param {string} peerID - the html audio element (it's a video element that only plays audio)
 * @param {MediaStream} stream - your stream variable to be passed to the call
 *
 */
function callPeer(peerID, stream) {
  const call = peer.call(peerID, stream);
  const video = document.createElement("video");
  call.on("stream", (userAudioStream) => {
    addAudioStream(video, userAudioStream);
  });
  call.on("close", () => {
    video.remove();
  });

  peers[peerID] = call;
}

function endCallWithPeer(peerID) {
    peers[peerID].close();
}

/**
 * this function will add the audio stream of the caller or you in the browser
 * @param {HTMLVideoElement} video - the html audio element (it's a video element that only plays audio)
 * @param {MediaStream} stream - the stream variable to be used on the audio element
 *
 */
function addAudioStream(audio, stream) {
  audio.srcObject = stream;
  audio.style.width = 0;
  audio.style.height = 0;
  audio.addEventListener("loadedmetadata", () => {
    audio.play();
  });
  document.body.appendChild(audio);
}

peer.on("call", (call) => {
  call.answer(myStream);
  const video = document.createElement("video");
  call.on("stream", (userAudioStream) => {
    addAudioStream(video, userAudioStream);
  });
});
