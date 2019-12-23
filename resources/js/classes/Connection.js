var self;
import Twilio, { connect, LocalAudioTrack, LocalVideoTrack ,LocalDataTrack} from 'twilio-video'
export default class {
    constructor(SystemLog)
    {
        this.connect = null;
        this.online =0;
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

    }
    StartConnection(token, room_name, callback)
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
            })
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
                if(track.kind === "data")
                {
                    track.on('message', data => {
                        // console.log(data);
                        this.SystemLog({
                            type:1,
                            message: data,
                            head: 'system:',
                        });
                        console.log('Received message ',data);
                      });
                    
                }
                // room.
                // this.dataTrackPublished.resolve();
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
            room.on('message', function(data) {
                console.log('received message ',data)
            })
            callback(room);
        },
        error => {
            console.log('error connection ',error);
        })
        .catch(error => {
            console.log('caught error ',error);
        })
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
    sendMessage(message)
    {
        console.log('asked to send message');
        if(this.dataTrackPublished === {} || this.dataTrackPublished === null)
        {
            this.SystemLog({
                type:2,
                head: "System",
                message: "The data track for sending message is not published",
                timestamp: this.getTodayDate(),
            })
            return;
        }
        if(this.datatrack === null)
        {
            this.SystemLog({
                type:2,
                head: "System",
                message: "The data track for sending message is not set",
                timestamp: this.getTodayDate(),
            })
            return;
        }
        console.log('sending message ',message);
        this.dataTrackPublished.promise.then(() => self.dataTrack.send(message));
    }
}