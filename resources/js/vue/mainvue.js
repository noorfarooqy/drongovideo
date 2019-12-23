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
import errormodal from "../vuecomponents/errormodal.vue"
import loader from "../vuecomponents/loader.vue"
// import pdfjs from "../pdfcomponent/pdfjs.vue";
import konvacanvas from "../canvas/konvacanvas.vue";

// const VideoGrant = AccessToken.VideoGrant;
var App = new Vue({
    el: "#App",
    data: {
        Error: new Error(),
        Success: new Success(),
        Server: new ServerRequest(),
        Connection :null,
        local_video: {
            video_src: [],
            visible: false,
            muted: true,
        },
        remote_video: {
            video_src: [],
            visible: false,
            muted: true,
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
        },
        file_info: {
            src:null,
            type:null,
            size: null,
            isLoading : false,
        },
        file_sharing: {
            visible: false,
            current_page_src: null,
            current_page_num:0,
            total_pages : 0,
            all_pages:[],
            image: null,

        },
        loading: {
            visible:false,
            loading_text: null,
        },
        SystemLog: [
        ],
        is_hosting: !window.type,
        host_type: window.type,


    },
    mounted() {
        // alert('ready');
        this.Connection =new Connection(this.logSystem);
        // this.getAccesstoken();
        

    },
    methods: {
        triggerFileSharing()
        {
            this.file_sharing = {
                visible: true,
                current_page_src: 'somedefault',
                current_page_num:0,
                total_pages : 10,
                all_pages:['one', 'two'],
    
            }

        },
        getAccesstoken()
        {
            if(window.user_name === null || window.user_name === undefined)
            {
                this.showErrorModal("The user information is not set");
                return;
            }
            this.Server.setRequest({
                identity: window.user_name+' '+window.user_id,
                room_name: 'noor_room',
            });
            this.Server.serverRequest('/api/event/gettoken',
                this.eventData, this.showErrorModal)
        },
        eventData(data)
        {
            console.log('data ',data);
            this.StartConnection(data.token, 'noor_room');
        },
        StartConnection(token,room_name)
        {
            this.Connection.StartConnection(token, room_name, this.ConnectionCallBack);
            
        },
        ConnectionCallBack(room, remote=0)
        {
            if(!remote)
            {

                this.Room = room;
                console.log('Room ', this.Room);
                console.log(this.Room.localParticipant.tracks);
                var localtracks = this.Room.localParticipant.tracks;
                if(this.local_video.video_src.length >=2)
                {
                    this.local_video.video_src =[];
                }
                localtracks.forEach(localtrack => {
                    this.local_video.video_src.push(localtrack);
                });
                this.default_video.visible = false;
                this.local_video.visible = true;
            }
            else
            {
                console.log('receving track ',room);
                var remotetrack =  room;
                if(this.remote_video.video_src.length >=2)
                {
                    this.remote_video.video_src =[];
                }
                this.remote_video.video_src.push(remotetrack);
                // this.default_video.visible = false;
                this.remote_video.visible = true;
                console.log('pushed new remote track ',this.remote_video)

            }
            this.Connection.sendMessage({m:'message', type: 'text'});
            // this.local_video.video_src = this.Room.localParticipant.v
            
        },
        remoteAuidoToggle()
        {
            var remote_video = document.querySelector('.remote-video');
            if(remote_video)
            {
                console.log('remote video will muted ', !remote_video.muted)
                remote_video.muted = !remote_video.muted;
                this.remote_video.muted = remote_video.muted;
            }
        },
        localAuidoToggle()
        {
            var local_video = document.querySelector('.local-video');
            if(local_video)
            {
                console.log('local video will muted ', !local_video.muted)
                local_video.muted = !local_video.muted;
                this.local_video.muted = local_video.muted;
            }
        },

        uploadMainfiles(event,isPDF)
        {
            
            console.log('loading file');
            if(this.file_info.isLoading )
                return;
            this.loading.loading_text = "Uploading file to the server";
            this.loading.visible = true;
            this.file_info.isLoading = true;
            console.log('event ',event.target.files[0].type)
            console.log('isPdf ',isPDF)
            var type =event.target.files[0].type;
            var is_valid = isPDF === true ? this.isAllowedPDF(type) : this.isAllowPPT(type);
            if(!is_valid)
            {
                this.Error.error_text = 'The file type you have selected is not supported';
                this.Error.visible = true;
                this.file_info.isLoading = false;
                this.closeLoader();
                return;
            }
            this.file_info.type = isPDF === true ? 0 : 1;
            // this.Server.previewFile(event.target, this.fileLoaded, this.showErrorModal);
            var formdata = new FormData();
            formdata.append('file_src',event.target.files[0]);
            formdata.append('file_type', this.file_info.type);
            // this.fileLoaded(formdata);
            this.Server.setRequest(formdata);
            this.Server.serverRequest('/api/event/upload/file',this.fileLoaded, this.showErrorModal);
            
        },
        fileLoaded(data)
        {
            var pages = data.files;
            pages.forEach(page => {
                console.log('page is ',page)
                this.file_sharing.all_pages = pages;
                this.file_sharing.visible = true;
                this.file_sharing.current_page_src = pages[0];
            })
            var image = new window.Image();
            image.src = pages[0];
            image.onload =() => {
                this.file_sharing.image = {
                    image: image,
                    width: 500,
                    height: 700,
                    pages: pages,
                    current_page: 0,
                    num_pages: pages.length
                }
                this.file_info ={
                    src:null,
                    type:null,
                    size: null,
                    isLoading : false,
                }
                console.log('completed ',data);
    
                this.closeLoader();
            }
            
        },
        isAllowedPDF(type)
        {
            console.log('checking pdf ');
            switch(type)
            {
                case 'application/pdf':
                    return true;
                default:
                    return false;
            }
        },
        isAllowPPT(type)
        {
            console.log('checking ppt ');
            switch(type)
            {
                case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
                    return true;
                case 'application/vnd.ms-powerpoint':
                    return true;
                default:
                    return false;
            }
        },
        

        //style and script functions
        showErrorModal(error)
        {
            this.Error.showErrorModal(error);
            this.file_info.isLoading = false;

            this.closeLoader();
        },
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
        },
        closeLoader()
        {
            this.loading = {
                visible:false,
                loading_text: null,
            }
        },
        getTypeClass(type)
        {
            switch(type)
            {
                case 0:
                    return 'alert alert-primary';
                case 1: 
                    return 'alert alert-success';
                case 2:
                    return 'alert alert-danger';
            }
        },
        logSystem(log)
        {
            this.SystemLog.push(log);
        },
        getHostInControl()
        {
            if(this.is_hosting)
                return "You in control";
            else
                return this.host_type === 0 ? "Teacher in Control " : "School in control"
        },

    },
    components: {localvideo, remotevideo, customCanvas:konvacanvas, errormodal, loader}
})