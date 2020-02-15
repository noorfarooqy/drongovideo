var self;
import Twilio, { connect, LocalAudioTrack, LocalVideoTrack ,LocalDataTrack} from 'twilio-video'
export default class {
    constructor(SystemLog)
    {
        this.connect = null;
        this.online =0;
        this.chat_set = 0;
        this.video = null;
        self = this;

        this.datatrack = new LocalDataTrack();
        // this.localAudioTrack = new LocalAudioTrack();
        // this.localVideoTrack = new LocalVideoTrack();
        this.options = {
            name: 'room_name',
            // logLevel: 'debug',  
            audio: true,
            video: { width: 400 },
            data:true,
            // tracks: [ this.localAudioTrack],
        };
        this.SystemLog = SystemLog;
        this.room =null;
        this.dataTrackPublished = {};
        // self  = this;;
        this.dataTrackPublished.promise = new Promise((resolve, reject) => {
            self.dataTrackPublished.resolve = resolve;
            self.dataTrackPublished.reject = reject;
          });
        this.chatRoom = new RTCMultiConnection();
        this.chatConfig = {
            data: true,
        }
        this.chatRoom.socketURL = 'https://rtcmulticonnection.herokuapp.com:443/';

    }
    StartConnection(token, room_name, callback, messageReceiveCallback)
    {
        this.options.name = room_name;
        // const {gconnect} = require('twilio-video');
        console.log('will open room ',room_name, 'with token ', token);
        var self = this;
        Twilio.connect(token, this.options)
        .then(room => {
            console.log('room successfully joined ',room)
            this.SystemLog({
                type: 1,
                head: "System",
                message: "You have successfully joined the interview room "+room_name,
                timestamp: this.getTodayDate()
            });
            this.startChatConnection(room_name, messageReceiveCallback);
            this.online = 1;
            self.room = room;
            // self.AttachParticipantListener(callback);
            room.on('trackSubscribed', function(track,participant) {
                console.log('track joined the room ',participant, );
                console.log('track ',track, );
                self.SystemLog({
                    type: 1,
                    head: participant.identity,
                    message: "Have joined the interview room "+room_name,
                    timestamp: self.getTodayDate()
                })
                callback(track, true);
            })
            room.on('participantConnected', function(participant) {
                console.log('parcipant joined the room ',participant);
                self.SystemLog({
                    type: 1,
                    head: participant.identity,
                    message: "Have returned to the interview room "+room_name,
                    timestamp: self.getTodayDate()
                })
                
            })
            room.on('participantDisconnected', function(participant) {
                console.log('parcipant disconnected the room ',participant);
                self.SystemLog({
                    type: 2,
                    head: participant.identity,
                    message: "Have left the interview room "+room_name,
                    timestamp: self.getTodayDate()
                })
            });
            callback(room);
        },
        error => {
            console.log('error connection ',error);
        })
        .catch(error => {
            console.log('caught error ',error);
        })
    }
    isTwilioOnline()
    {
        return this.online === 1;
    }
    isChatOn()
    {
        return this.chat_set === 1;
    }
    AttachParticipantListener(callback)
    {
        this.room.on('trackAdded', function(track,participant) {
            console.log('parcipant joined the room ',participant);
            callback(participant);
        })
    }
    getTodayDate()
    {
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();

        today =  yyyy +'-'+ mm + '-' + dd ;
        return today;
    }
    sendMessage(message, sendCallback=null)
    {
        console.log('sending message ',message)
        this.chatRoom.send(message);
        if(sendCallback)
        {
            message.origin = 1;
            sendCallback(message);
        }
    }
    startChatConnection(room_name, messageReceiveCallback)
    {
        this.chatRoom.session = this.chatConfig;
        var self = this;
        this.chatRoom.onopen = function(){
            self.SystemLog({
                type:1,
                head: "System(RTC)",
                message: "The data track for sending message is  set",
                timestamp: self.getTodayDate(),
            })
            self.chat_set = 1;
        }
        this.chatRoom.onmessage = function(event)
        {
            console.log('received message ',event);
            self.SystemLog({
                type:1,
                head: "System(RTC)",
                message: "New message has been received",
                timestamp: self.getTodayDate(),
            });
            if(messageReceiveCallback)
                messageReceiveCallback(event.data);

        }
        this.chatRoom.openOrJoin(room_name);
    }
}