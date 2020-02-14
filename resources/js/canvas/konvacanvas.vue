<template>
    <div>
        <errormodal v-bind="Error" v-if="Error.visible" v-on:close-error-modal="disMissErrorModal"></errormodal>
        <div class="card">

            <div class="card-header">
                Sharing File
            </div>
            <div class="card-header">
                <nav class="navbar navbar-expand-lg navbar-light bg-light">
                    <a class="navbar-brand" href="#"> </a>
                    <button class="navbar-toggler" type="button" data-toggle="collapse"
                        data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                        aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>

                    <div class="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul class="navbar-nav mr-auto">
                            <li class="nav-item " :class="{'not-allowed': !is_hosting}">
                                <a class="nav-link " :class="{'disabled': !is_hosting}"  href="#" @click.prevent="writeText" >
                                    <img src="/editor_icons/font.svg" alt="Add Text" title="Add text" height="30px"
                                        style="border:thin solid gray; padding:3px" />
                                </a>
                            </li>
                            <li class="nav-item active" :class="{'not-allowed': !is_hosting}">
                                <a class="nav-link " :class="{'disabled': !is_hosting}"  href="#" @click.prevent="textStyle(1)">
                                    <img src="/editor_icons/bold.svg" alt="Bold text" title="Bold text" height="30px"
                                        style="border:thin solid gray; padding:3px" />
                                </a>
                            </li>
                            <li class="nav-item " :class="{'not-allowed': !is_hosting}">
                                <a class="nav-link " :class="{'disabled': !is_hosting}"  href="#" @click.prevent="textStyle(2)">
                                    <img src="/editor_icons/italic.svg" alt="Italic Text" title="Italic text "
                                        height="30px" style="border:thin solid gray; padding:3px" />
                                </a>
                            </li>
                            <li class="nav-item " :class="{'not-allowed': !is_hosting}">
                                <a class="nav-link " :class="{'disabled': !is_hosting}"  href="#" @click.prevent="textStyle(3)">
                                    <img src="/editor_icons/underline.svg" alt="Underline" title="Underline text"
                                        height="30px" style="border:thin solid gray; padding:3px" />
                                </a>
                            </li>
                            <li class="nav-item " :class="{'not-allowed': !is_hosting}">
                                <a class="nav-link " :class="{'disabled': !is_hosting}"  href="#" @click.prevent="DrawCircle">
                                    <img src="/editor_icons/full-moon.svg" alt="Circle" title="Circle" height="30px"
                                        style="border:thin solid gray; padding:3px" />
                                </a>
                            </li>
                            <li class="nav-item " :class="{'not-allowed': !is_hosting}">
                                <a class="nav-link " :class="{'disabled': !is_hosting}"  href="#" @click.prevent="DrawRectangle">
                                    <img src="/editor_icons/ratio.svg" alt="Rectangle" title="Ractangle" height="30px"
                                        style="border:thin solid gray; padding:3px" />
                                </a>
                            </li>
                            <li class="nav-item " :class="{'not-allowed': !is_hosting}">
                                <a class="nav-link " :class="{'disabled': !is_hosting}"  href="#" @click.prevent="openImageUploader()">
                                    <img src="/editor_icons/photo-camera.svg" alt="Photo" height="30px"
                                        style="border:thin solid gray; padding:3px" title="Photo camera" />
                                </a>
                            </li>
                            <li class="nav-item " :class="{'not-allowed': !is_hosting}">
                                <a class="nav-link " :class="{'disabled': !is_hosting}"  href="#" @click.prevent="openImageUploader(false)">
                                    <img src="/editor_icons/video-player.svg" alt="Video" height="30px"
                                        style="border:thin solid gray; padding:3px" title="Video " />
                                </a>
                            </li>
                            <li class="nav-item " :class="{'not-allowed': !is_hosting}">
                                <a class="nav-link " :class="{'disabled': !is_hosting}"  href="#" @click.prevent="KonvasConfig.color_picker = true">
                                    <img src="/editor_icons/picker.png" alt="Video" height="30px"
                                        style="border:thin solid gray; padding:3px" title="Video " />
                                </a>
                            </li>
                            <li class="nav-item " :class="{'not-allowed': !is_hosting}">
                                <a class="nav-link " :class="{'disabled': !is_hosting}"  href="#" @click.prevent="KonvasConfig.draw_eraser = true">
                                    <img src="/editor_icons/eraser.svg" alt="Erasor" height="30px"
                                        style="border:thin solid gray; padding:3px" title="Erase selected item" />
                                </a>
                            </li>
                        </ul>
                        <ul class="nav navbar-nav navbar-right" v-if="this.shared_file">
                            <nav aria-label="Page navigation example">
                                <ul class="pagination justify-content-end">
                                    <li class="page-item " :class="{'disabled':this.shared_file.current_page <= 0 || isLoading}">
                                        <a class="page-link" href="#" tabindex="-1" @click.prevent="previousFilePage()"
                                            :disabled="this.shared_file.current_page <= 0 || isLoading">
                                            Previous
                                        </a>
                                    </li>
                                    <li class="page-item"><a class="page-link" href="#">
                                        {{this.shared_file.current_page+1}} / {{this.shared_file.num_pages}}
                                    </a></li>
                                    <li class="page-item" 
                                    :class="{'disabled':this.shared_file.current_page+1 === this.shared_file.num_pages || isLoading}">
                                        <a class="page-link" href="#" @click.prevent="nextFilePage()"
                                            :disabled="this.shared_file.current_page+1 === this.shared_file.num_pages || isLoading">
                                            Next
                                        </a>
                                    </li>
                                </ul>
                            </nav>
                        </ul>
                    </div>
                </nav>

            </div>
            <div class="card-body" ref="cardHW" style="height:100%; width:100%">
                <div style="height: inherit;width: inherit;" v-if="videoSharing.visible">
                    <video :src="videoSharing.src" class="videoSharing" style="height: inherit;width: inherit;" v-if="is_hosting"
                        controls @canplay="updatePaused($event,1)" @playing="updatePaused($event,2)" @pause="updatePaused($event,3)"></video>
                    <video :src="videoSharing.src" class="videoSharing" style="height: inherit;width: inherit;" v-else
                        controls ref="videoRemote" id="remoteVideo"></video>
                    <button class="btn btn-danger" @click.prevent="closeVideoSharing"
                        style="position: absolute;font-size: 16px;top: 100px;right: 25px;cursor: pointer;">Close
                        video</button>
                </div>
                
                <div class="" v-if="is_hosting">
                    <!-- <v-stage :config="configKonva" v-show="Draw.visible" style="border:thin solid green; height:700px"
                    :style="getBackgroundColor()"
                    ref="stage" @mousedown="listenForAfterMouseDownEvent" @mousemove="listenForAfterMouseMoveEvent"
                    @mouseup="listenForAfterMouseUpEvent">
                    <v-layer style="border:thin solid red; margin:10px" ref="mainLayer">

                        <v-shapes v-bind="{
                            imageConfig: all.imageConfig,Draw: Draw,
                            text_shape: all.text_shape, file_sharing: all.file_sharing
                            }" 
                            v-on:image-transformer="doImageTranformer" ></v-shapes>

                        <v-transformer ref="vtransfomer" />


                    </v-layer>

                </v-stage> -->
                <!-- <textcomponent v-bind="{out_configKonva: configKonva}"></textcomponent> -->
                <vue-konvas v-bind="KonvasConfig" v-show="Draw.visible"  :style="getBackgroundColor()"
                    v-on:close-color-picker="KonvasConfig.color_picker = false"
                    v-on:completed-text-draw="KonvasConfig.draw_text = false"
                    v-on:completed-rect-draw="KonvasConfig.draw_rect = false"
                    v-on:completed-circle-draw="KonvasConfig.draw_circle = false"
                    v-on:completed-eraser-draw="KonvasConfig.draw_eraser = false"
                    v-on:completed-sharing-file="KonvasConfig.file_sharing_status = false"
                    v-on:completed-image-draw="resetImageDraw"
                    v-on:reset-text-style="resetTextStyle"> </vue-konvas>
                </div>
                <div v-else>
                    <canvas  id="limitCanvas" :width="configKonva.width-40" :key="'k'+1"
                    :height="configKonva.height" style="border:thin solid green" ></canvas>
                </div>
                
            </div>
        </div>

    </div>


</template>
<script>
    import shapes from './shapes.vue';
    import errormodal from "../vuecomponents/errormodal.vue";
    import Error from "../classes/Error";
    import fileviewer from "./fileviewer.vue";
    import Hasher from "object-hash"
    import textcomponent  from "../canvas/textcomponent.vue"

    import VueKonvas from "../Konvas/components/Konvas.vue"; 
    export default {
        data() {
            return {
                Error: new Error(),
                configKonva: {
                    width: 500,
                    height: 700
                },
                Draw: {
                    isdrawing: false,
                    pen: null,
                    visible: true,
                },
                all: {
                    imageConfig: null,
                    transformerStatus: false,
                    file_sharing: null,
                    text_shape: null,
                },
                shared_file:null,//local file sharing copy for paginations purpose
                uploader: {
                    src: null,
                    focus: false,
                },
                videoSharing: {
                    src: null,
                    visible: null,
                    current_time: null,
                    playing: false,
                },
                transformerStatus: false,
                selectedImageName: '',
                isLoading: false,
                previous_hash : null,
                previous_color:null,
                KonvasConfig: {
                    draw_circle : false,
                    draw_rect: false,
                    draw_text: false,
                    draw_image:{
                        visible: false,
                        src: null,
                        is_normal_image: true,//images that are not from pdf file or ppt file are normal images
                        page: 0
                    },
                    image_status : false,
                    file_sharing_status: false,
                    color_picker : false,
                    text_bold: false,
                    text_italic:false,
                    text_underline: false,
                    draw_eraser: false,
                    file_sharing: null,
                }


            };
        },
        created() {
            
        },
        mounted() {
            this.configKonva.width = this.getClientWidth();
            this.videoSharing = this.video_sharing;

            var remoteVideo = this.$refs.remoteVideo;
            console.log('video ',remoteVideo);
            this.KonvasConfig.file_sharing = this.file_sharing;
        },
        methods: {

            getClientWidth() {
                return this.$refs.cardHW.clientWidth;
            },
            getClientHeight() {
                return this.$refs.cardHW.clientHeight;
            },
            stageUrl()
            {
                if(!this.is_hosting)
                    return;
                var stage = this.$refs.stage.getStage();
                var uri = stage.toDataURL();
                var hash = Hasher({'src':uri })
                if(hash === this.previous_hash)
                {
                    console.log('previous hash detected ',hash, ' --- ',this.previous_hash);
                    return;
                }
                this.previous_hash = hash;
                console.log('new hash ',this.previous_hash);
                if(this.messageSender)
                {
                        var sender = this.messageSender;
                        
                        sender({
                            message:uri,
                            head: "System",
                            type:1,
                            timestamp:'now',
                            origin:0
                        });
                        
                }
                else
                    console.log('sender is not set ');
                
                
            },
            listenForAfterMouseDownEvent(e) {
                var pos = this.$refs.stage.getStage().getPointerPosition();
                // console.log('listening for mouse down for event ',e)
                if (e.target === e.target.getStage()) {
                    this.selectedShapeName = '';
                    var tf = this.$refs.vtransfomer.getStage();
                    console.log('shoud detach here');
                    tf.detach();
                    tf.getLayer().batchDraw();
                    return;
                }
                const clickedOnTransformer = e.target.getParent().className === 'Transformer';
                if (clickedOnTransformer) {
                    return;
                }
                // const images = this.all..find(r => r.name === name);
                // if (rect) {
                //     this.selectedShapeName = name;
                // } else {
                //     this.selectedShapeName = '';
                // }


            },
            listenForAfterMouseMoveEvent(e) {
                var pos = this.$refs.stage.getStage().getPointerPosition();
                this.stageUrl();
            },
            listenForAfterMouseUpEvent(e) {
                var pos = this.$refs.stage.getStage().getPointerPosition();
            },




            //menu triggers
            writeText()
            {
                this.all.text_shape = {
                        x: 100,
                        y: 100,
                        type: 1,
                        text: 'Add text',
                        fontSize: 16,
                        layer: this.$refs.mainLayer,
                        stage: this.$refs.stage,
                    }
                this.KonvasConfig.draw_text = true;
                this.Draw.isdrawing = true;
                this.Draw.pen = 2
            },
            textStyle(type)
            {
                if(type === 1)
                {
                    this.KonvasConfig.text_bold =true
                }
                else if(type === 2)
                    this.KonvasConfig.text_italic = true
                else if(type === 3)
                    this.KonvasConfig.text_underline = true
            },
            resetTextStyle()
            {
                this.KonvasConfig.text_bold = this.KonvasConfig.text_italic = false;
            },
            DrawRectangle()
            {
                this.KonvasConfig.draw_rect = true;
            },
            DrawCircle()
            {
                this.KonvasConfig.draw_circle = true;
            },

            openImageUploader(image = true) {
                var uploader = document.createElement('input');
                uploader.setAttribute('type', 'file');
                var self = this;
                uploader.addEventListener('change', function (file) {
                    console.log('we have changed ', file)
                    var input = file.target;
                    var type = input.files[0].type;
                    if (image) {
                        if (!self.isImage(type)) {
                            self.Error.error_text =
                                "The file you uploaded is not an image. Please ensure its an image",
                                self.Error.visible = true;
                            return;
                        }
                    } else {
                        if (!self.isVideo(type)) {
                            self.Error.error_text =
                                "The file you uploaded is not a video. Please ensure its a video",
                                self.Error.visible = true;
                            return;
                        }


                    }
                    self.uploader.focus = true;

                    self.renderFile(input, type);
                    // this.uploader.src = 
                })
                uploader.click();
            },
            setImageUploaded() {
                var image = new window.Image();
                image.src = this.uploader.src;
                image.onload = () => {
                    // console.log('image loaded ',image)
                    this.all.imageConfig = {
                        x: 100,
                        y: 100,
                        image: image,
                        type: 0,
                        layer: this.$refs.mainLayer,
                        stage: this.$refs.stage,
                    }
                    this.KonvasConfig.draw_image.src = image;
                    this.KonvasConfig.draw_image.is_normal_image = false;

                    this.KonvasConfig.draw_image.visible = true
                    this.KonvasConfig.image_status = true
                }
                this.uploader = {
                    focus: false,
                    src: null
                }
            },
            setVideoUploaded() {

                this.videoSharing.src = this.uploader.src;
                this.videoSharing.visible = true;
                this.videoSharing.current_time = 0;
                this.uploader = {
                    focus: false,
                    src: null
                }
                this.Draw.visible = false;
                console.log('new hash ',this.previous_hash);
                if(this.messageSender)
                {
                        var sender = this.messageSender;
                        var self = this;
                        sender({
                            message: this.videoSharing,
                            head: "System",
                            type:3,
                            timestamp:'now',
                            origin:0
                        });
                        
                }
                else
                    console.log('sender is not set ');

            },
            renderFile(input, type) {
                var reader = new FileReader();
                var self = this;
                reader.onload = function (e) {
                    console.log('reader ready ', e)
                    self.uploader.src = e.target.result;
                    if (self.isVideo(type)) {
                        self.setVideoUploaded();
                    } else {
                        self.setImageUploaded();
                    }
                    ``
                }
                reader.onerror = function (error) {
                    self.Error.error_text = error;
                    self.Error.visible = true;
                }
                reader.readAsDataURL(input.files[0]);
            },
            updateTransformer(e) {
                const transformerNode = this.$refs.vtransfomer.getStage();
                const stage = transformerNode.getStage();

                const {
                    selectedImageName
                } = this;
                console.log('selected iamge name ', selectedImageName);
                const selectedNode = stage.findOne('.' + selectedImageName);
                console.log('selected node ', selectedNode);
                if (selectedNode === transformerNode)
                    return; //don't do anything
                if (selectedNode) {
                    transformerNode.attachTo(selectedNode);
                } else
                    transformerNode.detach(); //detach thenode 
                transformerNode.getLayer().batchDraw();
            },
            doImageTranformer(e) {
                this.selectedImageName = e.target.name();
                this.updateTransformer(e);
            },

            updatePaused(event, type)
            {
                console.log('event type ',type,' event ',event,)

                if(type === 1)
                {
                    var message = this.videoSharing;
                    message.playing = false;
                    message.src = null;
                    message.current_time = event.srcElement.currentTime
                    this.sendMessage(message,4);
                }
                if(type === 2)
                {
                    var message = this.videoSharing;
                    message.playing = true;
                    message.src = null;
                    message.current_time = event.srcElement.currentTime
                    this.sendMessage(message,4);
                }
                else if(type === 3)
                {
                    var message = this.videoSharing;
                    message.playing = false;
                    message.src = null;
                    message.current_time = event.srcElement.currentTime
                    this.sendMessage(message,5);
                }

                
            },
            sendMessage(message, type)
            {
                if(this.messageSender)
                {
                        var sender = this.messageSender;
                        var self = this;
                        sender({
                            message: message,
                            head: "System",
                            type:type,
                            timestamp:'now',
                            origin:0
                        });
                        
                }
                else
                    console.log('sender is not set ');
            },
            //file functions
            resetImageDraw()
            {
                this.KonvasConfig.draw_image.visible = false;
                this.KonvasConfig.draw_image.src = null;
                this.KonvasConfig.draw_image.is_normal_image =  true
            },
            previousFilePage()
            {

                this.isLoading = true;
                if(this.shared_file === null)
                {
                    console.log(' file sharing is not set');
                    this.isLoading = false;  
                    return;
                }
                else if(this.shared_file.current_page <= 0)
                {
                    console.log('reached first page ');
                    this.isLoading = false;  
                    return;
                }
                this.shared_file.current_page -=1;
                var image = new window.Image();
                image.src = this.file_sharing.pages[this.shared_file.current_page];
                var self =this;
                image.onload = () => {

                    this.all.file_sharing = {};
                    this.all.file_sharing.width = this.getClientWidth();
                    this.all.file_sharing.height = this.getClientHeight();
                    this.all.file_sharing.src = image,
                    this.all.file_sharing.url = image.src,
                    self.isLoading = false;  
                }
                this.stageUrl();
                
            },
            nextFilePage()
            {
                
                this.isLoading = true;
                if(this.shared_file === null)
                {
                    console.log(' file sharing is not set');
                    this.isLoading = false;  
                    return;
                }
                else if(this.shared_file.current_page+1 >= this.shared_file.num_pages)
                {
                    console.log('reached final page ');
                    this.isLoading = false;  
                    return;
                }
                this.shared_file.current_page +=1;
                var image = new window.Image();
                image.src = this.file_sharing.pages[this.shared_file.current_page];
                console.log('next image ',image)
                var self =this;
                this.KonvasConfig.draw_image = null;
                this.KonvasConfig.draw_image = {
                    src: image,
                    is_normal_image : false,
                    visible: true,
                    page: this.shared_file.current_page
                };
                this.KonvasConfig.file_sharing_status = true;
                image.onload = () => {
                    
                    // this.KonvasConfig.draw_image.src = image;
                    this.all.file_sharing = {};
                    this.all.file_sharing.width = this.getClientWidth();
                    this.all.file_sharing.height = this.getClientHeight();
                    this.all.file_sharing.src = image;
                    this.all.file_sharing.url = image.src,
                    self.isLoading = false;  
                }

                    // ctx.drawImage(image,0,0);
            },

            //modals
            disMissErrorModal() {
                this.Error = new Error();
            },
            isImage(type) {
                switch (type) {
                    case 'image/jpeg':
                        return true;
                    case 'image/png':
                        return true;
                    case 'image/jpg':
                        return true;
                    default:
                        return false;
                }
            },
            isVideo(type) {
                switch (type) {
                    case 'video/mp4':
                        return true;
                    case 'video/webm':
                        return true;
                    case 'video/mpeg4':
                        return true;
                    default:
                        return false;
                }
            },
            closeVideoSharing() {
                this.resetVideoSharing();
                this.Draw.visible = true;
                this.sendMessage ( {
                    target:'video'
                },6)
            },
            trunsFormer(status) {
                this.transformerStatus = status;
                this.all.transformerStatus = status;
            },
            resetVideoSharing() {
                this.videoSharing = {
                    src: null,
                    visible: null,
                    current_time: null,
                    playing: false,
                }
            },
            getBackgroundColor()
            {
                // if(this.previous_color !== null && this.previous_color.rgbaString === this.bg_color.rgbaString)
                //     return;
                if(this.bg_color !== null)
                {
                    // this.previous_color = this.bg_color;
                    // if(this.messageSender && this.is_hosting === true)
                    // {
                    //     var sender = this.messageSender;
                        
                    //     sender({
                    //         message:this.bg_color,
                    //         head: "System",
                    //         type:2,
                    //         timestamp:'now',
                    //         origin:0
                    //     });
                            
                    // }
                //     else
                //         console.log('cant send coor update ');
                    return 'background-color:'+this.bg_color.rgbaString;
                }    
            }


        },
        components: {
            vShapes: shapes,
            errormodal,
            vFileViewer: fileviewer,
            textcomponent,
            VueKonvas
        },
        props: ["file_sharing", "bg_color", 'messageSender','is_hosting', 'video_sharing'],
        watch: {
            video_sharing: function(new_value){
                console.log('created video ',new_value)
                this.videoSharing = new_value;
            },
            file_sharing: function () {
                console.log('its somewhere after me');
                this.KonvasConfig.file_sharing = this.file_sharing;

                this.shared_file =this.file_sharing;
                this.all.file_sharing = {};
                this.all.file_sharing.width = this.getClientWidth();
                this.all.file_sharing.height = this.getClientHeight();
                this.all.file_sharing.src = this.file_sharing.image;
                this.all.file_sharing.url = this.file_sharing.image.src;
                if (this.all.file_sharing.visible) {
                    this.resetVideoSharing();

                }
            }
        }

    }

</script>
<style >
.not-allowed {
    cursor: not-allowed;
}
</style>