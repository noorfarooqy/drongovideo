$(document).ready(function(){
	//t handle
	var config = {
		target: new TargetHandler(),
		debugLog: true,
		video: true,
		audio: true,
		data:true,
	};
	var connection = new Connection(config);

	//starting class

	$("button#create_meeting_room").bind("click", function(e) {
		if(connection.startRoom())
		{
			$("#viewCamera").click();
        	$('#dlg').dialog('close'); 
        	$('.wrapLoader').hide();	
            $('.wrapLoader').hide(); 
		}
	});

	//sending chat

	$("#sendChat").on("click",function(){
		var v = $("input[name='chat']").val();
		connection.sendMessage({message: v, from: window.user.userName, mType: "chat"});
		
	});
	$("input[name='chat']").on("keyup", function(e){
        if(e.keyCode === 13)
            $("#sendChat").click();
    });

    //uploading pdf/ppt

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
            connection.sendMessage({
            	mType: "videoFile",
            	vidUrl: src
            });
            $("#viewer").html(vid);
            $(vid).on("play",  function(){
                console.log("will send play");
                connection.sendMessage({
                    mType: "playvideo",
                    currentTime: vid.currentTime
                });
            });

            $(vid).on("pause",  function(){
                console.log("will send paue");

                connection.sendMessage({
                    mType: "pausevideo",
                    currentTime: vid.currentTime
                });
            });
        }
        $("#screenChange").click();
    });


	function createElement(type, attr)
    {
        var elem = document.createElement(type);
        for(var i=0; i<attr.length; i++)
        {
            elem.setAttribute(attr[i].name, attr[i].value);
        }
        return elem;
    }

	// end t handle
})