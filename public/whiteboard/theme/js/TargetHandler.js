const TargetHandler = class{
	
	constructor()
	{
		this.roomId = window.user.roomId;
		this.userName = window.user.userName;
		this.userType = window.user.userType;
		this.document_id = 'webviewer-demo-1';
		this.localConnection = {
			mediaElement:null,
			stream: null, 
			userId:null,
			streamId:null, 
			numStreams:0, 
		};
		this.peers = [];
		this.debugLog = true;

	};

	newMessage(event)
	{

    	
	}

	getRoomdId()
	{
		return this.roomId;
	};

	getUserName()
	{
		return this.userName;
	};
	addMessageToChat(message)
	{
		console.log('adding ', message);
		var div = "\
		 <div class=\"student\">\
                    <img src=\"img/student1.png\" alt=\"student profile\" \
                    class=\"student_profile\">\
                    <p class=\"student_name_and_chat\">\
                        <strong class=\student_name\">"+message.from+"\
                        </strong><br>"+message.message+"</p>\
                    <div class=\"dropdown\">\
                        <button type=\"student_menu\" class=\"student_menu\">\
                        <img src=\"img/menu.png\" alt=\"menu\"></button>\
                        <div class=\"dropdown-content\" target=\"null\">\
                            <a href=\"#0\" id=\"toggleStudentVideoView\">Add to video position 1</a>\
                            <a href=\"#1\" id=\"toggleStudentVideoView\">Add to video position 2</a>\
                            <a href=\"#2\" id=\"toggleStudentVideoView\">Add to video position 3</a>\
                            <a href=\"#3\" id=\"toggleStudentVideoView\">Add to video position 4</a>\
                        </div>\
                    </div>\
                </div>\
		";
		$(".chatContainer").append(div);
		$("input[name='chat']").val('');
		var cb = document.querySelector('.chatContainer');
        cb.scrollTop = cb.scrollHeight;
	}
	messageTemplate(data, handle)
	{
		console.log("message template ");
		console.log(data.data);
		$(".chatContainer").append(data.data);
	}

	createElement(type, attr)
    {
        var elem = document.createElement(type);
        for(var i=0; i<attr.length; i++)
        {
            elem.setAttribute(attr[i].name, attr[i].value);
        }
        return elem;
    }


   	log(message)
   	{
   		if(this.debugLog)
   			console.log(message);
   	}


	ajaxCall(data, url, callback, callbackParam=false)
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
						$("#progressBarValue").text("Processing");
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
						callback(data);
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


}