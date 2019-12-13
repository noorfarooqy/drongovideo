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
                            <a class="nav-link" href="#" @click.prevent="DrawRectangle">
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
            <div class="ui-block" ref="BlockRef">
                <div class="row">
                <canvas id="maincanvas" ref="canvas" class="col-md-12 col-lg-12" height="500" style="border:thin solid green" > </canvas>
            </div>
            </div>
        </div>
    </div>    
</template>
<script>
export default {
    data() {
        return {
            name: 'canvas',
            canvas: null,
            Draw: {
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
        var cardHW = this.$refs.BlockRef;
        var width  = cardHW.clientWidth;
        var height = cardHW.clientHeight;
        this.canvas.setHeight(height);
        this.canvas.setWidth(width);
        // this.canvas.renderAll();
        // this.makeRectangle();
        this.canvas.on('mouse:down',this.mouseDownCallback);
        this.canvas.on('mouse:up',this.mouseUpCallback);
        this.canvas.on('mouse:over',this.mouseOverCallback);
        this.canvas.on('mouse:move',this.mouseMoveCallback);
    },
    methods : {
        getCanvas()
        {
            return this.$refs.canvas
        },
        makeRectangle(x=100,y=100, w=20, h=20)
        {
            console.log('making rectangle x ',x, ' y ',y, ' w ',w, ' h ',h)
            this.Draw.pen.object = new fabric.Rect({
            left: y,
            top: x,
            fill: '',
            width: w,
            height: h,
            strokeWidth:3,
            stroke: 'red'   
            });

            // "add" rectangle onto canvas
            console.log('rac ',this.Draw.pen.object)
            // this.canvas.add(this.Draw.pen.object);
            
            // return rect;
        },
        DrawRectangle()
        {
            this.Draw.status = true;
            this.Draw.pen.type = 0;//rectangle
        },
        resetPen()
        {
            this.Draw.pen = {

                type: null,
                size: null,
                position_x:null,
                position_y:null,
                object:null,
            }
        },

        //events
        // mouseMoveCallback(option)
        // {
        //     // if(this.Draw.status && this.Draw.mouse_position === 1)
        //     // {
        //     //     var endxy = this.canvas.getPointer(option.e);
        //     //     this.Draw.pen.object.width = Math.abs(endxy.x - this.Draw.pen.position_x);
        //     //     this.Draw.pen.object.height = Math.abs(endxy.y - this.Draw.pen.position_y)
        //     //     this.canvas.renderAll();
        //     // }
        // },
        mouseOverCallback(option)
        {
            // this.Draw.object = this.makeRectangle(x, y, 0, 0);
            // this.canvas.add(this.Draw.object);
        },
        mouseDownCallback(option)
        {
            if(this.Draw.status)
            {
                this.Draw.mouse_position = 1;
                var start = this.canvas.getPointer(option.e)
                var x =start.x;
                var y = start.y;
                console.log('Mousse down ::  x ',x, ' Y ', y);
                // this.makeRectangle(x,y)
                // this.DrawRectangle
                this.Draw.pen.position_x = x;
                this.Draw.pen.position_y = y;
                this.makeRectangle(x, y, 0,0);
            }
            
            console.log('pointer is down at ',this.canvas.getPointer(option.e));
            var x =this.canvas.getPointer(option.e).x;
            var y = this.canvas.getPointer(option.e).y;
            console.log('x ',x, ' Y ', y);
        },
        mouseUpCallback(option)
        {
            console.log('mouse up ', this.Draw.pen.object);
            if(this.Draw.status && this.Draw.mouse_position === 1)
            {
                var endxy = this.canvas.getPointer(option.e);
                this.Draw.pen.object.width = endxy.x - this.Draw.pen.position_x;
                this.Draw.pen.object.height = endxy.y - this.Draw.pen.position_y;
                
                this.Draw.mouse_position = 2;
                this.Draw.status = false;
                this.canvas.add(this.Draw.pen.object);
                this.resetPen();
            }
            
            console.log('pointer is up at ',this.canvas.getPointer(option.e));
            var x =this.canvas.getPointer(option.e).x;
            var y = this.canvas.getPointer(option.e).y;
            console.log('x ',x, ' Y ', y);
            
        }
    },
    components:{}
    
}
</script>
<style scoped>
.canvas-container {
    height: 100%;
    width: 100%;
}
</style>