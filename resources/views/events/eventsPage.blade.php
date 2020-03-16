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
        <troubleshooter v-if="troubleshoot.visible" v-bind="troubleshoot" 
        v-on:close-troubleshoot-modal="troubleshoot.closeModal(troubleshoot)"
        v-on:fix-reset-all="fixAndResetAll()"></troubleshooter>
        
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
                                            <a class="nav-link dropdown-toggle" :class="{'disabled': !is_hosting}"
                                            href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                <img src="/images/upload_icon.png" alt="" style="height:15px" >  Upload file
                                            </a>
                                            <div class="dropdown-menu" aria-labelledby="navbarDropdown" :class="{'disabled': !is_hosting}">
                                              <a class="dropdown-item" href="#" @click.prevent="$refs.pdfUploader.click()">
                                                  Pdf file

                                              </a>
                                              <a class="dropdown-item" href="#" @click.prevent="$refs.pptUploader.click()" :class="{'disabled': !is_hosting}">
                                                  Powerpoint
                                                </a>
                                              <div class="dropdown-divider"></div>
                                            </div>
                                          </li>
                                        <li class="nav-item">
                                            <a class="nav-link" href="#" @click.prevent="getBackgroundColor()" :class="{'disabled': !is_hosting}">
                                                <img src="/images/color_icon.png" alt="" style="height:25px"> Background
                                                color
                                            </a>
                                        </li>
                                        <li class="nav-item">
                                            <a class="nav-link" href="#" @click.prevent="triggerTroubleShoot()">
                                                <img src="/images/troubleshoot_icon.jpg" alt="" style="height:25px">
                                                Troubleshoot 
                                            </a>
                                        </li>
                                    </ul>

                                    <ul class="nav navbar-nav navbar-right mt-2" >
                                        <nav aria-label="Page navigation example">
                                            <ul class="pagination justify-content-end ml-3" >
                                                <li class="page-item "  v-if="is_hosting">
                                                    <a href="" class="nav-link">
                                                        <img src="/images/is_host_true.svg" alt="You are controlling" height="28px">
                                                        <span v-text="getHostInControl()"></span> 
                                                    </a>
                                                    
                                                </li>

                                                <li class="page-item " v-else>
                                                    <a href="" class="nav-link">
                                                        <img src="/images/is_host_false.svg" alt="You are not controlling" height="28px" >
                                                        <span v-text="getHostInControl()"></span> 
                                                    </a>
                                                    
                                                </li>

                                                <li class="page-item ml-3" v-if="is_hosting" >
                                                    <a tabindex="0" class="btn btn-lg btn-info" @click.prevent="giveOutControl()"
                                                    data-placement="bottom" role="button" data-toggle="popover" data-trigger="focus" title="Give out control" data-content="You will give out controll to the other person"  >
                                                        <img src="/images/switch.svg" alt="You are not controlling" height="28px" >
                                                        Give out 
                                                    </a>
                                                    <control  v-if="Access.visible" v-bind="Access"
                                                    v-on:grant-access-confirm="GiveOutAccess"
                                                    v-on:deny-grant-extra="AccessDenied"
                                                    v-on:cancel-grant-access="Access.closeModal(Access)" ></control>
                                                     
                                                </li>

                                                <li class="page-item ml-3" v-else>
                                                    <a href="" class="nav-link" v-if="host_type == 0 " @click.prevent="getControlBack()">
                                                        <img src="/images/swap.svg" alt="Get control back" height="30px" >
                                                        <span >Get control</span>
                                                    </a>
                                                    
                                                    <a href="" class="nav-link" v-else @click.prevent="requestControl()">
                                                        <img src="/images/swap.svg" alt="Request for control" height="30px" >
                                                        <span >Request control</span>
                                                    </a>
                                                    <control  v-if="Access.visible" v-bind="Access"
                                                    v-on:grant-access-confirm="GiveOutAccess"
                                                    v-on:deny-grant-extra="AccessDenied"
                                                    v-on:cancel-grant-access="Access.closeModal(Access)" ></control>
                                                    
                                                </li>

                                            </ul>
                                        </nav>
                                    </ul>
                                </div>
                            </nav>
                        </div>

                        <div class="card-body" style="min-height:50px">
                            <span id="colorPickerContainer"></span>
                            <div class="file_container">
                                {{-- <pdfjs></pdfjs> --}}
                                <custom-canvas  :style="setBackgroundColor()" v-bind="{
                                    file_sharing: file_sharing.image, messageSender: canvasUpdate,
                                    bg_color: colorPicker.current, is_hosting:is_hosting, video_sharing: video_sharing
                                }"></custom-canvas>
                                {{-- <whiteboard></whiteboard> --}}
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
                            <h5 class="title">Connection status: 
                                <img src="/images/online.svg" height="40px" alt="" 
                                    v-if="Connection && Connection.online"  >
                                    <img src="/images/offline.svg" height="40px" alt="" 
                                        v-if="Connection && !Connection.online"  >
                            </h5>
                        </div>
                        <div class="card-body all-tracks" style="position:relative; padding:0">
                            
                            <localvideo v-if="local_video.visible" v-bind="local_video"></localvideo>
                            <video class="card-image local-video" v-else
                                :src="default_video.video_src" alt="Offline video image" ></video>
                            

                            {{-- <remotevideo v-if="remote_video !== null && remote_video.visible" v-bind="remote_video"></remotevideo>
                            <video class="card-image remote-video" v-else
                            :src="default_video.video_src" alt="Offline video image"></video> --}}
                            <remotevideo v-if="remote_video !== null && remote_video.visible" v-bind="remote_video"></remotevideo>
                            <video class="card-image remote-video" v-else
                            :src="default_video.video_src" alt="Offline video image"></video>
                             
                            
                             
                            
                            
                        </div>
                        <a data-toggle="tab" style="position: relative;top: -20%;left: 85%;" href="#schoolInfo" 
                        @click.prevent="localAuidoToggle()">
                            <img src="/images/microphone_muted.svg" height="30px" alt="" 
                                v-if="local_video.muted">
                            <img src="/images/microphone.svg" height="30px" alt="" class="remote_audio" v-else>
                        </a>
                        <div class="">
                                <ul class="nav nav-tabs">
                                    <li class="active nav-item" >
                                        
                                    </li>
                                    {{-- <li class="active nav-item" >
                                        <a data-toggle="tab" class="nav-link" :class="" href="#schoolInfo" 
                                            @click.prevent="remoteAuidoToggle()">
                                            <img src="/images/audio_off.svg" height="30px" alt="" 
                                                v-if="remote_video.muted">
                                            <img src="/images/audio_on.svg" height="30px" alt="" class="remote_audio" v-else>
                                            
                                        </a>
                                    </li> --}}
                                </ul>
                        </div>
                    </div>
                    <div class="card" style="width:100%">
                        <ul class="nav nav-tabs">
                            <li class="active nav-item" >
                                <a data-toggle="tab" class="nav-link" :class="getActiveClass(0)" href="#schoolInfo" 
                                @click.prevent="getActiveTab(0)">Employer</a>
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
                                <a data-toggle="tab" class="nav-link" :class="getActiveClass(3)" href="#systemLog" 
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
                                        <div class="row">
                                            <div class="col-md-4 col-lg-4 ml-1 mt-2">
                                                <img src="{{$school_info['employer_img']}}" height="70" alt=""
                                        style="border-radius: 5%;">
                                            </div>
                                            <div class="col-md-7 col-lg-7">
                                                <div class="row ml-1">
                                                    
                                                </div>
                                            </div>
                                        </div>
                                        
                                           
                                    </div>
                                    <div class="card-body">

                                        <div class="row ml-1 mr-1">
                                            <b class="mr-3">School: </b> {{$school_info->name}}  
                                        </div>
                                    </div>
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
                                        <div class="row">
                                            <div class="col-md-4 col-lg-4">
                                                <img src="{{$teacher_info->head_photo}}" class="mt-2 ml-2" height="100px"  alt="">
                                            </div>
                                            <div class="col-md-8 col-lg-8">
                                                {{$teacher_info->intro}}
                                                
                                            </div>
                                            
                                        </div>
                                        
                                    </div>
                                    <hr>
                                    <div class="card-body">
                                        
                                        <div class="row">
                                            <b class="mr-3">Full name: </b> {{$teacher_info->full_name}}  
                                        </div>
                                        <div class="row">
                                            @if ($teacher_info->employment_status)
                                            <b class="mr-3">{{" Employment Status:  "}}  </b> {{" Employed "}} 
                                            @else
                                            <b class="mr-3">Employment status: </b> {{" Unemployed     "}}                                           
                                            @endif
                                        </div>
                                        <div class="row">
                                            <b class="mr-3">Nationality: </b> {{$teacher_info->nationality_id}}  
                                        </div>
                                    </div>
                                </div>
                                @endif
                            </div>
                            <div id="chatInfo" class="tab-pane " :class="getActiveClass(2)">
                                <div class="card">
                                    <div class="card-header"></div>
                                    <div class="card-body" style="height: 350px;overflow-y: auto;">
                                    
                                        
                                        <div class="row mt-2 " v-for="(message, mkey) in messages" :key="mkey"
                                            :class="getMessageClass(message.origin)"  style="width:100%"  >
                                                <div class="sent-message card" style="background-color: rgb(223, 210, 199);width:100%" 
                                                v-if="!message.origin">
                                                    <div class="card-header" style="background-color: rgb(146, 132, 107);height:40px">
                                                        <strong>@{{message.head}}</strong> <br>
                                                        
                                                    </div>
                                                    <div class="card-body" >
                                                        @{{message.message}}<br>
                                                        <span class="hint" 
                                                        style="position: absolute; float:left
                                                        font-size: 13px;color: #4d4848;">@{{message.timestamp}}</span>
                                                    </div>
                                                    
                                                </div>

                                                <div class="rec-message card " v-if="message.origin"
                                                style="background-color: #c7d3df;width:100%">
                                                        <div class="card-header" style="background-color: #85a2bc; height:40px">
                                                        
                                                        <strong style="position: absolute;right: 15px;">@{{message.head}}</strong> 
                                                        
                                                            
                                                        </div>
                                                        <div class="card-body" style="text-align:right">
                                                            @{{message.message}}<br>
                                                            <span class="hint"style="font-size: 15px;color: #4d4848; float:right"
                                                        >@{{message.timestamp}}</span>
                                                        </div>
                                                        
                                                    </div>
                                        </div>

                                        

                                    </div>
                                    <div class="card-footer">
                                        <div class="row">
                                                <input type="text" placeholder="Enter text" class="input" 
                                                class="col-md-7 col-lg-7"/ v-model="chat_message">
                                                <button class="btn btn-primary col-md-4 col-lg-4" @click.prevent="sendChat()">Send</button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div id="systemLog" class="tab-pane " :class="getActiveClass(3)">
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

<script src="/js/jquery.min.js"></script>
<script src="/js/bootstrap.min.js"></script>
<script src="/connections/RTCMultiConnection.min.js"></script>
<script src="/connections/socket.io.js"></script>
<script>
        @if(isset($teacher_info) && $isteacher === true)
           
            console.log('is teacher ',"{{$isteacher}}");
            window.user_name = "{{$teacher_info->full_name}}"
            window.user_id = "{{$teacher_info->user_id}}"
            window.type = parseInt ("{{$isteacher}}") == 1
            window.event_id = "{{$interview->id . $interview->teacher_id . $interview->school_id . $interview->interview_token}}"
        @elseif(isset($school_info) && !$isteacher)
            console.log('is schoool ',"{{$isteacher}}");
    
            window.user_name = "{{$school_info->name}}";
            window.user_id = "{{$school_info->id}}";
            window.type = parseInt ("{{$isteacher}}") == 1
            window.event_id = "{{$interview->id . $interview->teacher_id . $interview->school_id . $interview->interview_token}}"
        @endif

        $(document).ready(function(){
            $(function () {
                $('[data-toggle="popover"]').popover()
            })
        })
    </script>

@php 
$hash = hash('md5', public_path('js/mainvue.js'));
$filename = "/js/mainvue.js?".$hash;
@endphp
<script src="{{$filename}}"></script>

</html>
