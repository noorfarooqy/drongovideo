const Connection = class {

	constructor(config)
	{
		this.error = null;
		this.userid = null;//from stream
		this.Handler = config.target;
		this.roomdId = this.Handler.getRoomdId();
		this.debugLog = config.debugLog;
		this.log("new config ");
		this.log(config);
		this.connection  = new RTCMultiConnection();
		this.connection.session = {
	        audio: config.audio,
	        video: config.video,
	        data: config.data,
	    };
	    this.connection.sdpConstraints.mandatory = {
		    OfferToReceiveAudio: true,
		    OfferToReceiveVideo: true 
		};
		this.connection.socketURL = 'https://rtcmulticonnection.herokuapp.com:443/';
		this.connection.socketMessageEvent = 'webrtcTPsocketMsgEvent';
		this.connection.enableLogs = false;

		this.connection.onstream = function(event){
	    	this.log('Stream connection ', event);
	    	if(event.type === "local")
	    		this.userid = event.userid;
	    	this.Handler.newStream(event);
	    	
	    };
	    this.connection.onopen = function(event) {
    		this.log("Connection open ", event);
    		this.Handler.connectionOpened(event);      
    	};
    	
    	this.connection.onNewParticipant = function(participantId, userPreferences) {
	        this.log( "connection.onNewParticipant");
	        this.log( participantId );
	        this.log( userPreferences );
	        userPreferences.localPeerSdpConstraints.OfferToReceiveAudio = true;
	        userPreferences.localPeerSdpConstraints.OfferToReceiveVideo = true;
	        connection.acceptParticipationRequest(participantId, userPreferences);

	        this.Handler.newParticipant(userPreferences);
	    };


	    this.connection.onmessage = function(event){
	    	this.log('message recieved ', event);


	    	console.log('message recieved ', event);
	        var data = event.data;
	        if(!data.hasOwnProperty('mType'))
	        {
	            console.log("recieved invalid data type ");
	        }

	        switch(data.mType)
	        {
	            case "displayModeUpdated":
	                //
	                this.updateDisplayMode(data.mode);
	                break;
	            case "AnnotationType":
	                //
	                this.updateAnnot(data.xfdfString);
	                break;
	            case "zoomUpdated":
	                this.zoomDoc(data.zoomLevel);
	                break;
	            case "pageNumberUpdated":
	                this.updatePageNumber(data.pageNumber);
	                break;
	            case "newDoc":
	                console.log('new doc ',data.dblob);
	                if(!window.user.isMaster)
	                    customViewer(data.docUrl, connection, roomId);
	                break;
	            case "audioToggle":
	                this.startOrStopAudio(data);
	                break;
	            case "videoToggle":
	                this.startOrStopVideo(data);
	                break;
	            case "updateButton":
	                this.updateButtonColor($('.'+data.userId+data.bType), data.color, data.bType);
	                break;
	            case "chat":
	            	this.Handler.addMessageToChat({
	            		userName: data.from,
	            		message: data.value
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
	                this.Handler.addMessageToChat({
	                    userName: data.userName,
	                    message: createElement("img", [
	                        {name:"src", value: "/customicons/ic_hand.png"},
	                        {name:"hieght", value: "30px"},
	                    ]),
	                    message_type: "html"
	                });
	            default:
	                console.log("Unhandled mtype of ", data.mType, " recieved ",event);
	        }

	        this.Handler.newMessage(event);
	    };

	    this.connection.onPeerStateChanged = function(state) {
	    if (state.iceConnectionState.search(/closed|failed/gi) !== -1) {
	    	localConnection.numStreams--;
	        console.error('Peer connection is closed between you & ', state.userid, state.extra, 'state:', state.iceConnectionState);
            this.Handler.peerClosed(state);
	    }
	};

	}

	startRoom()
	{

		//set the user local info
		this.setExtraUserName(this.Handler.getUserName());
		this.setExtraUserType(this.Handler.getUserType());
		this.setAudioMuteStatus(false);
		this.setVideoStatus(true);
		this.saveUserPreferences();

		this.connection.openOrJoin(this.roomdId, function (isJoined, rid, error){
        	if(!isJoined)
        	{
        		this.error = error;
        		return false;
        	}
        });
	    this.connection.updateExtraData();
	    return true;

	}

	sendMessage(message)
	{
		if(message === undefined || message === "" || message === null)
		{
			this.log("Invalid message is ");
			this.log(message);
			return;
		}	
		this.connection.checkPresence(this.roomId, function(roomExist, rid){
    		if(roomExist)
    		{
    			this.connection.send(message);
    			this.log("sending ");
    			this.log(message);
    		}
    		else
    		{
    			console.log('room is offline, will send data when online');
    			message.message = message.message+" (room offline) ";
    		}
    	});
		
			

		if(message.mType === "chat")
		{	
			
			this.Handler.addMessageToChat(message);
		}
	}
	log(message)
	{
		if(this.debugLog)
			console.log("[***] ", message);
	}

	//setters
	setExtraUserName(userName)
	{
		this.connection.extra.userName = userName;
	}

	setExtraUserType(userType)
	{
		this.connection.extra.userType = userType;
	}

	setAudioMuteStatus(mute_status)
	{
		this.connection.extra.isAudioMuted = mute_status;
		this.connection.isAudioMuted= mute_status;
		this.Handler.updateAudioStatus(this.connection.isAudioMuted);
	}
	
	setVideoStatus(video_Status)
	{
		this.connection.extra.isVideoOn = video_Status;
		this.Handler.updateVideoStatus(this.connection.extra.isVideoOn);
	}

	updateExtra()
	{
		this.connection.updateExtraData();
	}
	saveUserPreferences()
	{
		this.connection.setUserPreferences(this.connection.extra);
	}

	//getters 
	getError()
	{return this.error};

}