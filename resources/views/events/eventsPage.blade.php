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
        <loader v-if="loading.visible" v-bind="loading"
        v-on:close-loader-modal="closeLoader()"></loader>
        <errormodal v-if="Error.visible" v-bind="Error"
        v-on:close-error-modal="Error.resetErrorModal()"></errormodal>
        <div class="row">
            <div class="col-md-9 col-lg-9 col-sm-12 col-xs-12">
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
                                        <li class="nav-item dropdown">
                                            <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                <img src="/images/upload_icon.png" alt="" style="height:15px">  Upload file
                                            </a>
                                            <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                                              <a class="dropdown-item" href="#" @click.prevent="$refs.pdfUploader.click()">
                                                  Pdf file

                                              </a>
                                              <a class="dropdown-item" href="#" @click.prevent="$refs.pptUploader.click()">
                                                  Powerpoint
                                                </a>
                                              <div class="dropdown-divider"></div>
                                            </div>
                                          </li>
                                        <li class="nav-item">
                                            <a class="nav-link" href="#" @click.prevent="getBackgroundColor()">
                                                <img src="/images/color_icon.png" alt="" style="height:25px"> Background
                                                color
                                            </a>
                                        </li>
                                        <li class="nav-item">
                                            <a class="nav-link" href="#" @click.prevent="triggerFileSharing()">
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
                                <custom-canvas  :style="setBackgroundColor()" v-bind="{
                                    file_sharing: file_sharing.image,
                                    bg_color: colorPicker.current
                                }"></custom-canvas>
                            </div>
                        </div>
                        <div style="display:none">
                            <input type="file" @change.prevent="uploadMainfiles($event, true)" ref="pdfUploader"/>
                            <input type="file" @change.prevent="uploadMainfiles($event, false)" ref="pptUploader"/>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-3 col-lg-3 col-sm-12 col-xs-12">
                <div class="row">
                    <div class="card" style="width:100%">
                        <div class="card-header">
                            <h5 class="title">Connection status: </h5>
                        </div>
                        <div class="card-body all-tracks" style="position:relative; padding:0">
                            
                            <localvideo v-if="local_video.visible" v-bind="local_video"></localvideo>
                            <video class="card-image local-video" v-else
                                :src="default_video.video_src" alt="Offline video image" ></video>
                            

                            <remotevideo v-if="remote_video !== null && remote_video.visible" v-bind="remote_video"></remotevideo>
                            <video class="card-image remote-video" v-else
                            :src="default_video.video_src" alt="Offline video image"></video>
                             
                            
                             
                            
                            
                        </div>
                        <div class="">
                                <ul class="nav nav-tabs">
                                    <li class="active nav-item" >
                                        <a data-toggle="tab" class="nav-link" :class="" href="#schoolInfo" 
                                        @click.prevent="localAuidoToggle()">
                                            <img src="/images/microphone_muted.svg" height="30px" alt="" 
                                                v-if="local_video.muted">
                                            <img src="/images/microphone.svg" height="30px" alt="" class="remote_audio" v-else>
                                        </a>
                                    </li>
                                    <li class="active nav-item" >
                                        <a data-toggle="tab" class="nav-link" :class="" href="#schoolInfo" 
                                            @click.prevent="remoteAuidoToggle()">
                                            <img src="/images/audio_off.svg" height="30px" alt="" 
                                                v-if="remote_video.muted">
                                            <img src="/images/audio_on.svg" height="30px" alt="" class="remote_audio" v-else>
                                            
                                        </a>
                                    </li>
                                </ul>
                        </div>
                    </div>
                    <div class="card" style="width:100%">
                        <ul class="nav nav-tabs">
                            <li class="active nav-item" >
                                <a data-toggle="tab" class="nav-link" :class="getActiveClass(0)" href="#schoolInfo" 
                                @click.prevent="getActiveTab(0)">School</a>
                            </li>
                            <li class=" nav-item">
                                <a data-toggle="tab" class="nav-link" :class="getActiveClass(1)" href="#employerInfo" 
                                @click.prevent="getActiveTab(1)">Employee</a>
                            </li>
                            <li class=" nav-item">
                                <a data-toggle="tab" class="nav-link" :class="getActiveClass(2)" href="#chatInfo" 
                                @click.prevent="getActiveTab(2)">Chat</a>
                            </li>
                            <li class=" nav-item">
                                <a data-toggle="tab" class="nav-link" :class="getActiveClass(2)" href="#systemLog" 
                                @click.prevent="getActiveTab(3)">Log</a>
                            </li>
                        </ul>

                    <div class="tab-content" >
                            <div id="schoolInfo" class="tab-pane " :class="getActiveClass(0)">
                                @if (isset($school_info) )
                                <div class="card">
                                    <div class="card-header">
                                       
                                        {{$school_info->name}}
                                    </div>
                                    <div class="card-image">
                                        <img src="{{$school_info['employer_img']}}" style="width: 100%;" alt="">
                                    </div>
                                    <div class="card-body"></div>
                                </div>
                                @endif
                            </div>
                            <div id="employerInfo" class="tab-pane " :class="getActiveClass(1)">
                                @if (isset($teacher_info) )
                                <div class="card">
                                    <div class="card-header">
                                        
                                        {{$teacher_info->full_name}}
                                    </div>
                                    <div class="card-image">
                                        <img src="{{$teacher_info->head_photo}}" style="width: 100%;"  alt="">
                                    </div>
                                    <div class="card-body"></div>
                                </div>
                                @endif
                            </div>
                            <div id="chatInfo" class="tab-pane " :class="getActiveClass(2)">
                                <div class="card">
                                    <div class="card-header"></div>
                                    <div class="card-body" style="height: 350px;overflow-y: auto;">
                                        
                                        
                                        <div class="row mt-2 float-left">
                                                <div class="sent-message card" style="background-color: rgb(223, 210, 199);">
                                                    <div class="card-header" style="background-color: rgb(146, 132, 107);height:40px">
                                                        <strong>Noor</strong> 
                                                        <span class="hint" 
                                                        style="position: absolute;right: 15px;
                                                        font-size: 15px;color: #4d4848;">12:14pm</span>
                                                    </div>
                                                    <div class="card-body">
                                                        Are you crazy. who said that?
                                                    </div>
                                                </div>
                                        </div>
                                        <div class="row mt-3 float-right">
                                                <div class="sent-message card " 
                                                style="background-color: #c7d3df;">
                                                        <div class="card-header" style="background-color: #85a2bc; height:40px">
                                                            <span class="hint"style="font-size: 15px;color: #4d4848;">12:14pm</span>
                                                            <strong style="position: absolute;right: 15px;">Abdi</strong> 
                                                            
                                                        </div>
                                                        <div class="card-body">
                                                            Are you crazy. who said that?
                                                        </div>
                                                    </div>
                                        </div>
                                        

                                        

                                    </div>
                                    <div class="card-footer">
                                        <div class="row">
                                                <input type="text" placeholder="Enter text" class="input" 
                                                class="col-md-7 col-lg-7"/>
                                                <button class="btn btn-primary col-md-4 col-lg-4" >Send</button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div id="systemLog" class="tab-pane " :class="getActiveClass(1)">
                                <ul style="list-style:none; height:200px; overflow-y:scroll" class="row"
                                >
                                    <li v-for="(Log, logKey) in SystemLog" :key="logKey" style="height: fit-content;"
                                    :class="getTypeClass(Log.type)" class="col-md-11 col-lg-11">
                                        <strong>@{{Log.head}}:</strong>
                                        <span>@{{Log.message}}</span>
                                        <div class="date" style="color:#85a2bc">@{{Log.timestamp}}</div>
                                    </li>
                                </ul>
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

<script>
        @if(isset($teacher_info) && $isteacher === true)
           
            console.log('is teacher ',"{{$isteacher}}");
            window.user_name = "{{$teacher_info->full_name}}"
            window.user_id = "{{$teacher_info->user_id}}"
        @elseif(isset($school_info) && !$isteacher)
            console.log('is schoool ',"{{$isteacher}}");
    
            window.user_name = "{{$school_info->name}}";
            window.user_id = "{{$school_info->id}}";
        @endif
    </script>
<script src="/fabric/fabric.js"></script>
<script src="/js/mainvue.js"></script>
<script src="/js/jquery.min.js"></script>
<script src="/js/bootstrap.min.js"></script>


</html>
