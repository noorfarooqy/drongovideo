$(document).ready(function(event) {

    $('#dlg').dialog('close');
    $('#invite').dialog('close');
    $('#ancStartChat').bind('click', function() {
        $('#dlg').dialog('open'); 
    });
    
    window.onbeforeunload = function() {
        return "Leaving this page may cause loss of your work!";
    };
    $('.subProperties').hide();

    var eraserFlag = false;
    var eraserColor = '';
    var eraserArray = new Array;
    var totCount = 0;
    var totArray = new Array;
    var canvasBoard = $('canvas#canvasBoard');
    var gcanvas = new fabric.Canvas('canvasBoard', {
        isDrawingMode: true,
        backgroundColor: '#ffffff'
    });
    fabric.Object.prototype.transparentCorners = false;
    gcanvas.setHeight($('#center').height());
    gcanvas.setWidth($('#center').width());
    gcanvas.freeDrawingBrush.color = '#000000';
    gcanvas.freeDrawingBrush.width = 2;

    $("#cc").layout('panel', 'east').panel({
        onExpand: function() {
            gcanvas.setWidth($('#center').width() - 220);
            gcanvas.renderAll();
        },
        onCollapse: function() {
            gcanvas.setWidth($('#center').width());
            gcanvas.renderAll();
        }
    });

    /* Background Color */

    $('#ancBackground').click(function() {
        $('.subProperties').hide();
        $("#cc").layout('panel', 'east').panel({
            //title:'Background',
            //iconCls:'icon-bgcolor'
        });
        gcanvas.isDrawingMode = false;
        gcanvas.forEachObject(function(obj) {
            obj.set({
                hasControls: false,
                hasBorders: false,
                selectable: false
            });
        });
        gcanvas.renderAll();
      $('#bgColorpick').show();
        

    });
    $('.clsBgColor').click(function() {
        var bgclr = $(this).children().css('background-color');
        bgclr = rgb2hex(bgclr);
        if (eraserFlag) {
            gcanvas.forEachObject(function(obj) {
                if (typeof obj.stroke == 'object') {
                    obj.stroke = '#ffffff';
                } else {
                    if (obj.stroke != eraserColor) {
                        if (obj.stroke == '#ffffff' || obj.stroke == '#fff') {
                            obj.stroke = bgclr;
                            eraserColor = bgclr;
                        } else {
                            eraserColor = bgclr;
                        }
                    } else {
                        obj.stroke = bgclr;
                    }
                }
            });
        }
        gcanvas.setBackgroundImage('');
        gcanvas.setBackgroundColor('');
        $('#txtBgColorVal').val(bgclr);
        gcanvas.setBackgroundColor(bgclr);
        gcanvas.renderAll();
    });

    function clearSlide() {
        if (gcanvas.getObjects().length > 0) {
            gcanvas.clear();
            gcanvas.freeDrawingBrush.width = 2;
            gcanvas.freeDrawingBrush.color = '#000000';
            eraserFlag = false;
            gcanvas.renderAll();
            $('#lineSlide').numberspinner({
                value: 2
            });
            $('#eraserSlide').numberspinner({
                value: 2
            });
            $('#txtPencilClrVal').val('#000000');
            $('#txtPencilClrHexa').val('#000000');
            $('#txtShapeOutline').val(2);
            $('#txtShapeOutlineHexavalue').val('#000000');
            $('#txtShapeOutlineClrVal').val('#000000');
            $('#txtFillClrVal').val('#000000');
            $('#txtFillClrHexa').val('#000000');
            txtNum = 1;
            shapenum = 1;
        }
    }

    function displaySlide(src) {
        if (!(src.length > 0)) {
            return false;
        }
        var imgObj = new Image();
        imgObj.crossOrigin = "Anonymous";
        imgObj.onload = function() {
            var image = new fabric.Image(imgObj);
            gcanvas.setBackgroundColor('#ffffff');
            gcanvas.setBackgroundImage(image, gcanvas.renderAll.bind(gcanvas), {
                scaleY: gcanvas.height / image.height,
                scaleX: gcanvas.width / image.width,
                backgroundImageStretch: true
            });
        }
        imgObj.src = src;
        $('img[seq]').attr("style", "border:1px solid #ccc");
        $('img[seq="' + slideSeq + '"]').attr("style", "border:2px solid #407450");
    }
    var slideSeq = 0,
        maxSeq = 0,
        slideSrc = "",
        baseURL = "";
    $(document).on("click", '#south .clsBgColor img', function(event) {
        slideSrc = $(this).attr("alt");
        slideSeq = parseInt($(this).attr("seq"));
        maxSeq = parseInt($(this).attr("max"));
        baseURL = $(this).attr("base");
        clearSlide();
        displaySlide(slideSrc);
    });
    $(document).keydown(function(e) {
        /* Previous slide */
        if (e.keyCode == 37 || e.keyCode == 40) {
            if (slideSeq > 0) {
                slideSeq = slideSeq - 1;
                slideSrc = baseURL + "/" + "slide-" + slideSeq + ".jpg";
                clearSlide();
                displaySlide(slideSrc);
            }
            return false;
        }
    });
    $(document).keydown(function(e) {
        /* Next slide */
        if (e.keyCode == 38 || e.keyCode == 39) {
            if (slideSeq < maxSeq - 1) {
                slideSeq = slideSeq + 1;
                slideSrc = baseURL + "/" + "slide-" + slideSeq + ".jpg";
                clearSlide();
                displaySlide(slideSrc);
            }
            return false;
        }
    });
    $('#txtBgColorVal').change(function() {
        var bgclr = $(this).val();
        if (eraserFlag) {
            gcanvas.forEachObject(function(obj) {
                if (typeof obj.stroke == 'object') {
                    obj.stroke = '#ffffff';
                } else {
                    if (obj.stroke != eraserColor) {
                        eraserColor = bgclr;
                    } else {
                        obj.stroke = bgclr;
                    }
                }
            });
        }
        gcanvas.setBackgroundImage('');
        gcanvas.setBackgroundColor('');
        gcanvas.setBackgroundColor(bgclr);
        gcanvas.renderAll();
    });

    $('.bgclpkr').click(function() {
        var src = $(this).children().attr('src');
        gcanvas.setBackgroundImage('');
        gcanvas.setBackgroundColor('');
        gcanvas.setBackgroundColor({
            source: src,
            repeat: 'repeat'
        }, function() {
            gcanvas.renderAll();
        });
        slideSrc = "";
        /*  if(eraserFlag)
         {  
            gcanvas.forEachObject(function(obj){
               if(typeof obj.stroke == 'object'){   
                   obj.stroke = '#ffffff';  
               } else {
                  if(eraserArray.indexOf(obj.stroke) != -1){             
                     obj.stroke = '#ffffff';
                  } 
               } 
            });           
         }    */
    });
    $('#btnUploadPattern').click(function() {
        $('#filePattern').trigger('click');
    });
    $('#filePattern').change(function(e) {
        var file = $('#filePattern').val();
        var exts = ['jpg', 'jpeg', 'png'];
        if (file.length <= 0) {
            alert("Please select a file from local drive.");
            $('#filePattern').focus();
            return false;
        }
        var ext = file.split('.');
        ext = ext.reverse();
        if ($.inArray(ext[0].toLowerCase(), exts) < 0) {
            alert("Please select jpg/jpeg/png format files only.");
            $('#filePattern').focus();
            return false;
        }
        var reader = new FileReader();
        reader.onload = function(event) {
            var imgObj = new Image;
            imgObj.src = event.target.result;
            imgObj.onload = function() {
                var image = new fabric.Image(imgObj);
                gcanvas.setBackgroundColor('#ffffff');
                gcanvas.setBackgroundImage(image, gcanvas.renderAll.bind(gcanvas), {
                    scaleY: gcanvas.height / image.height,
                    scaleX: gcanvas.width / image.width
                });
                slideSrc = "";
            }
        }
        reader.readAsDataURL(e.target.files[0]);
    });

    /* Pencil */

    $('#ancPencil').click(function() {
        readdFlag = 0;
        $("#cc").layout('panel', 'east').panel({
            //title:'Pencil',
            //iconCls:'icon-pencil'
        });
        eraserFlag = false;
        gcanvas.isDrawingMode = true;
        gcanvas.freeDrawingBrush.color = $('#txtPencilClrVal').val();
        gcanvas.freeDrawingBrush.width = $('#lineSlide').val();
        gcanvas.forEachObject(function(obj) {
            obj.set({
                hasControls: false,
                hasBorders: false,
                selectable: false
            });
        });
        gcanvas.renderAll();
        $('.subProperties').hide();
        /*
              if( $("#cc").layout('panel','east').panel('options').collapsed ){
                 $('#cc').layout('expand','east');
              }
        */
        $('#penEdit').show();
    });
    $('.clsPencilColor').click(function() {
        var pclr = $(this).children().css('background-color');
        pclr = rgb2hex(pclr);
        $('#txtPencilClrVal').val(pclr);
        $('#txtPencilClrHexa').val(pclr);
        gcanvas.freeDrawingBrush.color = pclr;
        gcanvas.renderAll();
    });

    function rgb2hex(rgb) {
        rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
        return (rgb && rgb.length === 4) ? "#" +
            ("0" + parseInt(rgb[1], 10).toString(16)).slice(-2) +
            ("0" + parseInt(rgb[2], 10).toString(16)).slice(-2) +
            ("0" + parseInt(rgb[3], 10).toString(16)).slice(-2) : '';
    }
    $('#lineSlide').numberspinner({
        min: 1,
        max: 50,
        increment: 1,
        editable: true,
        value: 2,
        onChange: function(nv) {
            gcanvas.freeDrawingBrush.color = $('#txtPencilClrVal').val();
            gcanvas.freeDrawingBrush.width = parseInt(nv);
            gcanvas.renderAll();
        }
    });
    $('#txtPencilClrVal').change(function() {
        $('#txtPencilClrHexa').val($(this).val());
        gcanvas.freeDrawingBrush.color = $(this).val();
        gcanvas.renderAll();
    });
    $('#txtPencilClrHexa').keyup(function() {
        $('#txtPencilClrVal').val($(this).val());
        gcanvas.freeDrawingBrush.color = $(this).val();
        gcanvas.renderAll();
    });

    /* Eraser */
    $('#ancEraser').click(function() {
        eraserFlag = true;
        if (typeof gcanvas.backgroundColor == 'object') {
            eraserColor = '#ffffff';
        } else {
            eraserColor = gcanvas.backgroundColor;
        }
        $("#cc").layout('panel', 'east').panel({
            // title:'Eraser',
            //iconCls:'icon-eraser'
        });
        eraserArray.push(eraserColor);
        gcanvas.freeDrawingBrush.color = eraserColor;
        gcanvas.freeDrawingBrush.width = $('#eraserSlide').val();
        gcanvas.isDrawingMode = true;
        gcanvas.forEachObject(function(obj) {
            obj.set({
                hasControls: false,
                hasBorders: false,
                selectable: false
            });
        });
        gcanvas.renderAll();
        $('.subProperties').hide();
        /*
              if( $("#cc").layout('panel','east').panel('options').collapsed ){
                 $('#cc').layout('expand','east');
              }
        */
        $('#eraseOptions').show();
    });

    $('#eraserSlide').numberspinner({
        min: 1,
        max: 50,
        increment: 1,
        editable: true,
        value: 2,
        onChange: function(nv) {
            eraserFlag = true;
            eraserColor = gcanvas.backgroundColor;
            gcanvas.freeDrawingBrush.color = eraserColor;
            gcanvas.freeDrawingBrush.width = parseInt(nv);
            gcanvas.renderAll();
        }
    });

    /* Shapes */

    var shapeArry = new Array();
    var shapenum = 1;
    $('#ancShape').click(function() {
        $("#cc").layout('panel', 'east').panel({
            //title:'Shapes',
            //iconCls:'icon-shapes'
        });
        eraserFlag = false;
        gcanvas.isDrawingMode = false;
        gcanvas.forEachObject(function(obj) {
            obj.set({
                hasControls: false,
                hasBorders: false,
                selectable: false
            });
        });
        gcanvas.renderAll();
        $('.subProperties').hide();
        /*
              if( $("#cc").layout('panel','east').panel('options').collapsed ){
                 $('#cc').layout('expand','east');
              }
        */
        $('#shapeOptions').show();
        if (shapenum > 1) {
            for (var i = 1; i <= shapenum - 1; i++) {
                shapeArry[i].set({
                    hasControls: true,
                    hasBorders: true,
                    selectable: true
                });
            }
        }
    });
    $('.shapeFillColor').click(function() {
        var fclr = $(this).children().css('background-color');
        fclr = rgb2hex(fclr);
        $('#txtFillClrVal').val(fclr);
        $('#txtFillClrHexa').val(fclr);
        var cobj = gcanvas.getActiveObject();
        cobj.setFill(fclr);
        gcanvas.renderAll();
    });
    $('#shapeRect').click(function() {
        addRect(shapenum);
        shapenum++;
    });
    $('#shapeSquare').click(function() {
        addSquare(shapenum);
        shapenum++;
    });
    $('#shapeCircle').click(function() {
        addCircle(shapenum);
        shapenum++;
    });
    $('#shapeTriangle').click(function() {
        addTriangle(shapenum);
        shapenum++;
    });
    $('#shapeLine').click(function() {
        addLine(shapenum);
        shapenum++;
    });
    $('#shapeEllipse').click(function() {
        addEllipse(shapenum);
        shapenum++;
    });

    function addRect(shapenum) {
        shapeArry[shapenum] = new fabric.Rect({
            width: 200,
            height: 100,
            left: 50,
            top: 50,
            fill: '',
            stroke: '#000000',
            strokeWidth: 2
        });
        shapeArry[shapenum].on('selected', function(e) {
            $('#txtFillClrVal').val(this.getFill());
            $('#txtFillClrHexa').val(this.getFill());
            $('#txtShapeOutline').val(this.getStrokeWidth());
            $('#txtShapeOutlineClrVal').val(this.getStroke());
            $('#txtShapeOutlineHexavalue').val(this.getStroke());
            gcanvas.bringForward(this);
        });
        gcanvas.add(shapeArry[shapenum]);
        gcanvas.centerObject(shapeArry[shapenum]);
        shapeArry[shapenum].setCoords();
        gcanvas.setActiveObject(shapeArry[shapenum]);
        gcanvas.renderAll();
    };

    function addSquare(shapenum) {
        shapeArry[shapenum] = new fabric.Rect({
            width: 100,
            height: 100,
            left: 150,
            top: 50,
            fill: '',
            stroke: '#000000',
            strokeWidth: 2
        });
        shapeArry[shapenum].on('selected', function(e) {
            $('#txtFillClrVal').val(this.getFill());
            $('#txtFillClrHexa').val(this.getFill());
            $('#txtShapeOutline').val(this.getStrokeWidth());
            $('#txtShapeOutlineClrVal').val(this.getStroke());
            $('#txtShapeOutlineHexavalue').val(this.getStroke());
            gcanvas.bringForward(this);
        });
        gcanvas.add(shapeArry[shapenum]);
        gcanvas.centerObject(shapeArry[shapenum]);
        shapeArry[shapenum].setCoords();
        gcanvas.setActiveObject(shapeArry[shapenum]);
        gcanvas.renderAll();
    };

    function addCircle(shapenum) {
        shapeArry[shapenum] = new fabric.Circle({
            radius: 50,
            fill: '',
            stroke: '#000000',
            strokeWidth: 2
        });
        shapeArry[shapenum].on('selected', function(e) {
            $('#txtFillClrVal').val(this.getFill());
            $('#txtFillClrHexa').val(this.getFill());
            $('#txtShapeOutline').val(this.getStrokeWidth());
            $('#txtShapeOutlineClrVal').val(this.getStroke());
            $('#txtShapeOutlineHexavalue').val(this.getStroke());
            gcanvas.bringForward(this);
        });
        gcanvas.add(shapeArry[shapenum]);
        gcanvas.centerObject(shapeArry[shapenum]);
        shapeArry[shapenum].setCoords();
        gcanvas.setActiveObject(shapeArry[shapenum]);
        gcanvas.renderAll();
    };

    function addTriangle(shapenum) {
        shapeArry[shapenum] = new fabric.Triangle({
            width: 100,
            height: 100,
            fill: '',
            stroke: '#000000',
            strokeWidth: 2
        });
        shapeArry[shapenum].on('selected', function(e) {
            $('#txtFillClrVal').val(this.getFill());
            $('#txtFillClrHexa').val(this.getFill());
            $('#txtShapeOutline').val(this.getStrokeWidth());
            $('#txtShapeOutlineClrVal').val(this.getStroke());
            $('#txtShapeOutlineHexavalue').val(this.getStroke());
            gcanvas.bringForward(this);
        });
        gcanvas.add(shapeArry[shapenum]);
        gcanvas.centerObject(shapeArry[shapenum]);
        shapeArry[shapenum].setCoords();
        gcanvas.setActiveObject(shapeArry[shapenum]);
        gcanvas.renderAll();
    };

    function addLine(shapenum) {
        shapeArry[shapenum] = new fabric.Line([0, 0, 200, 0], {
            fill: '#000000',
            stroke: '#000000',
            strokeWidth: 2
        });
        shapeArry[shapenum].on('selected', function(e) {
            $('#txtFillClrVal').val(this.getFill());
            $('#txtFillClrHexa').val(this.getFill());
            $('#txtShapeOutline').val(this.getStrokeWidth());
            $('#txtShapeOutlineClrVal').val(this.getStroke());
            $('#txtShapeOutlineHexavalue').val(this.getStroke());
            gcanvas.bringForward(this);
        });
        gcanvas.add(shapeArry[shapenum]);
        gcanvas.centerObject(shapeArry[shapenum]);
        shapeArry[shapenum].setCoords();
        gcanvas.setActiveObject(shapeArry[shapenum]);
        gcanvas.renderAll();
    };

    function addEllipse(shapenum) {
        shapeArry[shapenum] = new fabric.Ellipse({
            fill: '',
            stroke: '#000000',
            strokeWidth: 2,
            rx: 100,
            ry: 50
        });
        shapeArry[shapenum].on('selected', function(e) {
            $('#txtFillClrVal').val(this.getFill());
            $('#txtFillClrHexa').val(this.getFill());
            $('#txtShapeOutline').val(this.getStrokeWidth());
            $('#txtShapeOutlineClrVal').val(this.getStroke());
            $('#txtShapeOutlineHexavalue').val(this.getStroke());
            gcanvas.bringForward(this);
        });
        gcanvas.add(shapeArry[shapenum]);
        gcanvas.centerObject(shapeArry[shapenum]);
        shapeArry[shapenum].setCoords();
        gcanvas.setActiveObject(shapeArry[shapenum]);
        gcanvas.renderAll();
    };

    $('#txtFillClrHexa').keyup(function() {
        $('#txtFillClrVal').val($(this).val());
        var cobj = gcanvas.getActiveObject();
        cobj.setFill($(this).val());
        gcanvas.renderAll();
    });
    $('#txtFillClrVal').change(function() {
        $('#txtFillClrHexa').val($(this).val());
        var cobj = gcanvas.getActiveObject();
        cobj.setFill($(this).val());
        gcanvas.renderAll();
    });
    $('#txtShapeOutline').keyup(function() {
        var cobj = gcanvas.getActiveObject();
        cobj.set({
            strokeWidth: parseInt($(this).val())
        });
        gcanvas.renderAll();
    });
    $('#txtShapeOutlineHexavalue').keyup(function() {
        $('#txtShapeOutlineClrVal').val($(this).val());
        var cobj = gcanvas.getActiveObject();
        cobj.setStroke($(this).val());
        gcanvas.renderAll();
    });
    $('#txtShapeOutlineClrVal').change(function() {
        $('#txtShapeOutlineHexavalue').val($(this).val());
        var cobj = gcanvas.getActiveObject();
        cobj.setStroke($(this).val());
        gcanvas.renderAll();
    });

    $('.clrDynamicCanvas').click(function() {
        if (gcanvas.getObjects().length > 0) {
            var confirmFlag = confirm("Do you really want to clear the board?");
            if (confirmFlag == true) {
                gcanvas.clear();
                gcanvas.freeDrawingBrush.width = 2;
                gcanvas.freeDrawingBrush.color = '#000000';
                eraserFlag = false;
                gcanvas.renderAll();
                $('#lineSlide').numberspinner({
                    value: 2
                });
                $('#eraserSlide').numberspinner({
                    value: 2
                });
                $('#txtPencilClrVal').val('#000000');
                $('#txtPencilClrHexa').val('#000000');
                $('#txtShapeOutline').val(2);
                $('#txtShapeOutlineHexavalue').val('#000000');
                $('#txtShapeOutlineClrVal').val('#000000');
                $('#txtFillClrVal').val('#000000');
                $('#txtFillClrHexa').val('#000000');
                txtNum = 1;
                shapenum = 1;
            }
        }
    });

    $('#btnRemoveShape').click(function() {
        var cobj = gcanvas.getActiveObject();
        gcanvas.remove(cobj);
        gcanvas.renderAll();
        $('#txtShapeOutline').val(2);
        $('#txtShapeOutlineHexavalue').val('#000000');
        $('#txtShapeOutlineClrVal').val('#000000');
        $('#txtFillClrVal').val('#000000');
        $('#txtFillClrHexa').val('#000000');
    });

    

    /* Text */

    var txtNum = 1;
    var iTextArr = new Array();
    var textArr = new Array();
    var fontArr = new Array();
    var alignArr = new Array();
    var styleArr = new Array();
    var sizeArr = new Array();
    var colorArr = new Array();

    $('#ancText').click(function() {
        $("#cc").layout('panel', 'east').panel({
            //  title:'Text',
            // iconCls:'icon-text'
        });
        eraserFlag = false;
        gcanvas.isDrawingMode = false;
        gcanvas.forEachObject(function(obj) {
            obj.set({
                hasControls: false,
                hasBorders: false,
                selectable: false
            });
        });
        gcanvas.renderAll();
        $('.subProperties').hide();

        $('#textOptions').show();
        if (txtNum > 1) {
            for (var i = 1; i <= txtNum - 1; i++) {
                iTextArr[i].set({
                    hasControls: true,
                    hasBorders: true,
                    selectable: true
                });
            }
        }
        addText(txtNum);
        txtNum++;
    });

    function addText(num) {
        textArr[num] = 'Sample Text';
        fontArr[num] = 'Times New Roman';
        alignArr[num] = 'left';
        sizeArr[num] = '20';
        styleArr[num] = 'normal';
        colorArr[num] = '#ff0000';
        $('.divStyleBold i, .divStyleItalic i').css({
            'background-color': "#ffffff",
            'color': '#000000'
        });
        $('.divAlign i').css({
            'background-color': "#ffffff",
            'color': '#000000'
        });
        $('#alignleft i').css({
            'background-color': "#424242",
            'color': '#ffffff'
        });
        iTextArr[num] = new fabric.IText(textArr[num], {
            fill: colorArr[num],
            hasControls: true,
            hasBorders: true,
            hasRotatingPoint: true
        });
        iTextArr[num].set({
            fontFamily: fontArr[num],
            textAlign: alignArr[num],
            fontStyle: styleArr[num],
            fontSize: sizeArr[num],
            padding: 5
        });
        iTextArr[num].on('selected', function(e) {
            $('#txtStyle').val(this.getFontFamily());
            $('#txtText').val(this.getText());
            $('#txtTextSize').val(this.getFontSize());
            $('#txtClrVal').val(this.getFill());
            $('#txtHexavalue').val(this.getFill());
            $('#txtOutline').val(this.getStrokeWidth());
            $('#txtOutlineClrVal').val(this.getStroke());
            $('#txtOutlineHexavalue').val(this.getStroke());
            $('#txtBGClrVal').val(this.getTextBackgroundColor());
            $('#txtBGHexavalue').val(this.getTextBackgroundColor());
            var alignopt = this.getTextAlign();
            var styleopt = this.getFontStyle();
            var weightopt = this.getFontWeight();
            $('.divAlign i').css({
                'background-color': "#ffffff",
                'color': '#000000'
            });
            $('#align' + alignopt + ' i').css({
                'background-color': "#424242",
                'color': '#ffffff'
            });
            $('.divStyleBold i').css({
                'background-color': "#ffffff",
                'color': '#000000'
            });
            $('#style' + weightopt + ' i').css({
                'background-color': "#424242",
                'color': '#ffffff'
            });
            $('.divStyleItalic i').css({
                'background-color': "#ffffff",
                'color': '#000000'
            });
            $('#style' + styleopt + ' i').css({
                'background-color': "#424242",
                'color': '#ffffff'
            });
        });
        gcanvas.on('text:changed', function(e) {
            var cobj = gcanvas.getActiveObject();
            $('#txtText').val(cobj.getText());
        });
        gcanvas.add(iTextArr[num]);
        gcanvas.setActiveObject(iTextArr[num]);
        gcanvas.centerObject(iTextArr[num]);
        iTextArr[num].setCoords();
        gcanvas.renderAll();
    }
    $('#btnNewText').click(function() {
        addText(txtNum);
        txtNum++;
    });
    $('#btnRemoveText').click(function() {
        var cobj = gcanvas.getActiveObject();
        gcanvas.remove(cobj);
        $('.divStyleBold i, .divStyleItalic i').css({
            'background-color': "#ffffff",
            'color': '#000000'
        });
        $('.divAlign i').css({
            'background-color': "#ffffff",
            'color': '#000000'
        });
        $('#alignleft i').css({
            'background-color': "#424242",
            'color': '#ffffff'
        });
        $('#txtStyle').val('Times New Roman');
        $('#txtText').val('Sample Text');
        $('#txtTextSize').val(20);
        $('#txtClrVal').val('#ff0000');
        $('#txtHexavalue').val('#ff0000');
        $('#txtOutline').val(1);
        $('#txtOutlineClrVal').val('#000000');
        $('#txtOutlineHexavalue').val('#000000');
        $('#txtBGClrVal').val('#000000');
        $('#txtBGHexavalue').val('#000000');
    });
    $('#txtStyle').change(function() {
        var cobj = gcanvas.getActiveObject();
        cobj.set({
            fontFamily: $(this).val()
        });
        gcanvas.renderAll();
    });
    var flagAlign = 1;
    $('.divAlign').click(function() {
        $('.divAlign i').css({
            'background-color': "#ffffff",
            'color': '#000000'
        });
        $(this).find('i').css({
            'background-color': "#424242",
            'color': '#ffffff'
        });
        var cobj = gcanvas.getActiveObject();
        var v = $(this).attr('data-opt');
        cobj.set({
            textAlign: v
        });
        gcanvas.renderAll();
    });
    var flagBold = 0;
    var flagItalic = 0;
    $('.divStyleBold').click(function() {
        var cobj = gcanvas.getActiveObject();
        if (flagBold) {
            flagBold = 0;
            if (flagItalic == 1) {
                cobj.set({
                    fontStyle: 'italic',
                    fontWeight: ''
                });
            } else {
                cobj.set({
                    fontStyle: 'normal',
                    fontWeight: ''
                });
            }
            $('.divStyleBold i').css({
                'background-color': "#ffffff",
                'color': '#000000'
            });
        } else {
            flagBold = 1;
            if (flagItalic == 1) {
                cobj.set({
                    fontStyle: 'italic',
                    fontWeight: 'bold'
                });
            } else {
                cobj.set({
                    fontStyle: 'normal',
                    fontWeight: 'bold'
                });
            }
            $('.divStyleBold i').css({
                'background-color': "#424242",
                'color': '#ffffff'
            });
        }
        gcanvas.renderAll();
    });
    $('.divStyleItalic').click(function() {
        var cobj = gcanvas.getActiveObject();
        if (flagItalic == 1) {
            flagItalic = 0;
            if (flagBold == 1) {
                cobj.set({
                    fontStyle: '',
                    fontWeight: 'bold'
                });
            } else {
                cobj.set({
                    fontStyle: '',
                    fontWeight: 'normal'
                });
            }
            $('.divStyleItalic i').css({
                'background-color': "#ffffff",
                'color': '#000000'
            });
        } else {
            flagItalic = 1;
            if (flagBold == 1) {
                cobj.set({
                    fontStyle: 'italic',
                    fontWeight: 'bold'
                });
            } else {
                cobj.set({
                    fontStyle: 'italic',
                    fontWeight: 'normal'
                });
            }
            $('.divStyleItalic i').css({
                'background-color': "#424242",
                'color': '#ffffff'
            });
        }
        gcanvas.renderAll();
    });
    $('#txtText').keyup(function() {
        var cobj = gcanvas.getActiveObject();
        cobj.setText($(this).val());
        gcanvas.renderAll();
    });
    $('#txtTextSize').keyup(function() {
        var cobj = gcanvas.getActiveObject();
        cobj.setFontSize($(this).val());
        gcanvas.renderAll();
    });
    $('#txtHexavalue').keyup(function() {
        $('#txtClrVal').val($(this).val());
        var cobj = gcanvas.getActiveObject();
        cobj.setFill($(this).val());
        gcanvas.renderAll();
    });
    $('#txtClrVal').change(function() {
        $('#txtHexavalue').val($(this).val());
        var cobj = gcanvas.getActiveObject();
        cobj.setFill($(this).val());
        gcanvas.renderAll();
    });
    $('#txtBGHexavalue').keyup(function() {
        $('#txtBGClrVal').val($(this).val());
        var cobj = gcanvas.getActiveObject();
        cobj.setTextBackgroundColor($(this).val());
        gcanvas.renderAll();
    });
    $('#txtBGClrVal').change(function() {
        $('#txtBGHexavalue').val($(this).val());
        var cobj = gcanvas.getActiveObject();
        cobj.setTextBackgroundColor($(this).val());
        gcanvas.renderAll();
    });

    $('#txtOutlineHexavalue').keyup(function() {
        $('#txtOutlineClrVal').val($(this).val());
        var cobj = gcanvas.getActiveObject();
        var sval = $('#txtOutline').val();
        cobj.set({
            stroke: $(this).val(),
            strokeWidth: sval
        });
        gcanvas.renderAll();
    });
    $('#txtOutlineClrVal').change(function() {
        $('#txtOutlineHexavalue').val($(this).val());
        var cobj = gcanvas.getActiveObject();
        var sval = $('#txtOutline').val();
        cobj.set({
            stroke: $(this).val(),
            strokeWidth: sval
        });
        gcanvas.renderAll();
    });
    $('#txtOutline').keyup(function() {
        var cobj = gcanvas.getActiveObject();
        var sval = $('#txtOutlineHexavalue').val();
        cobj.set({
            strokeWidth: $(this).val(),
            stroke: sval
        });
        gcanvas.renderAll();
    });

    

    /* Image */

    $('#ancImage').click(function() {
        $('#fileImage').trigger('click');
        $("#cc").layout('panel', 'east').panel({
            // title:'Image',
            // iconCls:'icon-image'
        });
        eraserFlag = false;
        gcanvas.isDrawingMode = false;
        gcanvas.forEachObject(function(obj) {
            if (typeof obj == 'object' && !obj.hasOwnProperty('minScaleLimit') && !obj.hasOwnProperty('text') && !obj.hasOwnProperty('stroke')) {
                obj.set({
                    hasControls: true,
                    hasBorders: true,
                    selectable: true
                });
            } else {
                obj.set({
                    hasControls: false,
                    hasBorders: false,
                    selectable: false
                });
            }

        });
        gcanvas.renderAll();
        $('.subProperties').hide();
        /*
              if( $("#cc").layout('panel','east').panel('options').collapsed ){
                 $('#cc').layout('expand','east');
              }
        */
        $('#imageOptions').show();
    });
    $('#btnNewImage').click(function() {
        $('#fileImage').trigger('click');
    });
    $('#fileImage').change(function(e) {
        var file = $('#fileImage').val();
        var exts = ['jpg', 'jpeg', 'png'];
        if (file.length <= 0) {
            alert("Please select a file from local drive.");
            $('#fileImage').focus();
            return false;
        }
        var ext = file.split('.');
        ext = ext.reverse();
        if ($.inArray(ext[0].toLowerCase(), exts) < 0) {
            alert("Please select jpg/jpeg/png format files only.");
            $('#fileImage').focus();
            return false;
        }
        var reader = new FileReader();
        reader.onload = function(event) {
            var imgObj = new Image;
            imgObj.src = event.target.result;
            imgObj.onload = function() {
                var image = new fabric.Image(imgObj);
                gcanvas.add(image);
                gcanvas.centerObject(image);
                gcanvas.setActiveObject(image);
                image.setCoords();
                gcanvas.renderAll();
            }
        }
        reader.readAsDataURL(e.target.files[0]);
    });
    $('#btnRemoveImage').click(function() {
        var cobj = gcanvas.getActiveObject();
        gcanvas.remove(cobj);
        gcanvas.renderAll();
    });

    /* Undo/Redo */

    var reflag = false;
    var cstep = 0;
    var i = 0;
    gcanvas.on('object:added', function(opt) {
        totArray[i] = opt.target;
        i++;
    });

    function doUndo() {
        if (i > 0) {
            reflag = true;
            gcanvas.remove(totArray[i - 1]);
            i--;
        }
    }
    $('#ancUndo').click(function() {
        doUndo();
    });

    function doRedo() {
        if (i < totArray.length) {
            gcanvas.add(totArray[i]);
            if (!reflag) {
                i++;
            }
        }
    }
    $('#ancRedo').click(function() {
        doRedo();
    });
    $(document).keydown(function(e) {
        //e.preventDefault();
        if (e.which == 90 && (e.metaKey && e.shiftKey)) {
            e.preventDefault();
            doRedo();
        } else if (e.which == 89 && e.ctrlKey) {
            e.preventDefault();
            doRedo();
        } else if (e.which == 90 && e.ctrlKey) {
            e.preventDefault();
            doUndo();
        } else if (e.which == 90 && e.metaKey) {
            e.preventDefault();
            doUndo();
        } else if (e.which == 187 && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            if (eraserFlag) {
                var penSize = parseInt($('#eraserSlide').numberspinner('getValue'));
                penSize++;
                $('#eraserSlide').numberspinner('setValue', penSize);
            } else {
                var penSize = parseInt($('#lineSlide').numberspinner('getValue'));
                penSize++;
                $('#lineSlide').numberspinner('setValue', penSize);
            }
        } else if (e.which == 189 && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            if (eraserFlag) {
                var penSize = parseInt($('#eraserSlide').numberspinner('getValue'));
                penSize--;
                $('#eraserSlide').numberspinner('setValue', penSize);
            } else {
                var penSize = parseInt($('#lineSlide').numberspinner('getValue'));
                penSize--;
                $('#lineSlide').numberspinner('setValue', penSize);
            }
        }
    });
    /* Help */
    var panels = $('.easyui-accordion').accordion('panels');
    $.each(panels, function() {
        this.panel('collapse');
    });
    $('#ancHelpMain').click(function() {
    	if($(this).attr('status') === "on")
    	{

    		$(this).attr('status', 'off');
    		$('#helpOptions').css("display", "none");
    		
    	}
    	else
    	{
    		$(this).attr('status', 'on');
	        
	        
	        $('#helpOptions').css("display", "none");
    	}	
    });
    $('#helpWindow').window('close');
    
    $(document).click(function(){
        var $el = $("#helpOptions");
         if ($el.is(":visible")) {
            $('#helpOptions').css("display", "none");
            $('#helpWindow').window('close');
         }
    });
    $('.ancHelp').click(function(event) {
        $('#helpOptions').css("display", "none");
        event.stopPropagation();
        $('#helpWindow').window('close');
        // var imgsrc = window.href+ $(this).attr('alt') + '.jpg';
        $('#helpWindow img').attr('src', 'imgsrc');
        $('#helpWindow').window('open');
    });
    $('html').keyup(function(e) {
        if (e.keyCode == 46 || e.keyCode == 8) {
            var cobj = gcanvas.getActiveObject();
            if(cobj.hasOwnProperty("text")){
               return;
            }
            gcanvas.remove(cobj);
            $('.divStyleBold i, .divStyleItalic i').css({
                'background-color': "#ffffff",
                'color': '#000000'
            });
            $('.divAlign i').css({
                'background-color': "#ffffff",
                'color': '#000000'
            });
            $('#alignleft i').css({
                'background-color': "#424242",
                'color': '#ffffff'
            });
            $('#txtStyle').val('Times New Roman');
            $('#txtText').val('Sample Text');
            $('#txtTextSize').val(20);
            $('#txtClrVal').val('#ff0000');
            $('#txtHexavalue').val('#ff0000');
            $('#txtOutline').val(1);
            $('#txtOutlineClrVal').val('#000000');
            $('#txtOutlineHexavalue').val('#000000');
            $('#txtBGClrVal').val('#000000');
            $('#txtBGHexavalue').val('#000000');
            $('#txtShapeOutline').val(2);
            $('#txtShapeOutlineHexavalue').val('#000000');
            $('#txtShapeOutlineClrVal').val('#000000');
            $('#txtFillClrVal').val('#000000');
            $('#txtFillClrHexa').val('#000000');
            gcanvas.renderAll();
            e.preventDefault();
            return false;
        }
    });
    $('#maximize').click(function() {
        if (screenfull.enabled) {
            screenfull.toggle($('#stage')[0]);
        }
    });
    
    $("#cc").layout('panel', 'center').panel({
        onResize: function(w, h) {
            if (screenfull.isFullscreen) {
                gcanvas.setHeight(window.innerHeight);
                gcanvas.setWidth(window.innerWidth);
            } else {
                gcanvas.setHeight(h);
                gcanvas.setWidth(w);
            }
            displaySlide(slideSrc);
            gcanvas.calcOffset();
            gcanvas.forEachObject(function(o) {
                o.setCoords();
            });
            gcanvas.renderAll();
            console.log("resize is triggered++++++++++");
        }


        
            
    });
    $('#ancPattern').click(function() {
        $('.subProperties').hide();
        $("#cc").layout('panel', 'east').panel({
            //             title:'Pattern',
            //             iconCls:'icon-bgcolor'
        });
        $('#bgPattern').show();
    }); 
    $('#ancHelpMain').click(function(event) {
        event.stopPropagation();
        $('#helpOptions').show();
    });
    
    $('#btnDisplayMenu').hide();
    $('#btnShowMenu').click(function(event) {
        event.stopPropagation();
        $('#btnDisplayMenu').toggle();
    });    
    $(document).click(function() { 
         var $el = $("#btnDisplayMenu");
         if ($el.is(":visible")) {
            $el.toggle();
         }
    });
     $('#btnDisplayMenu').click(function(event) {
        event.stopPropagation();
        //$('#btnDisplayMenu').show();
    });     
   
    //prevent running events on buttons that are blocked for sometime
    $('.block-event').click(function(e){
        e.preventDefault();
        return;
    });
    $("#cc").layout('collapse', 'south');
    $("#cc").layout('collapse', 'east');
    ////////////////////////////////////////////
    
    $('#close_class').bind('click', function(){
        let confirmation = confirm('Are you sure you want to end the class?');
        if(confirmation)
        {
            connection.closeSocket();
            $('#messageBox').css('display', 'block');
            $('#close_class').css('display', 'none');
            alert('The class session has been terminated');
        }
    });
    $("#webrtcPanel").hide();
    $("#cc").css("visibility", "visible");

    $('#screenChange').click(function(){
    	if($('#viewCamera').attr("visibility") === "visible")
    	{
    		$("#chatCameraContainer").css("visibility", "hidden");
    		$('#viewCamera').attr('visibility', "hidden");
    	}
    	if($(this).attr("visibility") === "hidden" )
    	{
    		$("#viewer").css("visibility", "visible");
    		$(this).attr('visibility', "visible");
    	}
    	else
    	{
    		$("#viewer").css("visibility", "hidden");
    		$(this).attr('visibility', "hidden");
    	}

    });
    $('#viewCamera').click(function(){
    	if($('#screenChange').attr("visibility") === "visible")
    	{
    		$("#viewer").css("visibility", "hidden");
    		$('#screenChange').attr('visibility', "hidden");
    	}
    	if($(this).attr("visibility") === "hidden" )
    	{
    		$("#chatCameraContainer").css("visibility", "visible");
    		$(this).attr('visibility', "visible");
    	}
    	else
    	{
    		$("#chatCameraContainer").css("visibility", "hidden");
    		$(this).attr('visibility', "hidden");
    	}
    });
    $("#stage, .subProperties a, .db-nav a").on(" touchend touchmove keyup keypress click  mousedown keydown", function(e){
        var screenshot = gcanvas.toDataURL("image/png", 0.5);
        $("img#sharedCanvasImage").attr("src", screenshot);
    });
    $("#ancSelect").click(function(){
        // console.log("w")
        $('.subProperties').hide();
    })

});