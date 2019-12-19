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
                            <li class="nav-item active">
                                <a class="nav-link" href="#" @click.prevent="writeText">
                                    <img src="/editor_icons/font.svg" alt="Add Text" title="Add text" height="30px"
                                        style="border:thin solid gray; padding:3px" />
                                </a>
                            </li>
                            <li class="nav-item active">
                                <a class="nav-link" href="#">
                                    <img src="/editor_icons/bold.svg" alt="Bold text" title="Bold text" height="30px"
                                        style="border:thin solid gray; padding:3px" />
                                </a>
                            </li>
                            <li class="nav-item active">
                                <a class="nav-link" href="#">
                                    <img src="/editor_icons/italic.svg" alt="Italic Text" title="Italic text "
                                        height="30px" style="border:thin solid gray; padding:3px" />
                                </a>
                            </li>
                            <li class="nav-item active">
                                <a class="nav-link" href="#">
                                    <img src="/editor_icons/underline.svg" alt="Underline" title="Underline text"
                                        height="30px" style="border:thin solid gray; padding:3px" />
                                </a>
                            </li>
                            <li class="nav-item active">
                                <a class="nav-link" href="#">
                                    <img src="/editor_icons/full-moon.svg" alt="Circle" title="Circle" height="30px"
                                        style="border:thin solid gray; padding:3px" />
                                </a>
                            </li>
                            <li class="nav-item active">
                                <a class="nav-link" href="#" @click.prevent="DrawRectangle">
                                    <img src="/editor_icons/ratio.svg" alt="Rectangle" title="Ractangle" height="30px"
                                        style="border:thin solid gray; padding:3px" />
                                </a>
                            </li>
                            <li class="nav-item active">
                                <a class="nav-link" href="#" @click.prevent="openImageUploader()">
                                    <img src="/editor_icons/photo-camera.svg" alt="Photo" height="30px"
                                        style="border:thin solid gray; padding:3px" title="Photo camera" />
                                </a>
                            </li>
                            <li class="nav-item active">
                                <a class="nav-link" href="#" @click.prevent="openImageUploader(false)">
                                    <img src="/editor_icons/video-player.svg" alt="Video" height="30px"
                                        style="border:thin solid gray; padding:3px" title="Video " />
                                </a>
                            </li>
                            <li class="nav-item active">
                                <a class="nav-link" href="#">
                                    <img src="/editor_icons/eraser.svg" alt="Erasor" height="30px"
                                        style="border:thin solid gray; padding:3px" title="Eraser" />
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
                    <video :src="videoSharing.src" class="videoSharing" style="height: inherit;width: inherit;"
                        controls></video>
                    <button class="btn btn-danger" @click.prevent="closeVideoSharing"
                        style="position: absolute;font-size: 16px;top: 100px;right: 25px;cursor: pointer;">Close
                        video</button>
                </div>
                <v-stage :config="configKonva" v-show="Draw.visible" style="border:thin solid green; height:700px"
                    ref="stage" @mousedown="listenForAfterMouseDownEvent" @mousemove="listenForAfterMouseMoveEvent"
                    @mouseup="listenForAfterMouseUpEvent">
                    <v-layer style="border:thin solid red; margin:10px" ref="mainLayer">

                        <v-shapes v-bind="all" v-on:image-transformer="doImageTranformer"></v-shapes>

                        <v-transformer ref="vtransfomer" />


                    </v-layer>

                </v-stage>
            </div>
        </div>

    </div>


</template>
<script>
    import shapes from './shapes.vue';
    import errormodal from "../vuecomponents/errormodal.vue";
    import Error from "../classes/Error";
    import fileviewer from "./fileviewer.vue";
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


            };
        },
        created() {

        },
        mounted() {
            this.configKonva.width = this.getClientWidth();

        },
        methods: {
            getClientWidth() {
                return this.$refs.cardHW.clientWidth;
            },
            getClientHeight() {
                return this.$refs.cardHW.clientHeight;
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
            },
            listenForAfterMouseUpEvent(e) {
                var pos = this.$refs.stage.getStage().getPointerPosition();
            },




            //menu triggers

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


            //file functions
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
                var self =this;
                image.onload = () => {

                    this.all.file_sharing = {};
                    this.all.file_sharing.width = this.getClientWidth();
                    this.all.file_sharing.height = this.getClientHeight();
                    this.all.file_sharing.src = image;
                    this.all.file_sharing.url = image.src,
                    self.isLoading = false;  
                }
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
            }


        },
        components: {
            vShapes: shapes,
            errormodal,
            vFileViewer: fileviewer
        },
        props: ["file_sharing"],
        watch: {
            file_sharing: function () {
                console.log('its somewhere after me');
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
