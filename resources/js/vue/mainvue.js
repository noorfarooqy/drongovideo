import ".././bootstrap";
import Picker from 'vanilla-picker';

import Error from "../classes/Error";
import Success from "../classes/Success";
import ServerRequest from "../classes/ServerRequest";
import Connection from ".././classes/Connection";
import Cloudinary from "../classes/Cloudinary";
window.SyncClient = require('twilio-sync');
//components
import localvideo from "../vuecomponents/localvideo.vue"
import remotevideo from "../vuecomponents/remotevideo.vue"
// import pdfjs from "../pdfcomponent/pdfjs.vue";
import konvacanvas from "../canvas/konvacanvas.vue";

// const VideoGrant = AccessToken.VideoGrant;
var App = new Vue({
    el: "#App",
    data: {
        Error: new Error(),
        Success: new Success(),
        Server: new ServerRequest(),
        Connection : new Connection(),
        local_video: {
            video_src: [],
            visible: false,
        },
        remote_video: {
            video_src: null,
            visible: false,
        },
        default_video: {
            video_src: '/images/offline.svg',
            visible:true,
        },
        Room:null,
        SyncClient : null,
        Cloudinary : new Cloudinary(),
        // Log: new Log(),
        colorPicker: {
            picker: null,
            visible: false,
            current: {rgbaString: '#ffffff'}
        },
        info_tabs: {
            school:true,
            employee: false,
            chat:false,
            current:0,
        }


    },
    mounted() {
        // alert('ready');
        this.getAccesstoken();
        this.Cloudinary.launchUploadWidget()

    },
    methods: {
        getAccesstoken()
        {
            this.Server.setRequest({
                identity: 'Noor',
                room_name: 'noor_room',
            });
            this.Server.serverRequest('/api/event/gettoken',
                this.eventData, this.showErrorModal)
        },
        eventData(data)
        {
            console.log('data ',data);
            // this.StartConnection(data.token, 'noor_room');
            // this.SyncClient = new SyncClient(data.token, { logLevel: 'debug' });
            // this.SyncClient.document('MyDocument')
            // .then(document => {
            //     console.log('document is set ',document)
            // }, error=>{
            //     console.log('error in document ',error);
            // })
            // .catch(error => {
            //     console.log('catch error ',error);
            // })
        },
        StartConnection(token,room_name)
        {
            this.Connection.StartConnection(token, room_name, this.ConnectionCallBack);
            
        },
        ConnectionCallBack(room)
        {
            this.Room = room;
            console.log('Room ', this.Room);
            console.log(this.Room.localParticipant.tracks);
            var localtracks = this.Room.localParticipant.tracks;
            localtracks.forEach(localtrack => {
                this.local_video.video_src.push(localtrack);
            })
            // this.local_video.video_src = this.Room.localParticipant.v
            this.default_video.visible = false;
            this.local_video.visible = true;
        },
        showErrorModal(error)
        {
            this.Error.showErrorModal(error);
        },

        //style and script functions
        getActiveTab(index){
            if(index === this.info_tabs.current)
                return;
            this.info_tabs.school = index === 0;
            this.info_tabs.employee = index === 1;
            this.info_tabs.chat = index === 2;
            this.info_tabs.current = index;
        },
        getActiveClass(index){
            if(index === this.info_tabs.current)
                return 'active';
            return '';
        },
        getBackgroundColor()
        {
            var self = this;
            this.colorPicker.picker = new Picker({
                parent: document.querySelector('#colorPickerContainer'),
                editor:true,
                popup:true,
                cancelButton:true,
                onChange: function(color){
                    self.notifyBackgroundChange(color)
                },
                onDone: function(color){
                    self.notifyDonePicker(color)
                },
                color:this.colorPicker.current.rgbaString,
            });
            console.log('picker is ready ',this.colorPicker.picker);
            this.colorPicker.visible = true;
            this.colorPicker.picker.openHandler();

        },
        notifyBackgroundChange(color)
        {
            // console.log('color to changed to ',color.rgbaString, 'from ', this.colorPicker.current.rgbaString)
            this.colorPicker.current = color;
        },
        notifyDonePicker(color)
        {
            console.log('Done picker color to changed to ',color.rgbaString, 'from ', this.colorPicker.current.rgbaString)
            this.colorPicker.current = color;
        },
        setBackgroundColor()
        {
            return 'background-color: '+this.colorPicker.current.rgbaString;
        }

    },
    components: {localvideo, remotevideo, customCanvas:konvacanvas}
})