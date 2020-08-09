const socket = io('/');
const videoGrid = document.getElementById("video-grid");
const myVideo = document.createElement('video');
myVideo.muted = true;

var peer = new Peer(undefined, {
    path: '/peerjs',
    host: '/',
    port: '443'
}); 

let myVideoStream;

navigator.mediaDevices.getUserMedia({
    video: true,
    audio:true
}).then(stream => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream);

    peer.on('call', call => {
            call.answer(stream);
            const video = document.createElement('video');
            call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream);
        })
    })
    socket.on('user-connected', (userId) => {
        connectToNewUser(userId, stream);
    })
})

peer.on('open', id => {
    socket.emit('join-room', ROOM_ID, id);
})




const connectToNewUser = (userId, stream) => {
    const call = peer.call(userId, stream);
    const video = document.createElement('video');
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream);
    })
}


const addVideoStream = (video, stream) =>{

    video.srcObject = stream;
    video.addEventListener('loadmetadata', () => {
        video.play();
    })

    videoGrid.append(video);
}

let message = $('input');
console.log(message);


$('html').keydown((e) => {
    if(e.which == 13 && message.val().length !==0 ){
        socket.emit('message', message.val());
        message.val('');
    }
})

socket.on('createmessage', message =>{
    console.log('this is coming from server',message);
    $(`.messages`).append(`<li class="message"><b>user</b><br/>${message}</li>`);
})

const scrollToBottom =() =>{
    let d = $('.main_chat_window');
    d.scrollTop(d.prop("scrollHeight"));
}

const muteUnmute = () => {
    const enabled = myVideoStream.getAudioTracks()[0].enabled;

    if(enabled) {
        myVideoStream.getAudioTracks()[0].enabled = false;
        setUnmuteButton();
    } else {
        setMuteButton();
        myVideoStream.getAudioTracks()[0].enabled = true;
    }
}

const setMuteButton = () => {
    const html =` <i class="fas fa-microphone"></i>
    <span>Mute</span>`

    document.querySelector('.main_mute_button').innerHTML = html;
}

const setUnmuteButton = () => {
    const html =` <i class="unmute fas fa-microphone-slash"></i>
    <span>UnMute</span>`

    document.querySelector('.main_mute_button').innerHTML= html
}

const playStopVideo = () => {
    const enabled = myVideoStream.getVideoTracks()[0].enabled;

    if(enabled) {
        myVideoStream.getVideoTracks()[0].enabled = false;
        setPlayVideo();
    } else {
        setStopVideo();
        myVideoStream.getVideoTracks()[0].enabled = true;
    }
}

const setPlayVideo = () => {
    const html =` <i class=" stopVideo fas fa-video-slash"></i>
    <span>Start Video</span>`

    document.querySelector('.main_video_button').innerHTML = html;
}

const setStopVideo = () => {
    const html =` <i class=" fas fa-video"></i>
    <span>Stop Video</span>`

    document.querySelector('.main_video_button').innerHTML= html
}