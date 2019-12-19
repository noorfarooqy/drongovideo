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
        }


    },
    mounted() {
        // alert('ready');
        this.getAccesstoken();
        this.Cloudinary.launchUploadWidget();
        

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
        }

    },
    components: {localvideo, remotevideo, customCanvas:konvacanvas, errormodal, loader}
})