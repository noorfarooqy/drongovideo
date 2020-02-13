<template>
    <div v-on:keydown="keydownEvent" id="container">
        <color-picker v-if="colorPickerOpen" v-bind="{visible: colorPickerOpen}" 
        v-on:change-shape-color="changeShapeColor"  v-on:close-color-picker="closeColorPicker()" ></color-picker>
        <v-stage :config="stageSize" @mousedown="handleStageMouseDown" @touchstart="handleStageMouseDown">
            <v-layer ref="layer" v-on:draw-layer="drawLayer" >
                <vuetext v-bind="{text_list: text_list}"></vuetext>
                <vuerect v-bind="{rect_list: rect_list}"></vuerect>
                <vuecircle v-bind="{circle_list: circle_list}"></vuecircle>
                <vueimage v-bind="{image_list: image_list}"></vueimage>
                <v-transformer ref="transformer" v-on:hide-transformer="hideTransformer"
                    v-on:show-transformer="showTransformer" v-on:force-transformerUpdate="forceUpdateTransformer" />
            </v-layer>
        </v-stage>
    </div>
</template>
<script>
    import vuetext from "./text.vue";
    import vuerect from "./rectangle.vue";
    import vuecircle from "./circle.vue";
    import vueimage from "./image.vue";
    import colorPicker from "./colorPicker.vue";
    const width = window.innerWidth;
    const height = window.innerHeight;
    export default {
        data() {
            return {
                name: "konvas",
                version: 1,
                text_list: [],
                rect_list: [],
                circle_list: [],
                image_list: [],
                stageSize: {
                    width: width,
                    height: height,
                    container: "container"
                },
                selectedShapeName: null,
                colorPickerOpen: false,
                selectedShapeType: null,
            };
        },
        components: {
            vuetext,
            vuerect,
            vuecircle,
            vueimage,
            colorPicker
        },
        props: [
          "color_picker", "draw_text", "text_bold", "text_italic", "text_underline",
          "draw_rect"
          ],
        created() {
        },
        mounted() {
          
          
        },
        watch: {
          color_picker: function(){
            this.colorPickerOpen = this.color_picker;
          },
          draw_text: function(){
            if(this.draw_text === true)
              this.createText();
          },
          text_bold: function(){
            if(this.text_bold)
              this.setTextStyle(1);
            this.$emit('reset-text-style');
          
          },
          text_italic: function(){
            if(this.text_italic)
              this.setTextStyle(2);

            this.$emit('reset-text-style');
          
          },
          text_underline: function(){
            if(this.text_underline)
              this.setTextStyle(3);

            this.$emit('reset-text-style');
          
          },
          draw_rect: function(){
            this.createRect();
          }
        },
        methods: {
            createText() {
                this.text_list.push({
                    text: "Double click to edit text",
                    x: 100,
                    y: 100,
                    fontSize: 30,
                    fill: "red",
                    width: 200,
                    fontStyle:'normal',
                    id: this.text_list.length + parseInt(Math.random() * 100, 10),
                    name: this.text_list.length + "text" + parseInt(Math.random() * 100, 10),
                    shapetype: 0,
                    textDecoration: '',
                });
                this.$emit('completed-text-draw');
            },
            createRect() {
                this.rect_list.push({
                    rotation: 0,
                    x: 10,
                    y: 10,
                    width: 100,
                    height: 100,
                    scaleX: 1,
                    scaleY: 1,
                    fill: "red",
                    draggable: true,
                    id: this.rect_list.length + parseInt(Math.random() * 100, 10),
                    name: this.rect_list.length + "rect" + parseInt(Math.random() * 100, 10),
                    shapetype: 1
                });

                this.$emit('completed-rect-draw');
            },
            createCircle() {
                this.circle_list.push({
                    x: 100,
                    y: 100,
                    radius: 70,
                    fill: "red",
                    stroke: "black",
                    strokeWidth: 4,

                    scaleX: 1,
                    scaleY: 1,
                    draggable: true,
                    id: this.circle_list.length + parseInt(Math.random() * 100, 10),
                    name: this.circle_list.length +
                        "circle" +
                        parseInt(Math.random() * 100, 10),
                    shapetype: 2
                });
            },

            createImage(src = "https://konvajs.org/assets/yoda.jpg") {
                var yoda = new window.Image();
                yoda.src = src;
                yoda.onload = () => {
                    this.image_list.push({
                        x: 50,
                        y: 50,
                        image: yoda,
                        width: 106,
                        height: 118,
                        draggable: true,
                        id: this.image_list.length + parseInt(Math.random() * 100, 10),
                        name: this.image_list.length +
                            "image" +
                            parseInt(Math.random() * 100, 10),
                        shapetype: 3
                    });
                };
            },
            openColorPicker() {
                this.colorPickerOpen = false;
                this.colorPickerOpen = true;
            },
            initKeyEvents() {
                const transformerNode = this.$refs.transformer.getNode();
                var stage = transformerNode.getStage();
                var container = document.querySelector("div#container");
                console.log("container ", container);
                // make it focusable

                container.tabIndex = 1;
                // focus it
                // also stage will be in focus on its click
                container.focus();
                container.addEventListener("keydown", function (e) {
                    console.log("keywodn event ", e);
                });
                container.addEventListener("keypress", function (e) {
                    console.log("keywodn event ", e);
                });
            },
            keydownEvent(e) {
                console.log("kehdown ", e.keyCode);
            },
            handleStageMouseDown(e) {
                // clear stage
                console.log("e ", e);
                this.clearStage(e);

                // clicked on transformer - do nothing
                const clickedOnTransformer =
                    e.target.getParent() === null ||
                    e.target.getParent().className === "Transformer";
                if (clickedOnTransformer) {
                    return;
                }

                // find clicked rect by its name
                const name = e.target.name();

                const shapetype = e.target.attrs.shapetype;
                console.log("name ", name, " shape ", shapetype, " e ", e);
                var shape;
                if (shapetype === 0) shape = this.text_list;
                else if (shapetype === 1) shape = this.rect_list;
                else if (shapetype === 2) shape = this.circle_list;
                else if (shapetype === 3) shape = this.image_list;
                const elem = shape.find(r => r.name === name);
                if (elem) {
                    this.selectedShapeName = name;
                    console.log("elem ", elem);
                    this.selectedShapeType = shapetype;
                    // elem.on('keydown',function(e){
                    //   console.log('e keycode ',e.keyCode)
                    // })
                } else {
                    this.selectedShapeName = "";
                    this.selectedShapeType = null;
                }
                this.updateTransformer();
            },
            updateTransformer() {
                console.log("updating transformer");
                const transformerNode = this.$refs.transformer.getNode();
                const stage = transformerNode.getStage();
                const {
                    selectedShapeName
                } = this;

                const selectedNode = stage.findOne("." + selectedShapeName);
                if (selectedNode === transformerNode.node()) {
                    return;
                }
                if (selectedNode) {
                    // attach to another node
                    transformerNode.attachTo(selectedNode);
                } else {
                    // remove transformer
                    transformerNode.detach();
                }
                transformerNode.getLayer().batchDraw();
            },
            changeShapeColor(color) {
              console.log('change-shape-color ',color)
                switch (this.selectedShapeType) {
                    case 0:
                      this.text_list.forEach(text => {
                        text.fill = color;
                      });
                    case 1:
                      this.rect_list.forEach(rect => {
                        rect.fill = color;
                      });
                }
            },
            setTextStyle(style)
            {
                var fontStyle ;
                if(style === 1)
                  fontStyle = "bold";
                else if(style ===2)
                  fontStyle = "italic";
                else if(style === 3)
                  fontStyle = 'underline';
                switch (this.selectedShapeType) {
                    case 0:
                      this.text_list.forEach(text => {
                        if(style === 3)
                          text.textDecoration = 'underline';
                        else
                          text.fontStyle = fontStyle;
                      });
                }
              
            },
            closeColorPicker()
            {
              this.colorPickerOpen = false;
              this.$emit('close-color-picker');
            },
            clearStage(e) {
                // clicked on stage - clear selection
                if (e.target === e.target.getStage()) {
                    this.selectedShapeName = "";
                    this.selectedShapeType = null;
                    this.updateTransformer();
                    return;
                }
            },
            hideTransformer() {
                const transformerNode = this.$refs.transformer.getNode();
                transformerNode.hide();
            },
            showTransformer() {
                const transformerNode = this.$refs.transformer.getNode();
                transformerNode.show();
            },
            forceUpdateTransformer() {
                const transformerNode = this.$refs.transformer.getNode();
                transformerNode.forceUpdate();
            },
            drawLayer() {
                const transformerNode = this.$refs.transformer.getNode();
                transformerNode.getLayer().batchDraw();
                // transformerNode.getLayer().draw();
            }
        }
    };

</script>
