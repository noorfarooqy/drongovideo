<template>
    <div class="card">
        <div class="card-header">
            Sharing File 
        </div>
        <div class="card-header">
            <nav class="navbar navbar-expand-lg navbar-light bg-light">
                <a class="navbar-brand" href="#">   </a>
                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>

                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav mr-auto">
                        <li class="nav-item active">
                            <a class="nav-link" href="#">
                                <img src="/editor_icons/font.svg" alt="Add Text" title="Add text" height="30px"
                                style="border:thin solid gray; padding:3px" />
                            </a>
                        </li>
                        <li class="nav-item active">
                            <a class="nav-link" href="#">
                                <img src="/editor_icons/bold.svg" alt="Bold text" title="Bold text" height="30px"
                                style="border:thin solid gray; padding:3px" />
                            </a>
                        </li>
                        <li class="nav-item active">
                            <a class="nav-link" href="#">
                                <img src="/editor_icons/italic.svg" alt="Italic Text" title="Italic text " height="30px"
                                style="border:thin solid gray; padding:3px" />
                            </a>
                        </li>
                        <li class="nav-item active">
                            <a class="nav-link" href="#">
                                <img src="/editor_icons/underline.svg" alt="Underline" title="Underline text" height="30px"
                                style="border:thin solid gray; padding:3px" />
                            </a>
                        </li>
                        <li class="nav-item active">
                            <a class="nav-link" href="#">
                                <img src="/editor_icons/full-moon.svg" alt="Circle" title="Circle" height="30px"
                                style="border:thin solid gray; padding:3px" />
                            </a>
                        </li>
                        <li class="nav-item active">
                            <a class="nav-link" href="#" @click="DrawRectangle">
                                <img src="/editor_icons/ratio.svg" alt="Rectangle" title="Ractangle" height="30px"
                                style="border:thin solid gray; padding:3px" />
                            </a>
                        </li>
                        <li class="nav-item active">
                            <a class="nav-link" href="#">
                                <img src="/editor_icons/photo-camera.svg" alt="Photo" height="30px"
                                style="border:thin solid gray; padding:3px" title="Photo camera"/>
                            </a>
                        </li>
                        <li class="nav-item active">
                            <a class="nav-link" href="#">
                                <img src="/editor_icons/video-player.svg" alt="Video" height="30px"
                                style="border:thin solid gray; padding:3px" title="Video "/>
                            </a>
                        </li>
                        <li class="nav-item active">
                            <a class="nav-link" href="#">
                                <img src="/editor_icons/eraser.svg" alt="Erasor" height="30px"
                                style="border:thin solid gray; padding:3px" title="Eraser"/>
                            </a>
                        </li>
                    </ul>
                </div>
            </nav>
        </div>
        <div class="card-body"  ref="cardHW">
            <canvas id="maincanvas" ref="canvas" style="padding-right:1.25rem"> </canvas>
        </div>
    </div>    
</template>
<script>
export default {
    data() {
        return {
            name: 'canvas',
            canvas: null,
            Draw:  {
                status: false,
                pen: {
                    type: null,
                    size: null,
                    position_x:null,
                    position_y:null,
                }
            }
        }

    },
    mounted(){
        var canvas = this.getCanvas();
        // var ctx = canvas.getContext('2d');
        // console.log('ctx ',ctx);
        this.canvas = new fabric.Canvas(canvas);
        var cardHW = this.$refs.cardHW;
        var width  = cardHW.clientWidth;
        var height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
        this.canvas.setHeight(height);
        this.canvas.setWidth(width);
        // this.canvas.renderAll();
        // this.makeRectangle();
        this.canvas.on('mouse:down',this.mouseDownCallback);
        this.canvas.on('mouse:up',this.mouseUpCallback);
        this.canvas.on('mouse:over',this.mouseOverCallback);
    },
    methods : {
        getCanvas()
        {
            return this.$refs.canvas
        },
        makeRectangle(x=100,y=100, w=20, h=20)
        {
            console.log('making rectangle x ',x, ' y ',y, ' w ',w, ' h ',h)
            var rect = new fabric.Rect({
            left: x,
            top: y,
            fill: 'red',
            width: w,
            height: h
            });

            // "add" rectangle onto canvas
            console.log('rac ',rect)
            this.canvas.add(rect);
            this.Draw =  {
                status: false,
                pen: {
                    type: null,
                    size: null,
                    position_x:null,
                    position_y:null,
                }
            }
            // return rect;
        },
        DrawRectangle()
        {
            this.Draw.status = true;
            this.Draw.pen.type = 0;//rectangle
        },
        

        //events
        mouseOverCallback(option)
        {
            var x =option.e.clientX;
            var y = option.e.clientY;
            console.log('x ',x, ' Y ', y);
            // this.makeRectangle(x,y)
            // this.DrawRectangle
            // this.Draw.position_x = x;
            // this.Draw.position_y = y;
        },
        mouseDownCallback(option)
        {
            var x =option.e.clientX;
            var y = option.e.clientY;
            console.log('x ',x, ' Y ', y);
            // this.makeRectangle(x,y)
            // this.DrawRectangle
            this.Draw.position_x = x;
            this.Draw.position_y = y;
        },
        mouseUpCallback(option)
        {
            var x =option.e.clientX;
            var y = option.e.clientY;
            console.log('x ',x, ' Y ', y);
            var w = x - this.Draw.position_x;
            var h = y - this.Draw.position_y;
            if(this.Draw.status )
            {
                if(this.Draw.pen.type === 0)
                {
                    this.makeRectangle(this.Draw.position_x,this.Draw.position_y, w, h)
                }
            }
            
        }
    },
    components:{}
    
}
</script>
