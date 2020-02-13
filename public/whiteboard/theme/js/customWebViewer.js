
const customViewer = function (url, connection, roomId, initial=false){
	$("div#viewer").html('');
	window.user.docUrl = url;
	const serializer = new XMLSerializer();
	const DOCUMENT_ID = 'webviewer-demo-1';
    WebViewer({
	    path: '/WebViewer/lib', // path to the PDFTron 'lib' folder on your server
	    // licenseKey: 'Insert commercial license key here after purchase',
	    // initialDoc: url,
	    preloadWorker: "all",
	    // config: "/js/webviewerConfig.js",
	    // extension: "pdf",
	    // initialDoc: '/path/to/my/file.pdf',  // You can also use documents on your server
	}, document.getElementById('viewer'))
    .then(function(instance) {

    	console.log('webviewer ',WebViewer);
      	var docViewer = instance.docViewer;
      	var annotManager = instance.annotManager;
      	var Actions = instance.Actions;
      	var fileAction = null;
      	var iframeWindow = instance.iframeWindow;

      	iframeWindow.addEventListener("load", function(){
      		console.log("iframe loaded in addEventListener");
      	});
      	console.log("will load ",url);
      	sendMessageIfOnline({
		    mType: "newDoc",
		    docUrl: url
		})
    	instance.loadDocument(url,{
	  		documentId: Math.random(),
  			orError: function(e){
  				console.log('error ',e);
  			},
  		});
      	iframeWindow.addEventListener("load", function(){
      		console.log("iframe loaded in addEventListener");
      	});
      	$
      	// call methods from instance, docViewer and annotManager as needed

      	// you can also access major namespaces from the instance as follows:
      	// var Tools = instance.Tools;
      	// var Annotations = instance.Annotations;
      	annotManager.on('annotationChanged', function(e){
	        if(e.imported)
	          return ;
	        const xfdfString = annotManager.getAnnotCommand();
	        // Parse xfdfString to separate multiple annotation changes to individual annotation change
	        const parser = new DOMParser();
	        const commandData = parser.parseFromString(xfdfString, 'text/xml');
	        const addedAnnots = commandData.getElementsByTagName('add')[0];
	        const modifiedAnnots = commandData.getElementsByTagName('modify')[0];
	        const deletedAnnots = commandData.getElementsByTagName('delete')[0];

	        // List of added annotations
		    
	        updateAnnot(addedAnnots, modifiedAnnots, deletedAnnots);
	        // console.log('annotationChanged ',e);
      	});
      	docViewer.on("error", function(e){
      		console.log('e ',e);
      		alert("error ",e);
      	});
      	
      	docViewer.on('documentLoaded', function() {
        	// call methods relating to the loaded document
        	var fpicker = createElement("input", [
        		{name:"type", value:"file"},
        		{name:"name", value:"inputFilePicker"},
        		{name:"id", value:"inputFilePicker"},
        	])

			$("input#inputFilePicker").remove();
        	$(".filePicker").append(fpicker);
        	$(fpicker).change(function(){
        		var form = document.querySelector("form#filePickerForm");
        		var fdata = new FormData(form);
        		ajaxCall(fdata, "/newFile", fileCall, true);
		    	// alert("we can handle file");
		    });
		    
      	});

      	instance.setHeaderItems(function(header){
	      	header.push({
	  			type: 'actionButton',
		  		img: '/images/pdficon.png',
		  		onClick: function() {
		   			$("#inputFilePicker").click();
		  		},
		  		dataElement: 'alertButton',
		  		hidden: [ 'mobile' ]
	      	})

      	});
      	$("#hideErrorModel").click(function(){
      		var emodal = iframeWindow.document.querySelector("div.ErrorModal");
	        $(emodal).css("visibility", "hidden");
	        console.log("emaola ",emodal);
	    });
      	function loadDocument(url)
      	{
      		instance.loadDocument(url);
      	}
		function updateAnnot(addedAnnots, modifiedAnnots, deletedAnnots)
	    {
	    	addedAnnots.childNodes.forEach((child) => {
	          sendAnnotationChange(child, 'add');
	          console.log('Added annot ',child);
	        });

	        // List of modified annotations
	        modifiedAnnots.childNodes.forEach((child) => {
	          sendAnnotationChange(child, 'modify');
	          console.log('modified annot ',child);
	        });
	        
	        // List of deleted annotations
	        deletedAnnots.childNodes.forEach((child) => {
	          sendAnnotationChange(child, 'delete');
	          console.log('Deleted annot ',child);
	        });
	    }
		docViewer.on("annotationsLoaded", function(){
			const xfdfString = annotManager.getAnnotCommand();
		    // Parse xfdfString to separate multiple annotation changes to individual annotation change
		    const parser = new DOMParser();
		    const commandData = parser.parseFromString(xfdfString, 'text/xml');
		    const addedAnnots = commandData.getElementsByTagName('add')[0];
		    const modifiedAnnots = commandData.getElementsByTagName('modify')[0];
		    const deletedAnnots = commandData.getElementsByTagName('delete')[0];
		  	updateAnnot(addedAnnots, modifiedAnnots, deletedAnnots);
		});
      
		docViewer.on('changePage', function(){
		    console.log('change page');
		});

	    docViewer.on('pageNumberUpdated', function(){
	        console.log('pageNumberUpdated page');
	        sendMessageIfOnline({
	        	mType: "pageNumberUpdated",
	        	pageNumber: docViewer.getCurrentPage(),
	        });
	    });
	    docViewer.on('displayModeUpdated', function(e){
	      	if(e.imported)
	      		return;
	      	const modeManager = docViewer.getDisplayModeManager() ;

	        console.log('displayModeUpdated page ',modeManager.getDisplayMode());
	        console.log(modeManager.getDisplayMode().mode)
	        sendMessageIfOnline({
	        	mType: "displayModeUpdated",
	        	mode: modeManager.getDisplayMode().mode,
	        });
			        
	    });
	    docViewer.on('zoomUpdated', function(e){
	      	
	      	sendMessageIfOnline({
	        	mType: "zoomUpdated",
	        	zoomLevel: docViewer.getZoom(),
	        });

	    });

	    docViewer.scrollViewUpdated(function(){
	        console.log('scroll udpated');
	    });
    });




	// wrapper function to convert xfdf fragments to full xfdf strings
	const convertToXfdf = (changedAnnotation, action) => {
	  let xfdfString = `<?xml version="1.0" encoding="UTF-8" ?><xfdf xmlns="http://ns.adobe.com/xfdf/" xml:space="preserve"><fields />`;
	  if (action === 'add') {
	    xfdfString += `<add>${changedAnnotation}</add><modify /><delete />`;
	  } else if (action === 'modify') {
	    xfdfString += `<add /><modify>${changedAnnotation}</modify><delete />`;
	  } else if (action === 'delete') {
	    xfdfString += `<add /><modify /><delete>${changedAnnotation}</delete>`;
	  }
	  xfdfString += `</xfdf>`;
	  return xfdfString;
	}

	// helper function to send annotation changes to WebSocket server
	const sendAnnotationChange = (annotation, action) => {
	  if (annotation.nodeType !== annotation.TEXT_NODE) {
	    const annotationString = serializer.serializeToString(annotation);
	    connection.send({
	      documentId: DOCUMENT_ID,
	      annotationId: annotation.getAttribute('name'),
	      xfdfString: convertToXfdf(annotationString, action),
	      mType: "AnnotationType",
	    });
	  }
	}

	function sendMessageIfOnline(message={})
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

    function fileCall(data)
	{
		console.log('recieved ',data);
		customViewer(data.data[0], connection, roomId);
		$(".customProgressBarDiv").css('visibility', 'hidden');
	}
	window.addEventListener("unhandledrejection", event => {
  		console.warn(`UNHANDLED PROMISE REJECTION: ${event.reason}`);
	});
}