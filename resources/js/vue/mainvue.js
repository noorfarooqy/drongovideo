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
import troubleshooter from "../vuecomponents/troubleshoot.vue";
import control from "../vuecomponents/control.vue";
// import whiteboard from "../whiteboard/whiteboard.vue";

// const VideoGrant = AccessToken.VideoGrant;
var App = new Vue({
    el: "#App",
    data: {
        Error: new Error(),
        Success: new Success(),
        Server: null,
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
            log:false,
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
        is_hosting: window.type == 0,
        host_type: window.type,
        Chat: {
            message: null,
            type:0,
            origin:0,
            head:null,
            timestamp:null,
        },
        chat_message:null,
        messages: [],
        video_sharing: {
            current_time:null,
            playing:false,
            src:null,
            visible:false,
            update: false,

        },
        troubleshoot: {
            visible: false,
            Errors: [],
            Success: [],
            Info: [],
            closeModal: function(troubleshoot){
                troubleshoot.visible = false;
                troubleshoot.Errors = [],
                troubleshoot.Success =[],
                troubleshoot.Info = []
            }
        },
        Access: {
            visible: false,
            Errors: {
                text: null,
                visible: false
            },
            hijack_control : false,
            request_control: false,
            show_request: false,
            request_denied: false,
            closeModal: function(model)
            {
                model.visible = false;
                model.Errors.text = null;
                model.Errors.visible = false;
                model.visible = false
                model.hijack_control = false
                model.request_control = false
                model.show_request = false;
                model.request_denied = false
            },
        }
        


    },
    mounted() {
        // alert('ready');
        this.Server = new ServerRequest(this.onProgressBar);
        this.Connection =new Connection(this.logSystem);
        this.getAccesstoken();
        this.Connection.startChatConnection('noor_chat_room',this.showMessage);


    },
    methods: {
        onProgressBar(percent, isDownload)
        {
            console.log('percentage ',percent);
            if(isDownload)
            {
                if(percent >= 100 )
                    this.loading.loading_text = "Downloading your file. This will take few seconds...";
                else
                    this.loading.loading_text =  "Downloading file "+percent+ " % ";
            }
            else
            {
                if(percent >= 100 )
                    this.loading.loading_text = "Processing your file. This will take few seconds...";
                else
                    this.loading.loading_text =  "Uploading file "+percent+ " % ";
            }
            
        },
        canvasUpdate(message)
        {
            if(this.Connection !== null)
                this.Connection.sendMessage(message, this.showMessage);
        },
        sendChat()
        {
            if(this.chat_message === "" || this.chat_message === null)
                return;
            else
            {
                this.Chat.message = this.chat_message;
                this.Chat.type = 0;
                this.Chat.origin = 0;
                this.Chat.head = window.user_name;
                this.Chat.timestamp = this.Connection.getTodayDate()
            }

            this.Connection.sendMessage(this.Chat, this.showMessage);
            this.chat_message = null
                
        },
        showMessage(message)
        {
            if(message.type == 0 )
                this.messages.push(message);
            else if(message.type == 1 && this.is_hosting === false)
            {
                this.updateCanvasImage(message);
            }
            else if(message.type === 2 && this.is_hosting === false)
            {
                this.updateCanvasBackground(message);
            }
            else if(message.type === 3 && this.is_hosting === false)
            {
                this.updateVideoPlaying(message.message);
            }
            else if(message.type === 4 && this.is_hosting === false)
            {
                this.updateVideoPlaying(message.message, true);
            }
            else if(message.type === 5 && this.is_hosting === false)
            {
                this.updateVideoPlaying(message.message, true);
            }
            else if(message.type === 6 && this.is_hosting === false)
            {
                this.video_sharing.src = null;
                this.video_sharing.visible = false;
                this.video_sharing.playing = false;
                this.video_sharing.current_time = 0
            }
            else if(message.type === 7 && this.is_hosting  === false)
            {
                // this.file_sharing
                // TO DO : reset all canvas data
                
                this.is_hosting = true;
            }
            else if(message.type === 8 && this.is_hosting  === true)
            {
                // this.file_sharing
                // TO DO : reset all canvas data
                
                alert('control has been revoked');

                this.is_hosting = false;
            }
            else if(message.type === 9 && this.is_hosting  === true)
            {
                // this.file_sharing
                // TO DO : reset all canvas data
                
                this.Access.show_request = true;
                this.giveOutControl();
            }
            else if(message.type === 10 && this.is_hosting  === false)
            {
                // this.file_sharing
                // TO DO : reset all canvas data
                
                this.Access.request_denied = true;
                this.giveOutControl();
            }
            else
            {
                console.log('uknown message type ',message);
                this.logSystem({
                    type: 1,
                    head: "System",
                    message: "Uknown message type received from "+message.head,
                    timestamp: this.Connection.getTodayDate()
                })
            }
        },
        updateVideoPlaying(message, update=false)
        {
            console.log('updating video ',message);
            if(!update)
            {
                this.video_sharing.src = message.src
                this.video_sharing.current_time = message.current_time,
                this.video_sharing.playing = message.playing;
                this.video_sharing.visible = true;
            }
            else
            {
                var remoteVideo = document.querySelector('video#remoteVideo');
                console.log('remotVideo ',remoteVideo);
                remoteVideo.currentTime = message.current_time;
                if(message.playing)
                    remoteVideo.play();
                else
                    remoteVideo.pause();
            }
            
        },
        triggerTroubleShoot()
        {
            this.troubleshoot.visible = true;
            this.checkDataConnection();//sending screen data and chat
            this.checkTwilioConnection();//video
            this.checkCanvasInformation();
        },
        checkDataConnection()
        {
            if(this.Connection.isChatOn())
            {
                this.troubleshoot.Success.push({
                    text: 'You are connected to the data channel '
                })
            }
            else
                this.troubleshoot.Errors.push({
                    text: 'You are not connected to the data channel'
                })
        },
        checkTwilioConnection()
        {
            if(this.Connection.isOnline())
            {
                this.troubleshoot.Success.push({
                    text: 'You are connected to the video channel '
                })
            }
            else
                this.troubleshoot.Errors.push({
                    text: 'You are not connected to the video channel'
                })
        },
        GiveOutAccess(accesstype=7)
        {
            if(this.Connection.isChatOn())
            {
                this.canvasUpdate({type: accesstype, head: 'system'})
                if(accesstype !== 9)
                    this.is_hosting = !this.is_hosting;
                
                this.Access.closeModal(this.Access);
            }
            else{

                this.Access.Errors.text = "Cannot give out or get access. Connection for data chennel is not set";
                this.Access.Errors.visible = true;
            }
            
        },
        AccessDenied(e)
        {
            console.log('access denied ',e);
            this.canvasUpdate({type: 10, head: 'system'})
        },
        requestControl()
        {
            this.Access.request_control = true;
            this.giveOutControl();
        },
        checkCanvasInformation()
        {},
        giveOutControl()
        {
            this.Access.visible = true;
        },
        getControlBack()
        {
            this.Access.hijack_control = true
            this.giveOutControl();
        },
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
            // this.StartConnection(data.token, 'noor_room');
        },
        StartConnection(token,room_name)
        {
            this.Connection.StartConnection(token, room_name, this.ConnectionCallBack, this.showMessage);
            
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
        updateCanvasImage(message)
        {
            var image = new window.Image();
            image.src =message.message;

            console.log('context of limite canvas ',document.querySelector('#limitCanvas'));
            var canvas =document.querySelector('#limitCanvas');
            var ctx  = canvas.getContext('2d');
            // ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.clearRect(0, 0,canvas.width, canvas.height);
            // ctx.fillStyle = this.colorPicker.current;
            // ctx.fillRect(0,0,canvas.width, canvas.height);

            image.onload =() => {
                
                ctx.drawImage(image,0,0);
                ctx.fillStyle = this.colorPicker.current;
                    ctx.fillRect(0,0,canvas.width, canvas.height);

                ctx.drawImage(image,0,0);
                
                this.closeLoader();
            }
        },
        updateCanvasBackground(message)
        {
            var color = "rgba("+this.doRgbaString(message.message._rgba)+")";
            var canvas =document.querySelector('#limitCanvas');
            var ctx  = canvas.getContext('2d');
            var current_image = canvas.toDataURL('image/png');
            // console.log('current image ',current_image);
            // ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.clearRect(0, 0,canvas.width, canvas.height);
            ctx.fillStyle = color;
            ctx.fillRect(0,0,canvas.width, canvas.height);
            var image = new window.Image();
            image.src =current_image;
            image.onload =() => {
                ctx.drawImage(image,0,0);
            }
            
            this.colorPicker.current = color;
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
                    num_pages: pages.length,
                    type:0
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
            this.info_tabs.log = index === 3;
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
            
            if(this.Connection !== null && this.is_hosting)
            {
                this.Connection.sendMessage({
                    message:this.colorPicker.current,
                    head: "System",
                    type:2,
                    timestamp:'now',
                    origin:0
                }, null)  
            }
            
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
                return this.host_type == false ? "Teacher in Control " : "School in control"
        },
        getMessageClass(origin)
        {
            if(origin)
            {
                return 'float-right';
            }
            else
                return 'float-left'
        },
        doRgbaString(color)
        {
            console.log('doing rgba sring ',color)
            if(color.indexOf('#') === 0)
                return color;
            var rgbaString = '';
            for(var i=0; i < color.length; i++)
            {
                if(i ===0)
                    rgbaString = color[i];
                else
                    rgbaString = rgbaString+','+color[i];
            }
            return rgbaString;
        }

    },
    components: {localvideo, remotevideo, customCanvas:konvacanvas, errormodal, loader,troubleshooter,control
        }
})