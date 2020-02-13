$(document).ready(function(){

	var roomId = window.user.roomId;
	var userName = window.user.userName;
	var userType = window.user.userType;
	const DOCUMENT_ID = 'webviewer-demo-1';
	const serializer = new XMLSerializer();
	var connection = new RTCMultiConnection();
    
	/*var gcanvas = new fabric.Canvas('canvasBoard', {
        isDrawingMode: true,
        backgroundColor: '#ffffff'
    });*/
	var sharedPartOfScreenPreview = $('#sharedPartOfScreenPreview');
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
    var localConnection = {mediaElement:null,stream: null, userId:null,
     streamId:null, numStreams:0, peers:[]};
    //listen for opening room
    connection.onopen = function(event) {
    	console.log("Connection open ", event);      
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
    	console.log('Stream connection ', event);
    	if(event.type === "local")
    	{
    		initiateLocalStream(event);
    	}
    	else if(event.type === "remote")
    		initiateRemoteStream(event);
    };
    connection.onmessage = function(event){
    	console.log('message recieved ', event);
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
                console.log('new doc ',data.dblob);
                if(!window.user.isMaster)
                    customViewer(data.docUrl, connection, roomId);
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
            case "updateButton":
                updateButtonColor($('.'+data.userId+data.bType), data.color, data.bType);
                break;
            case "chat":
            	addMessageToChat({
            		userName: data.from,
            		message: data.message
            	});
            	break;
            case "playvideo":
                var vidElement = document.querySelector("#sharedVideoHolder");
                vidElement.currentTime = data.currentTime;
                vidElement.play();
                break;
            case "pausevideo":
                var vidElement = document.querySelector("#sharedVideoHolder");
                vidElement.currentTime = data.currentTime;
                vidElement.pause();
                break;
            case "raiseHand":
                addMessageToChat({
                    userName: data.userName,
                    message: "<img src='/img/ic_hand.png' height='20px' />",
                    message_type: "html",
                    userId: data.userId,
                });
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
	    }
	};

    $("button#create_meeting_room").bind("click", function(e) {
        console.log("will open room for students ");
        $('.wrapLoader').show();
        connection.extra.userName = userName;
        connection.extra.userType = userType;
        connection.extra.enabledVideo = true;
        connection.extra.enabledAudio = true;
        connection.setUserPreferences({extra : connection.extra});
        // 
        connection.openOrJoin(window.user.roomId, function (isJoined, rid, error){
        	if(isJoined)
        	{
        		$("#viewCamera").click();
	        	$('#dlg').dialog('close'); 
	        	$('.wrapLoader').hide();	
	        	// startCanvasStream();
                $('.wrapLoader').hide();    
        	}
        	else
        	{
        		$.messager.alert("Error", error);
        	}
        });
	    connection.updateExtraData();    
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
    $("#imageReady").click(function(e){
    	console.log('recieved and ready to send ',e);
    });
    $("#canvasListener1").bind("load", function(){
    	// console.log("ready to send ", $(this).attr("src"));
    	sendCanvasMessage($(this).attr('src'), "secondary");
    });
    $("#canvasListener2").on("load", function(){
    	// console.log("ready to send ", $(this).attr("src"));
    	sendCanvasMessage($(this).attr('src'), "primary");
    });
    $("a#slideFileDisplay").click(function(e){
        e.preventDefault();
        var src = $(this).attr("href");
        if( parseInt($(this).attr("type")) !== 0)
            customViewer(src, connection, window.user.roomId);
        else
        {
            var vid = createElement("video", [
                {name:"type", value:"video/mp4"},
                {name:"controls", value:"controls"},
                {name:"src", value:src},
                {name: "id", value:"shareVideoViewer"},
                {name: "style", value:"hieght: 400px; margin-top: 30px "},
            ]);
            // var vid = $("#sharedVideoHolder").clone();
            $(vid).attr("src", src);
            sendNormalMessage({
            	mType: "videoFile",
            	vidUrl: src
            });
            $("#viewer").html(vid);
            $(vid).on("play",  function(){
                console.log("will send play");
                sendNormalMessage({
                    mType: "playvideo",
                    currentTime: vid.currentTime
                });
            });

            $(vid).on("pause",  function(){
                console.log("will send paue");

                sendNormalMessage({
                    mType: "pausevideo",
                    currentTime: vid.currentTime
                });
            });
        }
        $("#screenChange").click();
    });

    $(document).on("play", "video#sharedVideoHolder", function(){
        console.log("will send play");
        sendNormalMessage({
            mType: "playvideo",
            currentTime: $(this).currentTime
        });
    });

    $(document).on("pause", "video#sharedVideoHolder", function(){
        console.log("will send paue");

        sendNormalMessage({
            mType: "pausevideo",
            currentTime: $(this).currentTime
        });
    });

    $("span.tutorAudioToggle").click(function(){
    	var uid = $(this).parent(".controllers").siblings(".camDiv").attr('data');
    	var color, mute_status;
    	if(window.user.isMaster)
    	{
    		console.log("will stop media element audio for tutor ");
    		var color ;;
    		if(uid === localConnection.userId)
		    {	
		    	
	    		localConnection.isAudioMuted = !localConnection.isAudioMuted;
	    		connection.extra.enabledAudio = !localConnection.isAudioMuted;
	    		connection.updateExtraData();
	    		color = localConnection.isAudioMuted == true ? "red" : "green";
	    		$(this).css("color", color);
                var mute_status = localConnection.isAudioMuted;
                localConnection.mediaElement.muted = mute_status;
	    	}
	    	else
	    	{
                connection.getAllParticipants().forEach(function(p, pi){
                    if(p.userid === uid)
                    {
                        streamid = p.streamid;
                        console.log("st id ",streamid);
                        var elemMedia = document.getElementById(streamid);
                        elemMedia.muted = p.extra.enabledAudio;
                        mute_status = !p.extra.enabledAudio;
                        sendNormalMessage({
                            mType: "audioToggle",
                            mute_status: mute_status,
                            userId: uid
                        });
                    }
                })
	    		// remotePeer = connection.peers[uid];
	    		// streamId = remotePeer.streams[0].streamid;
	    		// var elemMedia = document.getElementById(streamId);
	    		// console.log("should stop remote ", remotePeer);
	    		// var mute_status = !remotePeer.extra.enabledAudio;

	    		// elemMedia.muted = mute_status;
	    		// console.log("stopped ", elemMedia, " with ", mute_status);
	    		// color = !remotePeer.extra.enabledAudio === true ? "red":"green";
	    		// $(this).css('color', color);
	    	}

	    	// sendNormalMessage({
	    	// 	mType: "audioToggle",
	    	// 	mute_status: mute_status,
	    	// 	userId: uid
	    	// });
	    	// $(this).css("color", color);
			
    	}
	    	

    });

    $(".studentVideoToggle").click(function(){
        if(!window.user.isMaster )
            return;
    	var uid = $(this).parent(".controllers").attr('data');
        if(!uid)
        {
            console.log("video data is empty ");
            return;
        }
    	sendNormalMessage({
			mType: "videoToggle",
			userId: uid,
            tType:"stop"
		});
    });
    $("img#sharedCanvasImage").on("load", function(){
        var src = $(this).attr("src");
        var m = {
           screenshot: src,
            mType: "screenshot"
        };
        // console.log(src);
        connection.send(m);
    });
    function initiateLocalStream(event, targetElem = "#tCam0", type="local")
    {
    	
    	if(type === "local")
    	{
    		localConnection.mediaElement = event.mediaElement;
    		localConnection.stream = event.stream;
	    	localConnection.streamId = event.streamid;
	    	localConnection.userId = event.userid;
	    	localConnection.isAudioMuted = !event.extra.enabledAudio;
	    	localConnection.isVideoOn = true;
	    	localConnection.mediaElement.setAttribute('class', 'tVideoElem');
    	}
    	
    	
    	
    	// localConnection.mediaElement.setAttribute('hieght', '330px');

        $(targetElem).children('video.tVideoElem').remove();
        event.mediaElement.removeAttribute("controls");
    	$(targetElem).html(event.mediaElement);
    	 	
    	$(event.mediaElement).bind('DOMNodeRemoved', function(){
            var vid = createElement("video", [
            	{name:"class", value: "tVideoElem"},
            	// {name:"hieght", value: "330px"},
            ]);
            $(targetElem).html(vid);
            $(targetElem).siblings(".controllers").children(".hint").text("Offline");
            $(targetElem).siblings(".controllers").children("#toggleAudioSharing").css("color", "red");
        });
        var acolor = event.extra.enabledAudio === true ? "green":"red";
        event.mediaElement.muted = !event.extra.enabledAudio;
        event.mediaElement.play();   
        $(targetElem).siblings(".controllers").children("#toggleAudioSharing").css('color', acolor);
        $(targetElem).siblings(".controllers").children("#toggleAudioSharing").addClass(event.userid);
        $(targetElem).siblings(".controllers").children(".hint").text(event.extra.userName);
        $(targetElem).attr("data", event.userid);

        // $('#studentVideo'+n).children(".controllers").attr("streamid",event.streamid);

    }

    function initiateRemoteStream(event)
    {
    	console.log('initiateRemoteStream started for ',event.extra.userType);
    	if(event.extra.userType === "Tutor")
    	{	
    		console.log('initiateRemoteStream started');
    		return initiateLocalStream(event, "#tCam1", "remote");
    		
    	}
        var activePeer = true;
    	var n;
        if(event.extra.hasOwnProperty("position") && event.extra.position >= 0 &&
            event.extra.position < 4)
            n = event.extra.position;
        else
            n= localConnection.numStreams;
        if( n >= 0 && n <=4 )
        {
        	console.log('will add video to ', n);
        	event.mediaElement.setAttribute('class', 'studentVideoHolder');
        	// event.mediaElement.setAttribute('hieght', '150px');
        	$("#studentVideo"+n).children('video.studentVideoHolder').remove();
	        $('#studentVideo'+n).html(event.mediaElement);

	        event.mediaElement.muted = !event.extra.enabledAudio;
            event.mediaElement.removeAttribute("controls");
	        event.mediaElement.play();
	        event.mediaElement.controls = false;
	        $(event.mediaElement).bind('DOMNodeRemoved', function(){
	        	var vid = createElement("video", [
	        		{name:"class", value: "studentVideoHolder"},
	        		{name:"controls", value: "controls"}
	        	]);
	        	$("#studentVideo"+n).children()[0].before(vid);
                $('#studentVideo'+n).siblings(".controllers").children('.studentVideoToggle').css('color', "red");
                localConnection.peers.forEach(function(peer, index){
                    if(peer.userId === event.userId)
                        peers[index].isActive = false;
                });
	        })
	        var acolor = event.extra.enabledAudio === true ? "green":"red";
	        $('#studentVideo'+n).siblings(".controllers").children('.studentVideoToggle').css('color', "green");
	        $('#studentVideo'+n).siblings(".controllers").attr("streamid",event.streamid);
	        $('#studentVideo'+n).siblings(".controllers").attr("data",event.userid);

        	$('#studentVideo'+n).siblings(".controllers").children("#toggleVideoSharing").addClass(event.userid);
        }
        else
        {
            console.log('n is great ', n);
            activePeer = false;
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
                isActive: activePeer,
                userName: event.extra.userName
            });
            console.log("sshed peer ", localConnection.peers);
            localConnection.numStreams++;
            addMessageToChat({
                userName: event.extra.userName,
                message: "Joined the class",
            });
            sendNormalMessage({
                mType: "newDoc",
                docUrl: window.user.docUrl === "" ? "/whiteboard/tutorfile.pdf":window.user.docUrl 
            })
            createStudentVideoToggle({userName: event.extra.userName, userId: event.userid, id:n});
            $(".st_list_number").text(localConnection.numStreams);
        }
        else
            console.log("adding stream for existing user ");

        

        // addStudentToTable(event);
            
    }

    function updateButtonColor(target, color, type="")
    {
    	$(target).css("color", color);
    }
    function addMessageToChat(message)
    {
        var id1 = randomString();
        var id2 = randomString();
        var id3 = randomString();
        var id4 = randomString();
        console.log('adding ', message);
        var div = "\
         <div class=\"student\">\
                    <img src=\"img/student1.png\" alt=\"student profile\" \
                    class=\"student_profile\">\
                    <p class=\"student_name_and_chat\">\
                        <strong class=\student_name\">"+message.userName+"\
                        </strong><br>"+message.message+"</p>\
                    <div class=\"dropdown\">\
                        <button type=\"student_menu\" class=\"student_menu\">\
                        <img src=\"img/menu.png\" alt=\"menu\"></button>\
                        <div class=\"dropdown-content\" target=\""+message.userId+"\">\
                            <a href=\"#0\" id='"+id1+"' data='0' \
                            id=\"toggleStudentVideoView\">Add to video position 1</a>\
                            <a href=\"#1\" id='"+id2+"' data='1'\
                            id=\"toggleStudentVideoView\">Add to video position 2</a>\
                            <a href=\"#2\"  id='"+id3+"' data='2' \
                            id=\"toggleStudentVideoView\">Add to video position 3</a>\
                            <a href=\"#3\"  id='"+id4+"' data='3' \
                            id=\"toggleStudentVideoView\">Add to video position 4</a>\
                        </div>\
                    </div>\
                </div>\
        ";
        $(".chatContainer").append(div);
        var cb = document.querySelector('.chatContainer');
        cb.scrollTop = cb.scrollHeight;
        $("#"+id1).on("click", function(){
            changeStudentVideo(this);
        })
        $("#"+id2).on("click", function(){
            changeStudentVideo(this);
        })
        $("#"+id3).on("click", function(){
            changeStudentVideo(this);
        })
        $("#"+id4).on("click", function(){
            changeStudentVideo(this);
        })
   	
    }
    function createStudentVideoToggle(message)
    {
        var id1 = randomString();
        var id2 = randomString();
        var id3 = randomString();
    	var id4 = randomString();
        var stlist = "\
                <div class=\"studentList"+message.id+"\">\
                    <img src=\"/images/message-icon.png\" height=\"60px\" class=\"stImg\" >\
                    <span class=\"student_name\">"+message.userName+"</span>\
                    <div class=\"dropdown\">\
                        <button type=\"student_menu\" class=\"student_menu\">\
                        <img src=\"img/menu.png\" alt=\"menu\"></button>\
                        <div class=\"dropdown-content\" target=\""+message.userId+"\">\
                            <a href=\"#0\" id='"+id1+"' data='0' \
                            id=\"toggleStudentVideoView\">Add to video position 1</a>\
                            <a href=\"#1\" id='"+id2+"' data='1'\
                            id=\"toggleStudentVideoView\">Add to video position 2</a>\
                            <a href=\"#2\"  id='"+id3+"' data='2' \
                            id=\"toggleStudentVideoView\">Add to video position 3</a>\
                            <a href=\"#3\"  id='"+id4+"' data='3' \
                            id=\"toggleStudentVideoView\">Add to video position 4</a>\
                        </div>\
                    </div>\
                </div>\
        ";
        $(".studentList").append(stlist);
        $("#"+id1).on("click", function(){
            changeStudentVideo(this);
        })
        $("#"+id2).on("click", function(){
            changeStudentVideo(this);
        })
        $("#"+id3).on("click", function(){
            changeStudentVideo(this);
        })
        $("#"+id4).on("click", function(){
            changeStudentVideo(this);
        })
    }
    function changeStudentVideo(target)
    {
        console.log($(target).parent(".dropdown-content").attr("target"));
        var userId = $(target).parent(".dropdown-content").attr("target");
        var vidindex = $(target).attr("data");
        var peers = localConnection.peers;
        peers.forEach(function(item, index){
            if(item.userId === userId)
            {
                
                sendNormalMessage({
                    mType: "videoToggle",
                    userId: userId,
                    tType:"start",
                    index: vidindex
                });
            }
        })
    }
    function startCanvasStream()
    {
        var gcanvas = document.getElementById("canvasBoard");
        // $("#stage, .subProperties a, .db-nav a").on(" touchend touchmove keyup keypress click  mousedown keydown", function(e){
        
        setInterval(function(){
            if(window.user.isMaster)
            {   
                
                var screenshot = gcanvas.toDataURL('image/jpeg', 0.5); 
                var dataToSend = {
                   screenshot: screenshot,
                    mType: "screenshot"
                };
                connection.send(dataToSend);
                console.log(screenshot);
            }
        }, 1000);
    }
    function sendCanvasMessage(src, docType)
    {
    	connection.checkPresence(roomId, function(roomExist, rid){
    		if(roomExist)
    		{
    			connection.send({
    				mType: "docView",
    				mSource: src, 
    				docType: docType
    			});
    		}
    		else
    			console.log('room is offline, will send data when online');
    	});
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

    function stopVideo(data)
    {

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
        localConnection.peers.forEach(function(peer, pindex){
            if(peer.userId === data.userId)
            {
                console.log("found peer to start")
                if(!peer.isActive)
                {
                    $("#studentVideo"+data.index).html(peer.mediaElement);
                }
                else
                    console.log("found already active peer");
            }

        });
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
		        elemMedia.muted = remotePeer.extra.enabledAudio;
		        color = remotePeer.extra.enabledAudio === true ? "red" : "green";
		        $(elemMedia).parent(".camDiv").siblings(".controllers").children(".tutorAudioToggle").css("color", color);
        

			}

		});
		if(data.userId === localConnection.userId)
        {
        	console.log("local stop/start audio");
        	localConnection.isAudioMuted = !localConnection.isAudioMuted;
        	connection.extra.enabledAudio = localConnection.isAudioMuted;
        	connection.updateExtraData();
        	color = connection.extra.enabledAudio === true ? "green" : "red";
        	$("."+data.userId+".tutorAudioToggle").css("color", color);
        }

    	sendNormalMessage({
        	mType: "updateButton",
        	userId: data.userId,
        	color: color,
        	bType:".tutorAudioToggle"

        });
        
    }
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

    function randomString()
    {
        var r ="";
        var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        var charLen= chars.length;
        for(var i=0;i<8; i++)
        {
            r+= chars.charAt(Math.random()  * charLen);
        }
        return r;
    }

    customViewer("/whiteboard/abbreviation.pdf", connection, window.user.roomId, true);


});


function ajaxCall(data, url, callback, callbackParam=false)
{
		
	$.ajax({
		xhr: function()
		{
			$("#progressBarValue").css("width", "0%");
			$("#progressBarValue").text("Loading: 0%");
			$(".customProgressBarDiv").css('visibility', 'visible');

		    var xhr = new window.XMLHttpRequest();
		    //Upload progress
		    xhr.upload.addEventListener("progress", function(evt){
		      if (evt.lengthComputable) {
		        var percentComplete = Math.floor((evt.loaded / evt.total) * 100);
		        console.log("percent: ",percentComplete);
		        //Do something with upload progress
		        $("#progressBarValue").css("width", percentComplete+"%");
				$("#progressBarValue").text("Loading: "+percentComplete+"%");
				if(percentComplete >= 100)
					$("#progressBarValue").text("processing");
		      }
		    }, false);
		    //Download progress
		    xhr.addEventListener("progress", function(evt){
		      if (evt.lengthComputable) {
		        var percentComplete = Math.floor((evt.loaded / evt.total) * 100);
		        console.log("percent: ",percentComplete);
		        //Do something with download progress
		        $("#progressBarValue").css("width", percentComplete+"%");
				$("#progressBarValue").text("Loading: "+percentComplete+"%");
				if(percentComplete >= 100)
					$("#progressBarValue").text("processing");
		      }
		    }, false);
		    return xhr;
		},
		method: "POST",
		url: url,
		data: data,
		dataType: "json",
		processData: false,
		contentType: false,
		success: function(data){
			if(data.isSuccess === false)
			{
				console.log('Error length ',data.errorMessage.length);
				for(var i=0; i < data.errorMessage.length ; i++)
					if(data.errorMessage[i].hasOwnProperty('xdebug_message'))
						alert('The phone number is not valid number');
					else
						alert(data.errorMessage[i]);
				// alert(data.errorMessage[0]);
			}
			else
			{
				if(callbackParam)
				{
					console.log('sending ',data);
					callback(data)
				}	
				else
					callback(`callbackParam`);
			}
			
		}
	})
	.fail(function(error){
		alert('Error',error)
	})
}
