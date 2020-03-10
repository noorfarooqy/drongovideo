// var self;
import Twilio, {
    connect,
    LocalVideoTrack as videoTrack,
    LocalAudioTrack as audioTrack,
    MediaStreamTrack as mediacanvastrack
} from 'twilio-video'
const {
    LocalDataTrack
} = require(`twilio-video`);
export default class {
    constructor(SystemLog) {
        this.connect = null;
        this.online = 0;
        this.chat_set = 0;
        this.video = null;
        var self = this;

        this.datatrack = new LocalDataTrack();
        this.videotrack = null;
        this.canvastrack = null;
        // this.stream = navigator.getUserMedia({
        //         video: true
        //     }, function (video) {
        //         console.log('video tracks ', self.stream.getTracks());
        //         self.LocalVideoTrack = new LocalVideoTrack(this.stream.getTracks()[0]);
        //     },
        //     function (error) {
        //         console.log('error', error)
        //     });

        this.options = {
            name: 'room_name',
            // logLevel: 'debug',  
            audio: true,
            video: {
                width: 400
            },
            data: true,
            tracks: [this.datatrack],
        };
        this.SystemLog = SystemLog;
        this.room = null;
        this.dataTrackPublished = {};
        // self  = this;;
        this.dataTrackPublished.promise = new Promise((resolve, reject) => {
            self.dataTrackPublished.resolve = resolve;
            self.dataTrackPublished.reject = reject;
        });
        this.chatRoom = new RTCMultiConnection();
        this.DataRoom = null;
        this.chatConfig = {
            data: true,
        }
        this.chatRoom.socketURL = 'https://rtcmulticonnection.herokuapp.com:443/';
        
        this.videoPublicationCallBack = null;

    }
    StartConnection(token, room_name, callback, messageReceiveCallback, is_hosting=false) {
        self = this;
        this.videoPublicationCallBack = callback;
        var videoCallBack = (function (video) {
            console.log('video tracks --------------- ', video.getTracks());
            var mediatracks = video.getTracks();
            var audiotrack , videotrack;
            mediatracks.forEach(track => {
                if(track.kind === "video")
                    videotrack = new videoTrack(track);
                else if(track.kind === "audio")
                    audiotrack = new audioTrack(track);
            })
            if(is_hosting)
            {
                var canvas = $('.konvajs-content').children('canvas')[0];
                var stream = canvas.captureStream(25);
                this.canvastrack = new videoTrack(stream.getVideoTracks()[0]);
                this.canvastrack.type ="canvas";
                this.canvastrack.mediaStreamTrack.contentHint = "canvas";
                this.options.tracks.push(this.canvastrack);
            }
            
            videotrack.type ="video";
            audiotrack.type ="audio";
            this.options.tracks.push(videotrack);
            this.options.tracks.push(audiotrack);
            console.log('canvas track ', this.canvastrack);
            this.options.name = room_name;
            // const {gconnect} = require('twilio-video');
            console.log('will open room ', room_name, 'with token ', token);
            // var self = self;
            Twilio.connect(token, self.options)
                .then(room => {
                        console.log('room successfully joined ', room)
                        self.SystemLog({
                            type: 1,
                            head: "System",
                            message: "You have successfully joined the interview room " + room_name,
                            timestamp: self.getTodayDate()
                        });
                        
                        // self.startChatConnection(room_name, messageReceiveCallback);
                        self.online = 1;
                        self.room = room;
                        self.room.localParticipant.publishTrack(videotrack);
                        // self.AttachParticipantListener(callback);
                        self.room.localParticipant.trackPublications.forEach(self.publishLocalTrack)
                        self.room.participants.forEach(participant => {
                            var tracks = participant.tracks;
                            console.log('particpant alraedy in room ',participant)
                            console.log('particapnt tracks ',tracks)
                            
                            participant.on('trackSubscribed', track => {
                                console.log('existing participant added track ',track);
                                
                                self.publishRemoteTrack(track, messageReceiveCallback);
                            })
                            var tracks = participant.tracks;
                            console.log('all tracks ',tracks);
                        })
                        self.room.on('participantConnected', participant => {
                            console.log('new participant ',participant);

                            participant.on('trackSubscribed', track => {
                                console.log('participant added track ',track);
                                self.publishRemoteTrack(track, messageReceiveCallback);
                            })
                            var tracks = participant.tracks;
                            console.log('all tracks ',tracks);
                        });       
                        self.room.on('participantDisconnected', participant => {
                            console.log('particiepant left room ',participant.identity);
                            // participant.tracks.forEach(self.publishRemoteTrack)
                        });                       
                        // callback(room);
                    },
                    error => {
                        console.log('error connection ', error);
                    })
                .catch(error => {
                    console.log('caught error ', error);
                })
        }).bind(this);
        var stream = navigator.getUserMedia({
                video: true,
                audio:true
            }, videoCallBack,
            function (error) {
                console.log('error ------------------- ', error)
            });

    }
    publishLocalTrack(localTrackPublication) {
        console.log('track publicshed is ',localTrackPublication);
        if(localTrackPublication.track.hasOwnProperty('type') && localTrackPublication.track.type === "canvas")
        {
            console.log('local track for canvas ')
            return;
        }    
        if(localTrackPublication.kind === "video" || localTrackPublication.kind === "audio")
        {
            if(self.videoPublicationCallBack === null)
            {
                self.SystemLog({
                    type: 0,
                    head: "System",
                    message: "Video Call back is not set. Failed to publish video " + room_name,
                    timestamp: self.getTodayDate()
                })
            }
            else
                self.videoPublicationCallBack(self.room);
        }
        else if(localTrackPublication.kind === "data")
        {
            this.dataTrackPublished.resolve()
        }

    }
    publishRemoteTrack(remoteTrackPublication, messageReceiveCallback=null)
    {
        console.log('REMOTE track publicshed is ',remoteTrackPublication);
        if(remoteTrackPublication.hasOwnProperty('dimensions') && remoteTrackPublication.dimensions.height == null)
        {
            console.log('remote canvas track ',remoteTrackPublication);
            var oldvideo = $('#limitCanvas');
            var newvideo = document.createElement('video');
            $(newvideo).attr('width', $(oldvideo).width);
            $(newvideo).attr('height', $(oldvideo).height);
            $(newvideo).attr('style', $(oldvideo).style);
            $(newvideo).attr('id', 'limitCanvas');
            $(oldvideo).remove();

            $('#konvasPreview').append(remoteTrackPublication.attach())
            return;
        }   
        if(remoteTrackPublication.kind === "video" || remoteTrackPublication.kind === "audio")
        {
            if(self.videoPublicationCallBack == null)
            {
                self.SystemLog({
                    type: 0,
                    head: "System",
                    message: "Video Call back is not set. Failed to publish video " + room_name,
                    timestamp: self.getTodayDate()
                })
            }
            else
                self.videoPublicationCallBack(remoteTrackPublication,true);
        }
        else if(remoteTrackPublication.kind === "data")
        {
            remoteTrackPublication.on('message', message => {
                console.log('received message ',message);
                message = JSON.parse(message);
                if(messageReceiveCallback)
                    messageReceiveCallback(message);
            })
            this.dataTrackPublished.resolve()
        }
        
    }
    
    sendMessage(data, sendCallback = null) {
        console.log('sending message ',data);
        var message = JSON.stringify(data);
        this.dataTrackPublished.promise.then(() => self.datatrack.send(message));
        if (sendCallback) {
            data.origin = 1;
            sendCallback(data);
        }
    }
    isTwilioOnline() {
        return this.online === 1;
    }
    isChatOn() {
        return this.chat_set === 1;
    }
    AttachParticipantListener(callback) {
        this.room.on('trackAdded', function (track, participant) {
            console.log('parcipant joined the room ', participant);
            callback(participant);
        })
    }
    getTodayDate() {
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();

        today = yyyy + '-' + mm + '-' + dd;
        return today;
    }
    // sendMessage(message, sendCallback = null) {
    //     console.log('sending message ', message)
    //     this.chatRoom.send(message);
    //     if (sendCallback) {
    //         message.origin = 1;
    //         sendCallback(message);
    //     }
    // }

    startChatConnection(room_name, messageReceiveCallback) {
        this.chatRoom.session = this.chatConfig;
        var self = this;
        this.chatRoom.onopen = function () {
            self.SystemLog({
                type: 1,
                head: "System(RTC)",
                message: "The data track for sending message is  set",
                timestamp: self.getTodayDate(),
            })
            self.chat_set = 1;
        }
        this.chatRoom.onmessage = function (event) {
            console.log('received message ', event);
            self.SystemLog({
                type: 1,
                head: "System(RTC)",
                message: "New message has been received",
                timestamp: self.getTodayDate(),
            });
            if (messageReceiveCallback)
                messageReceiveCallback(event.data);

        }
        this.chatRoom.openOrJoin(room_name);
    }
}
