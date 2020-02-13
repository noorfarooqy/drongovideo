$(document).ready(function(){
    var roomId = window.user.roomId;
    var userName = window.user.userName;
    var userType = window.user.userType;
    var annotManager = null;
    var docViewer = null;
    var Instance = null;
    var sharedPartOfScreenPreview = $('#sharedPartOfScreenPreview');
	var connection = new RTCMultiConnection();

	connection.session = {
        audio: true,
        video: true,
        data: true,
    };
    connection.sdpConstraints.mandatory = {
        OfferToReceiveAudio: true,
        OfferToReceiveVideo: true 
    };
    connection.socketURL = 'https://rtcmulticonnection.herokuapp.com:443/';
    connection.socketMessageEvent = 'webrtcTPsocketMsgEvent';
    connection.enableLogs = false;
    var localConnection = {
        mediaElement:null,stream: null, 
        userId:null, streamId:null, 
        numStreams:0, peers : []
    };
    //listen for opening room
    connection.onopen = function(event) {
    	console.log("St Connection open ", event);      
    };
    connection.onNewParticipant = function(participantId, userPreferences) {
        console.log( "connection.onNewParticipant");
        console.log( participantId );
        console.log( userPreferences );
        userPreferences.localPeerSdpConstraints.OfferToReceiveAudio = true;
        userPreferences.localPeerSdpConstraints.OfferToReceiveVideo = true;
        connection.acceptParticipationRequest(participantId, userPreferences);
    };
    connection.onstream = function(event){
    	console.log('St Stream connection ', event);
        if(event.type === "local")
            initiateLocalStream(event);
        if(event.type === "remote")
        {
            if(event.extra.userType === "student")
                initiateStudentRemoteStream(event);
            else
                initiateTutorRemoteStream(event);
        }
    };
    connection.onmessage = function(event){
    	console.log('St message recieved ', event);
        var data = event.data;
        if(!data.hasOwnProperty('mType'))
        {
            console.log("recieved invalid data type");
        }
        switch(data.mType)
        {
            case "displayModeUpdated":
                //
                updateDisplayMode(data.mode);
                break;
            case "AnnotationType":
                //
                updateAnnot(data.xfdfString);
                break;
            case "zoomUpdated":
                zoomDoc(data.zoomLevel);
                break;
            case "pageNumberUpdated":
                updatePageNumber(data.pageNumber);
                break;
            case "newDoc":
                clientViewer(data.docUrl);
                console.log('new doc ',data.docUrl);
                break;
            case "audioToggle":
                startOrStopAudio(data);
                break;
            case "videoToggle":
                if(data.tType === "start")
                    startVideo(data);
                else
                    stopVideo(data);
                break;
            case "videoFile":
                viewVideoFile(data.vidUrl);
                break;
            case "screenshot":
                $(sharedPartOfScreenPreview).attr('src', data.screenshot);
                break;
            case "chat":
                addMessageToChat({
                    userName: data.from,
                    message: data.message
                });
                break;
            case "playvideo":
                var vidElement = document.querySelector("video#sharedVideoHolder");
                console.log("video ",vidElement);
                vidElement.currentTime = data.currentTime;
                vidElement.play();
                break;
            case "pausevideo":
                var vidElement = document.querySelector("video#sharedVideoHolder");
                console.log("video ",vidElement);
                vidElement.currentTime = data.currentTime;
                vidElement.pause();
                break;
            default:
                console.log("Unhandled mtype of ", data.mType, " recieved ",event);
        }
       


    };
    connection.onPeerStateChanged = function(state) {
        if (state.iceConnectionState.search(/closed|failed/gi) !== -1) {
            localConnection.numStreams--;
            console.error('Peer connection is closed between you & ', state.userid, state.extra, 'state:', state.iceConnectionState);
            addMessageToChat({
                userName: state.extra.userName,
                message: "Left the class"
            });
            if(state.extra.userType === "student")
                localConnection.numStreams--;
        }
    };
    $("button#join_meeting_room").bind("click", function(e) {
        $('.wrapLoader').show();
         connection.checkPresence (roomId, function(roomExist, rid){
            if(roomExist)
            {
                connection.extra.position = -1;
                connection.extra.userName = userName;
                connection.extra.userType = userType;
                connection.extra.enabledVideo = true;
                connection.extra.enabledAudio = true;
                connection.isAudioMuted = false;
                connection.setUserPreferences({extra : connection.extra});
                
                connection.join(roomId, function(isJoined, rid, error){
                    if(isJoined)
                    {
                        $("#viewCamera").click();
                        $('#dlg').dialog('close'); 
                        $("#west .wr-left").css("display", "none");
                        $(".subProperties").hide();
                        $("#center #ancUndo").remove();
                        $("#center #ancRedo").remove();
                        $("#center .clrDynamicCanvas").remove();
                        $(".canvas-container").remove();
                        $('#btnMuteAll').hide();
                        $("#containerSharedPartOfScreenPreview").show();
                        $('.wrapLoader').hide();
                    }
                    else
                    {
                        $.messager.alert("Error", error);
                        $('.wrapLoader').hide();
                    }
                });
                connection.updateExtraData();
            }
            else
            {
                $.messager.alert("Not Available!", "The room is not yet opened.");
                $('.wrapLoader').hide();
            }
        }); 
    });
    

    $("#sendChat").click(function(){
        var v = $("input[name='chat']").val();
        if(v === null || v === "")
            return;
        sendNormalMessage({
            mType:"chat",
            from: window.user.userName,
            message: v,
        });
        addMessageToChat({
            userName: "You",
            message: v

        })
        $("input[name='chat']").val("");
    });
    $("input[name='chat']").on("keyup", function(e){
        if(e.keyCode === 13)
            $("#sendChat").click();
    });
    $("button.raise_hand_button2").click(function(){
        sendNormalMessage({
            mType: "raiseHand",
            userName: window.user.userName,
            userId: localConnection.userId
        });
        addMessageToChat({
            message: "<img src='/img/ic_hand.png' height='20px'/>",
            userName: "Your",
            userId: localConnection.userId

        });
    });

    function initiateLocalStream(event)
    {
        localConnection.mediaElement = event.mediaElement;
        localConnection.stream = event.stream;
        localConnection.streamId = event.streamid;
        localConnection.userId = event.userid;
        localConnection.isAudioMuted = event.isAudioMuted;
        var li = createElement('li',[]);
        var span = createElement('span', [{name: "class", value: "studentName" }]);
        // var numParticipants = connection.getAllParticipants().length;
        var numParticipants;
        if(event.extra.hasOwnProperty("position") && event.extra.position >= 0 &&
            event.extra.position < 4)
            numParticipants = event.extra.position;
        else
            numParticipants = localConnection.numStreams;
        
        console.log("Num streams level up to ", localConnection.numStreams);
        event.mediaElement.removeAttribute("controls");

        if(numParticipants <= 4)
        {
            console.log("few participant, will add to display ",numParticipants);
            $("#studentVideo"+(numParticipants)).children("video").remove();
            $("#studentVideo"+(numParticipants)).html(localConnection.mediaElement);
            localConnection.mediaElement.setAttribute('class', 'studentVideoHolder');
            // localConnection.mediaElement.setAttribute('height', '150px');
            localConnection.mediaElement.play();
            $(event.mediaElement).bind('DOMNodeRemoved', function(){
                var vid = createElement("video", [
                    {name:"class", value: "studentVideoHolder"},
                    // {name:"height", value: "150px"},
                ]);
                $("#studentVideo"+numParticipants).html(vid);
                $('#studentVideo'+numParticipants).siblings(".controllers").children(".studentVideoToggle").css("color","red");
            })
            $('#studentVideo'+numParticipants).siblings(".controllers").children(".studentVideoToggle").css("color","green");
            $('#studentVideo'+numParticipants).siblings(".controllers").attr("streamid",event.streamid);
            $('#studentVideo'+numParticipants).siblings(".controllers").children(".hint").text(event.extra.userName);
            $('#studentVideo'+numParticipants).siblings(".controllers").html(spanVid);
            $('#studentVideo'+numParticipants).siblings(".controllers").append(spanAud);
            $(spanVid).css("color", "green");
            $(spanAud).css("color", "green");
        }
        // addStudentToTable(event);
        addMessageToChat({
            userName: event.extra.userName,
            message: "Joined the class",
        });
        $(".st_list_number").text((localConnection.numStreams++));
        
    }
    
    function initiateTutorRemoteStream(event, targetElem = "#tCam0")
    {
        if($(targetElem).attr('status') === "on")
        {
            targetElem = "#tCam1";
        }    
        event.mediaElement.setAttribute('class', 'tutorVideoHolder');
        // event.mediaElement.setAttribute('height', '330px');
        $(targetElem+'#tVideoElem').remove();
        event.mediaElement.muted = !event.extra.enabledAudio;
        $(targetElem).html(event.mediaElement);
        
        event.mediaElement.play();
        event.mediaElement.controls = false;
        $(event.mediaElement).bind('DOMNodeRemoved', function(){
            var vid = createElement("video", [
                {name:"id", value: "tVideoElem"},
                // {name:"height", value: "330px"},
            ]);
            $(targetElem).html(vid);

            $(targetElem).siblings(".controllers").children(".hint").text("Offline");
            $(targetElem).siblings(".controllers").children(".tutorAudioToggle").css("color","red");
            $(targetElem).attr('status', "off");
        });
        $(targetElem).attr("status", "on");
        var color = event.extra.enabledAudio === true ? "green": "red";
        $(targetElem).siblings(".controllers").children("span.hint").text(event.extra.userName);
        $(targetElem).siblings(".controllers").children(".tutorAudioToggle").css("color",color);
        addMessageToChat({
            userName: event.extra.userName,
            message: "Joined the class"
        })

    }

    function initiateStudentRemoteStream(event)
    {
        var activePeer = true;
        var n = localConnection.numStreams;
        localConnection.numStreams++;
        console.log("Num streams level up to ", localConnection.numStreams);
        if(event.extra.hasOwnProperty("position") && event.extra.position >= 0 &&
            event.extra.position < 4)
            n = event.extra.position;
        if((n > 0 && n <= 4) || n === 0 )
        {
            // $("#studentVideo"+(n)).children("video").remove();
            console.log('will add video to ', n);
            event.mediaElement.setAttribute('class', 'studentVideoHolder');
            // event.mediaElement.setAttribute('height', '150px');
            $('#studentVideo'+n).html(event.mediaElement);

            event.mediaElement.muted = !event.extra.enabledAudio;
            event.mediaElement.play();
            event.mediaElement.removeAttribute("controls");

            $(event.mediaElement).bind('DOMNodeRemoved', function(){
                var vid = createElement("video", [
                    {name:"id", value: "tVideoElem"},
                    // {name:"height", value: "330px"},
                ]);
                $("studentVideo"+n).html(vid);

                $("studentVideo"+n).siblings(".controllers").children(".hint").text("Offline");
                $("studentVideo"+n).siblings(".controllers").children(".studentVideoToggle").css("color","red");
                
            });
            var color = event.mediaElement.muted === true ? "red":"green";
            $("studentVideo"+n).siblings(".controllers").children(".studentVideoToggle").css("color",color);
        }
        else
        {    
            console.log('n is great ', n);activePeer = false;
        }   
            
        var is_existing = false;
        localConnection.peers.forEach(function(peer, pindex){
            if(peer.userName === event.extra.userName)
                is_existing = true;
        })
        if(!is_existing)
        {    
            localConnection.peers.push({
                mediaElement: event.mediaElement,
                mute_status: !event.extra.enabledAudio,
                streamid: event.streamid,
                userId: event.userid,
                isActive: activePeer
            });
            console.log("sshed peer ", localConnection.peers);
                
            
            addMessageToChat({
                userName: event.extra.userName,
                message: "Joined the class",
                userId: event.userid
            });
            createStudentVideoToggle({userName: event.extra.userName, userId: eve.userid, id: n});
            $(".st_list_number").text(localConnection.numStreams);
        }
    }
    function stopVideo(data)
    {
        if(!connection.extra.enabledVideo)
        {
            console.log("stream is off");
        }  
        if(localConnection.userId === data.userId )
        {
            localConnection.stream.stop();
            console.log("stopped stream ",localConnection.streamId);

            connection.extra.enabledVideo = localConnection.isVideoOn;
            connection.updateExtraData();
        }
    }
    function startVideo(data)
    {
        
        if(localConnection.userId === data.userId)
        {
            connection.extra.position = data.index;
            connection.setUserPreferences({extra : connection.extra});
            connection.updateExtraData();
            connection.addStream({audio:true, video:true});
            return;
        }
        else
            console.log("could not find user existence");
    }
    function startOrStopAudio(data)
    {
        var color;
            
        connection.getAllParticipants().forEach(function(userid) {
            console.log("local stop/start audio");

            if(userid === data.userId)
            {    
                console.log("found target start/stop");

                var remotePeer = connection.peers[userid];
                console.log("remotepeer ", remotePeer);
                var elemMedia = document.getElementById(remotePeer.streams[0].streamid);
                console.log("eleme media ",elemMedia );
                console.log("audio will be set to mute status ", data.mute_status);
                elemMedia.muted = data.mute_status;
                color = data.mute_status === true ? "red" : "green";
                $(elemMedia).parent(".camDiv").siblings(".controllers").children(".tutorAudioToggle").css("color", color);
        

            }

        });
        if(data.userId === localConnection.userId)
        {
            console.log("local stop/start audio");
            localConnection.isAudioMuted = !localConnection.isAudioMuted;
            connection.extra.enabledAudio = localConnection.isAudioMuted;
            connection.updateExtraData();
            console.log("audio will be set to mute status ", data.mute_status);
            color = data.mute_status === true ? "red" : "green";
        }

        sendNormalMessage({
            mType: "updateButton",
            userId: data.userId,
            color: color,
            bType:".studentAudioToggle"

        });
    }

    function viewVideoFile(src) {
        var vid = createElement("video", [
            {name:"type", value:"video/mp4"},
            {name:"src", value:src},
            {name:"id", value:"sharedVideoHolder"},
            {name: "style", value:"hieght: 400px; margin-top: 30px "},
        ]);

        $("#viewer").html(vid);
    }
    function sendNormalMessage(message)
    {
        connection.checkPresence(roomId, function(roomExist, rid){
            if(roomExist)
            {
                connection.send(message);
            }
            else
                console.log('room is offline, will send data when online');
        });
    }

    function createElement(type, attr)
    {
        var elem = document.createElement(type);
        for(var i=0; i<attr.length; i++)
        {
            elem.setAttribute(attr[i].name, attr[i].value);
        }
        return elem;
    }
    function addMessageToChat(message)
    {
        console.log('adding ', message);
        var div = "\
         <div class=\"student\">\
                    <img src=\"img/student1.png\" alt=\"student profile\" \
                    class=\"student_profile\">\
                    <p class=\"student_name_and_chat\">\
                        <strong class=\student_name\">"+message.userName+"\
                        </strong><br>"+message.message+"</p>\
                </div>\
        ";
        $(".chatContainer").append(div);
        var cb = document.querySelector('.chatContainer');
        cb.scrollTop = cb.scrollHeight;

    }
    function createStudentVideoToggle(message)
    {
        var stlist = "\
                <div class=\"studentList0\">\
                    <img src=\"/images/message-icon.png\" height=\"60px\" class=\"stImg\" >\
                    <span class=\"student_name\">"+message.userName+"</span>\
                </div>\
        ";
        $(".studentList").append(stlist);
    }
    const clientViewer = function (url="/whiteboard/tutorfile.pdf") {
        $("#viewer").html("");
        WebViewer({
            path: "/WebViewer/lib",
            // initialDoc: url,
            isReadOnly: true,
            preloadWorker: "all",
            isAdminUser: false,
            annotationUser: window.user.userName,
        }, document.getElementById("viewer"))
        .then(function(instance){
            docViewer = instance.docViewer;
            annotManager = instance.annotManager;
            instance.loadDocument(url);
            docViewer.on("documentLoaded", function(){
                console.log("Client doc loaded");
            })
            instance.setHeaderItems(header => {
                header.update([]);
            });
        });
    
    }
    clientViewer();
    function updateAnnot(anotString)
    {
        const annotations = annotManager.importAnnotCommand(anotString);
        annotManager.drawAnnotationsFromList(annotations);
    }
    function zoomDoc(level)
    {
        docViewer.zoomTo(level);
    }
    function updatePageNumber(num)
    {
        docViewer.setCurrentPage(num);
    }
    function updateDisplayMode(mode)
    {
        const modeManager = docViewer.getDisplayModeManager() ;
        const cMode = modeManager.getDisplayMode();
        cMode.mode=mode;
        modeManager.setDisplayMode(cMode);
    }
    // clientViewer("/whiteboard/abbreviation.pdf");
});