<template>
    <div>
        <!-- <v-rect v-for="(rect, rkey) in all.configRect" v-bind:key="'r'+rkey" :config="rect">

                    </v-rect> -->

        <v-text v-for="(text, tkey) in configText" v-bind:key="'t'+tkey" 
        :config="{
            text: text.text,
            y: text.y,
            x: text.x,
            fontSize: 15
            }"
        @mousedown="listenForAfterMouseDownEvent"
        @transform="transformText"/>
        <v-transformer ref="texttransformer" />
    </div>
</template>
<script>
export default {
    data() {

        return {
            configText: [],
            name: 'imageshpae',
            text_counter: 0,
            selectedImageName:'',
        }
    },
    props : ["text_config", "texttransformer", "Draw"],
    watch: {
        text_config: function()
        {
            this.configText.push(this.text_config)
        }
    },
    mounted() {
        // this.configText.push
    },
    methods: {

            //drawing
            mouseDownEvent(e)
            {
                console.log('mouse down event ',e);
                this.$emit('image-tranformer', e);

            },
            DrawRectangle()
            {
                // this.all.configRect.push(shapeConfigs.data.rect);
                this.resetDraw();
                this.Draw.isdrawing = true;
                this.Draw.type = 0;
            },
            writeText()
            {
                var textnode = this.getNewShape(3);
                var tr =  {
                    node: textnode,
                    enabledAnchors: ['middle-left', 'middle-right'],
                    // set minimum width of text
                    boundBoxFunc: function(oldBox, newBox) {
                        newBox.width = Math.max(30, newBox.width);
                        return newBox;
                    }
                };
                
                this.all.configText.push(textnode);
                // this.all.configT.push(tr);
            },
            transformText()
            {
                // this.all.configText[0].

            },
            updateTransformer(e)
            {
                    // reset scale, so only with is changing by transformer
                    console.log('e ',e);
                    this.all.textarea = document.createElement('textarea');
                    this.all.textarea.setAttribute('class','texareaTextActive');
                    const transformerNode = this.$refs.texttransformer.getStage();
                    const stage = transformerNode.getStage();
                    var layer = this.$refs.mainLayer.getNode();
                    const { selectedShapeName } = this;

                    const selectedNode = stage.findOne('.' + selectedShapeName);
                    // do nothing if selected node is already attached
                    if (selectedNode === transformerNode.node()) {
                        return;
                    }

                    if (selectedNode) {
                        // attach to another node
                        transformerNode.attachTo(selectedNode);
                        

                        console.log('text layer ',layer);
                        
                        this.textArea.getTextArea(this.all.textarea,selectedNode, stage, transformerNode, layer);
                        this.Draw.isdrawing = true;
                        this.Draw.type = 3;

                    } else {
                        // remove transformer
                        transformerNode.detach();
                        if (e.target !== this.all.textarea && this.Draw.isdrawing && this.Draw.type === 3 ) {
                            this.resetDraw();
                            console.log('selected noe ',selectedNode);
                            var textarea = document.querySelector('.texareaTextActive');
                            console.log('textarea area is ',textarea.value);
                            this.all.configText[0].text =textarea.value ;
                            window.removeEventListener('click', this.handleOutsideClick);
                            
                            console.log(textarea);
                            textarea.remove();
                            // selectedNode.show();
                            transformerNode.show();
                            transformerNode.forceUpdate();
                            layer.draw();
                        }
                    }
                    transformerNode.getLayer().batchDraw();
                    
            },



            //getters
            getNewPen()
            {
                return {
                    pos_x:null,
                    pos_y: null,
                    object: null,
                    on:false,
                }
            },
            resetDraw()
            {
                this.Draw.isdrawing = false;
                this.Draw.pen = this.getNewPen();
            },
            getObjectBeingDrawn()
            {
                switch(this.Draw.type)
                    {
                        case 0:
                            return this.getNewShape(0);
                            break;
                        case 3: 
                            return this.getNewShape(3);
                        default: 
                            console.log('unknown object to draw of type ',this.Draw.type);
                            return this.Draw.type;
                            
                    }
            },

            getNewShape(shapeIndex)
            {
                switch(shapeIndex)
                {
                    case 0:
                        return {
                            x: 20,
                            y: 50,
                            width: 100,
                            height: 100,
                            fill: 'red',
                            shadowBlur: 10,
                            id:-1,
                            draggable:true,
                            name:'rect'+this.all.configRect.length
                        }
                    case 3: 
                        return {
                            text: 'Some text here',
                            x: 50,
                            y: 80,
                            fontSize: 20,
                            draggable: true,
                            width: 200,
                            name: 'text'+this.all.configText.length
                        }
                    default: 
                        console.log('ukmown shaped index ',shapeIndex);
                        return {};
                }
            },
        

            //events
            listenForAfterMouseDownEvent(e)
            {
                if(this.Draw.isdrawing)
                {
                    var pos = this.$refs.stage.getStage().getPointerPosition();
                    this.Draw.pen.pos_x = pos.x;
                    this.Draw.pen.pos_y = pos.y;
                    this.Draw.pen.object = this.getObjectBeingDrawn();
                    this.Draw.pen.object.id = this.all.configRect.length;
                    this.Draw.pen.object.x = pos.x;
                    this.Draw.pen.object.y = pos.y;
                    this.Draw.pen.object.width =0;
                    this.Draw.pen.object.height = 0;
                    this.Draw.pen.on = true;
                    this.all.configRect.push(this.Draw.pen.object);

                    
                }

                if (e.target === e.target.getStage()) {
                    console.log(' e target is ',e.target ,' stage ', e.target.getStage())
                    this.selectedShapeName = '';
                    this.updateTransformer(e);
                    return;
                }

                // clicked on transformer - do nothing
                const clickedOnTransformer =
                    e.target.getParent().className === 'Transformer';
                if (clickedOnTransformer) {
                    console.log(' e target is ',e.target.getParent().className)
                    return;
                }

                // find clicked rect by its name
                const name = e.target.name();
                console.log(' e target is ',e.target.getParent().className)
                console.log('name is ',e.target);
                const rect = this.all.configText.find(r => r.name === name);
                if (rect) {
                    this.selectedShapeName = name;
                     console.log('failed e target is ',e.target ,' stage ', e.target.getStage())
                } else {
                     console.log(' faied e target is ',e.target ,' stage ', e.target.getStage())
                    this.selectedShapeName = '';
                }
                this.updateTransformer(e);

            },
            // listenForAfterMouseMoveEvent(event)
            // {
                
            //     if(this.Draw.isdrawing && this.Draw.pen.on)
            //     {
            //         var pos = this.$refs.stage.getStage().getPointerPosition();
            //         this.Draw.pen.object.width =  pos.x - this.Draw.pen.pos_x;
            //         this.Draw.pen.object.height =  pos.y - this.Draw.pen.pos_y;

            //     }
            // },
            // listenForAfterMouseUpEvent(event)
            // {
            //     if(this.Draw.isdrawing && this.Draw.pen.on)
            //     {
            //         console.log('reseting ',this.Draw);
            //         this.resetDraw();

            //     }
            // }
    },
    
}
</script>