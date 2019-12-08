var self;
import Twilio, { connect, createLocalTracks, createLocalVideoTrack } from 'twilio-video'
export default class {
    constructor()
    {
        this.connect = null;
        this.online =0;
        this.video = null;
        self = this;
        this.options = {
            name: 'room_name',
            // logLevel: 'debug',
            audio: true,
            video: { width: 400 },
        };

    }
    StartConnection(token, room_name, callback)
    {
        this.options.name = room_name;
        // const {gconnect} = require('twilio-video');
        console.log('will open room ',room_name, 'with token ', token);
        Twilio.connect(token, this.options)
        .then(room => {
            console.log('room successfully joined ',room)
            callback(room);
        },
        error => {
            console.log('error connection ',error);
        })
        .catch(error => {
            console.log('caught error ',error);
        })
    }
}