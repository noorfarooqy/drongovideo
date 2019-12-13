<!DOCTYPE html>

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title> Video Event </title>
    <link rel="stylesheet" href="/css/bootstrap.min.css">
    <link rel="stylesheet" href="/css/custom.css">
</head>

<body>
    <div class="container-fluid" id="App">
        <div class="row">
            <div class="col-md-9 col-lg-9">
                <div class="row">
                    <div class="card" style="width:100%; min-height: 100vh">
                        <div class="card-header">
                            <nav class="navbar navbar-expand-lg navbar-light bg-light">
                                <a class="navbar-brand" href="#">
                                    <img src="https://drongovideo.local/images/nlogo.png" class="d-inline-block align-top" alt=""
                                        style="height: 5vh;">
                                </a>
                                <button class="navbar-toggler" type="button" data-toggle="collapse"
                                    data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false"
                                    aria-label="Toggle navigation">
                                    <span class="navbar-toggler-icon"></span>
                                </button>
                                <div class="collapse navbar-collapse" id="navbarNav">
                                    <ul class="navbar-nav">
                                        <li class="nav-item active">
                                            <a class="nav-link" href="#">
                                            </a>
                                        </li>
                                        <li class="nav-item">
                                            <a class="nav-link" href="#">
                                                <img src="/images/upload_icon.png" alt="" style="height:15px"> Upload
                                                file
                                            </a>
                                        </li>
                                        <li class="nav-item">
                                            <a class="nav-link" href="#" @click.prevent="getBackgroundColor()">
                                                <img src="/images/color_icon.png" alt="" style="height:25px"> Background
                                                color
                                            </a>
                                        </li>
                                        <li class="nav-item">
                                            <a class="nav-link" href="#">
                                                <img src="/images/troubleshoot_icon.jpg" alt="" style="height:25px">
                                                Troubleshoot
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </nav>
                        </div>

                        <div class="card-body" style="min-height:50px">
                            <span id="colorPickerContainer"></span>
                            <div class="file_container">
                                {{-- <pdfjs></pdfjs> --}}
                                <custom-canvas  :style="setBackgroundColor()"></custom-canvas>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-3 col-lg-3">
                <div class="row">
                    <div class="card" style="width:100%">
                        <div class="card-header">
                            <h5 class="title">Connection status: </h5>
                        </div>
                        <i class="card-body">

                            <img class="card-image remote-video" v-if="remote_video.video_src === null"
                                :src="default_video.video_src" alt="Offline video image" />


                            <img class="card-image local-video" v-if="default_video.visible"
                                :src="default_video.video_src" alt="Offline video image" />

                            <div class="card-content" >
                                <localvideo v-if="local_video.visible" v-bind="local_video"></localvideo>
                                <remotevideo v-if="remote_video.visible" v-bind="remote_video"></remotevideo>
                            </div>
                    </div>
                    <div class="card" style="width:100%">
                        <ul class="nav nav-tabs">
                            <li class="active nav-item" >
                                <a data-toggle="tab" class="nav-link" :class="getActiveClass(0)" href="#schoolInfo" 
                                @click.prevent="getActiveTab(0)">School Info</a>
                            </li>
                            <li class=" nav-item">
                                <a data-toggle="tab" class="nav-link" :class="getActiveClass(1)" href="#employerInfo" 
                                @click.prevent="getActiveTab(1)">Empoloyee info</a>
                            </li>
                            <li class=" nav-item">
                                <a data-toggle="tab" class="nav-link" :class="getActiveClass(2)" href="#chatInfo" 
                                @click.prevent="getActiveTab(2)">Chat</a>
                            </li>
                        </ul>

                        <div class="tab-content">
                            <div id="schoolInfo" class="tab-pane " :class="getActiveClass(0)">
                                This is the school ifno
                            </div>
                            <div id="employerInfo" class="tab-pane " :class="getActiveClass(1)">
                                This is the employer ifno
                            </div>
                            <div id="chatInfo" class="tab-pane " :class="getActiveClass(2)">
                                This is the chat ifno
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    </div>
</body>
{{-- <script src="/js/cloudinary/widgets_all.js" type="text/javascript"></script> --}}

<script src="/fabric/fabric.js"></script>
<script src="/js/mainvue.js"></script>
<script src="/js/jquery.min.js"></script>
<script src="/js/bootstrap.min.js"></script>


</html>
