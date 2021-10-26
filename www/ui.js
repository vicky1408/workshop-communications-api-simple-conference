const initUI = () => {

  const nameMessage = document.getElementById('name-message');
  const nameInput = document.getElementById('name-input');
  const conferenceAliasInput = document.getElementById('alias-input');
  const joinButton = document.getElementById('join-btn');

  const leaveButton = document.getElementById('leave-btn');
  const lblDolbyVoice = document.getElementById('label-dolby-voice');
  const startVideoBtn = document.getElementById('start-video-btn');
  const stopVideoBtn = document.getElementById('stop-video-btn');
  const startAudioBtn = document.getElementById('start-audio-btn');
  const stopAudioBtn = document.getElementById('stop-audio-btn');
  const startScreenShareBtn = document.getElementById('start-screenshare-btn');
  const stopScreenShareBtn = document.getElementById('stop-screenshare-btn');
  const startRecordingBtn = document.getElementById('start-recording-btn');
  const stopRecordingBtn = document.getElementById('stop-recording-btn');

  const posterArt = document.getElementById('posterArt');
  const avatarImage = document.getElementById('avatarImage');
  
  nameInput.addEventListener('input', updateNameValue);

  // Update the login message with the name of the user
  nameMessage.innerHTML = `You are logged in as ${randomCity}`;
  nameInput.value = randomCity;
  joinButton.disabled = false;

  joinButton.onclick = () => {
    // Default conference parameters
    // See: https://docs.dolby.io/interactivity/docs/js-client-sdk-model-conferenceparameters
    let conferenceParams = {
      liveRecording: true,
      rtcpMode: "average", // worst, average, max
      ttl: 0,
      videoCodec: "H264", // H264, VP8
      dolbyVoice: true
    };

    // See: https://docs.dolby.io/interactivity/docs/js-client-sdk-model-conferenceoptions
    let conferenceOptions = {
      alias: conferenceAliasInput.value,
      params: conferenceParams,
    };

    // 1. Create a conference room with an alias
    VoxeetSDK.conference.create(conferenceOptions)
      .then((conference) => {
        // See: https://docs.dolby.io/interactivity/docs/js-client-sdk-model-joinoptions
        const joinOptions = {
          constraints: {
            audio: false,
            video: true
          },
          simulcast: false,
          liveRecording: true,
          dolbyVoice: true,
        };

        // 2. Join the conference
        VoxeetSDK.conference.join(conference, joinOptions)
          .then((conf) => {
            lblDolbyVoice.innerHTML = `Dolby Voice is ${conf.params.dolbyVoice ? 'On' : 'Off'}.`;

            conferenceAliasInput.disabled = true;
            joinButton.disabled = true;
            leaveButton.disabled = false;
            startVideoBtn.disabled = true;
            stopVideoBtn.disabled = false;
            startAudioBtn.disabled = false;
            stopAudioBtn.disabled = true;
            startScreenShareBtn.disabled = false;
            startRecordingBtn.disabled = false;
          })
          .catch((e) => console.log(e));
      })
      .catch((e) => console.log(e));
  };

  leaveButton.onclick = () => {
    // Leave the conference
    VoxeetSDK.conference.leave()
      .then(() => {
        lblDolbyVoice.innerHTML = '';

        conferenceAliasInput.disabled = false;
        joinButton.disabled = false;
        leaveButton.disabled = true;
        startVideoBtn.disabled = true;
        stopVideoBtn.disabled = true;
        startAudioBtn.disabled = true;
        stopAudioBtn.disabled = true;
        startScreenShareBtn.disabled = true;
        stopScreenShareBtn.disabled = true;
        startRecordingBtn.disabled = true;
        stopRecordingBtn.disabled = true;
      })
      .catch((e) => console.log(e));
  };

  startVideoBtn.onclick = () => {
    // Start sharing the video with the other participants
    VoxeetSDK.conference.startVideo(VoxeetSDK.session.participant)
      .then(() => {
        startVideoBtn.disabled = true;
        stopVideoBtn.disabled = false;
      })
      .catch((e) => console.log(e));
  };

  stopVideoBtn.onclick = () => {
    // Stop sharing the video with the other participants
    VoxeetSDK.conference.stopVideo(VoxeetSDK.session.participant)
      .then(() => {
        stopVideoBtn.disabled = true;
        startVideoBtn.disabled = false;
      })
      .catch((e) => console.log(e));
  };

  startAudioBtn.onclick = () => {
    // Start sharing the Audio with the other participants
    VoxeetSDK.conference.startAudio(VoxeetSDK.session.participant)
      .then(() => {
        startAudioBtn.disabled = true;
        stopAudioBtn.disabled = false;
      })
      .catch((e) => console.log(e));
  };

  stopAudioBtn.onclick = () => {
    // Stop sharing the Audio with the other participants
    VoxeetSDK.conference.stopAudio(VoxeetSDK.session.participant)
      .then(() => {
        stopAudioBtn.disabled = true;
        startAudioBtn.disabled = false;
      })
      .catch((e) => console.log(e));
  };

  startScreenShareBtn.onclick = () => {
    // Start the Screen Sharing with the other participants
    VoxeetSDK.conference.startScreenShare()
      .then(() => {
        startScreenShareBtn.disabled = true;
        stopScreenShareBtn.disabled = false;
      })
      .catch((e) => console.log(e));
  };

  stopScreenShareBtn.onclick = () => {
    // Stop the Screen Sharing
    VoxeetSDK.conference.stopScreenShare()
      .catch((e) => console.log(e));
  };

  startRecordingBtn.onclick = () => {
    let recordStatus = document.getElementById('record-status');

    // Start recording the conference
    VoxeetSDK.recording.start()
      .then(() => {
        recordStatus.innerText = 'Recording...';
        startRecordingBtn.disabled = true;
        stopRecordingBtn.disabled = false;
      })
      .catch((e) => console.log(e));
  };

  stopRecordingBtn.onclick = () => {
    let recordStatus = document.getElementById('record-status');

    // Stop recording the conference
    VoxeetSDK.recording.stop()
      .then(() => {
        recordStatus.innerText = '';
        startRecordingBtn.disabled = false;
        stopRecordingBtn.disabled = true;
      })
      .catch((e) => console.log(e));
  };

};

// Add a video stream to the web page
const addVideoNode = (participant, stream) => {
  let videoNode = document.getElementById('video-' + participant.id);

  if (!videoNode) {
    videoNode = document.createElement('video');

    videoNode.setAttribute('id', 'video-' + participant.id);
    videoNode.setAttribute('height', 240);
    videoNode.setAttribute('width', 320);
    videoNode.setAttribute("playsinline", true);
    videoNode.muted = true;
    videoNode.setAttribute("autoplay", 'autoplay');
    videoNode.style = 'background: gray;';

    const videoContainer = document.getElementById('video-container');
    videoContainer.appendChild(videoNode);
  }

  navigator.attachMediaStream(videoNode, stream);
};

// Remove the video streem from the web page
const removeVideoNode = (participant) => {
  let videoNode = document.getElementById('video-' + participant.id);

  if (videoNode) {
    videoNode.parentNode.removeChild(videoNode);
  }
};


const createParticpantCard = (participant) => {

  let avatarCard =  `https://res.cloudinary.com/dolby-io/image/upload/e_art:red_rock/ar_16:9,c_fill,g_auto,r_max,w_300/co_rgb:f21904,g_center,l_text:verdana_32_bold__letter_spacing_10:${participant.info.name}/v1634690310/dolby-hackathon/cities/${participant.info.name}.png`

  let newCard = ` <li class="list-group-item  d-flex justify-content-between align-items-center">  
  <img src="${participant.info.avatarUrl}" class="img-fluid rounded-start" alt="${participant.info.name}"> 
  ${participant.info.name} 
  <span class="badge badge-primary badge-pill">  
  <button class="btn btn-warning mute-btn" data-id="${participant.id}">Mute</button>
  </span>
  <span class="badge badge-primary badge-pill">
  <button class="btn btn-primary select-card-btn" data-url="${avatarCard}">Show Card</button>
  </span>
  </li>`

  return newCard;
}


function showCard(event) {
  console.log('Button Clicked');
  let url = event.target.dataset.url
  posterArt.src = url;
}

function muteParticpant(event) {
  console.log('Mute Button Clicked');
  let id = event.target.dataset.id
  alert(id)
}



// Add a new participant to the list
const addParticipantNode = (participant) => {
  // If the participant is the current session user, don't add himself to the list
  if (participant.id === VoxeetSDK.session.participant.id) return;

  let participantNode = document.createElement('p');
  participantNode.setAttribute('id', 'participant-' + participant.id);

 
  participantNode.innerHTML = createParticpantCard(participant);

  const participantsList = document.getElementById('participants-list');
  participantsList.appendChild(participantNode);
 
  var elements = document.getElementsByClassName("select-card-btn");
  Array.from(elements).forEach(function(element) {
    element.addEventListener('click', showCard);
  });

  var muteElements = document.getElementsByClassName("mute-btn");
  Array.from(muteElements).forEach(function(element) {
    element.addEventListener('click', muteParticpant);
  });

};

// Remove a participant from the list
const removeParticipantNode = (participant) => {
  let participantNode = document.getElementById('participant-' + participant.id);

  if (participantNode) {
    participantNode.parentNode.removeChild(participantNode);
  }
};

// Add a screen share stream to the web page
const addScreenShareNode = (stream) => {
  let screenShareNode = document.getElementById('screenshare');

  if (screenShareNode) {
    return alert('There is already a participant sharing a screen!');
  }

  screenShareNode = document.createElement('video');
  screenShareNode.setAttribute('id', 'screenshare');
  screenShareNode.autoplay = 'autoplay';
  navigator.attachMediaStream(screenShareNode, stream);

  const screenShareContainer = document.getElementById('screenshare-container');
  screenShareContainer.appendChild(screenShareNode);
}

// Remove the screen share stream from the web page
const removeScreenShareNode = () => {
  let screenShareNode = document.getElementById('screenshare');

  if (screenShareNode) {
    screenShareNode.parentNode.removeChild(screenShareNode);
  }

  const startScreenShareBtn = document.getElementById('start-screenshare-btn');
  startScreenShareBtn.disabled = false;

  const stopScreenShareBtn = document.getElementById('stop-screenshare-btn');
  stopScreenShareBtn.disabled = true;
}

