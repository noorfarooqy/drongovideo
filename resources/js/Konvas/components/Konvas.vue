<template>
    <div id="container" ref="containerCanvas">
        <color-picker v-if="colorPickerOpen" v-bind="{visible: colorPickerOpen}"
            v-on:change-shape-color="changeShapeColor" v-on:close-color-picker="closeColorPicker()"></color-picker>
        <v-stage :config="stageSize" @mousedown="handleStageMouseDown" @touchstart="handleStageMouseDown" ref="stage"
         @mousemove="sendCanvasUpdate">
            <v-layer ref="layer" v-on:draw-layer="drawLayer">
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
    const width = window.width;
    const height = 700;
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
            "color_picker", "draw_text", "text_bold", "text_italic", "text_underline","change_file_page",
            "draw_rect", "draw_circle", "draw_image", "image_status", "draw_eraser", "file_sharing","is_hosting"
        ],
        created() {},
        mounted() {
            this.stageSize.width = this.$refs.containerCanvas.clientWidth;
            this.initKeyEvents()
            


        },
        watch: {
            color_picker: function () {
                this.colorPickerOpen = this.color_picker;
            },
            draw_text: function () {
                if (this.draw_text === true)
                    this.createText();
            },
            text_bold: function () {
                if (this.text_bold)
                    this.setTextStyle(1);
                this.$emit('reset-text-style');

            },
            text_italic: function () {
                if (this.text_italic)
                    this.setTextStyle(2);

                this.$emit('reset-text-style');

            },
            text_underline: function () {
                if (this.text_underline)
                    this.setTextStyle(3);

                this.$emit('reset-text-style');

            },
            draw_rect: function () {
                if (this.draw_rect === true)
                    this.createRect();
            },
            draw_circle: function () {
                if (this.draw_circle === true)
                    this.createCircle();
            },
            image_status: function () {
                console.log('draw image changed ', this.draw_image)
                if (this.draw_image.visible === true && this.draw_image.src !== null)
                    this.createImage(this.draw_image.src.src)
            },
            draw_eraser: function () {
                if (this.draw_eraser === true)
                    this.checkToDeleteShape(1);
            },
            file_sharing: function () {
              console.log('new file sharing received ',this.file_sharing);
              if(this.file_sharing !== null)
                this.createImage(this.file_sharing.image.src, {width: width, height: this.file_sharing.height},2)
                this.$emit('completed-sharing-file')
            },
            change_file_page: function () {
              console.log('change file page received ',this.file_sharing);
              if(this.file_sharing !== null)
                this.createImage(this.file_sharing.image.src, {width: width, height: this.file_sharing.height},2)
                this.$emit('completed-changing-page')
            },
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
                    fontStyle: 'normal',
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

                    scaleX: 1,
                    scaleY: 1,
                    draggable: true,
                    id: this.circle_list.length + parseInt(Math.random() * 100, 10),
                    name: this.circle_list.length +
                        "circle" +
                        parseInt(Math.random() * 100, 10),
                    shapetype: 2
                });
                this.$emit('completed-circle-draw');
            },

            createImage(src = "https://konvajs.org/assets/yoda.jpg", dimensions = {
                width: 106,
                height: 118
            }, type=1) {
                var yoda = new window.Image();
                yoda.src = src;
                var draggable = true;
                var x = 50;
                var y = 50;
                if(type ===2)
                {
                  draggable = false;
                  x = 0;
                  y = 0;
                  this.resetAllShapes();
                }  
                yoda.onload = () => {
                    this.image_list.push({
                        x: x,
                        y: y,
                        image: yoda,
                        width: dimensions.width,
                        height: dimensions.height,
                        draggable: draggable,
                        id: this.image_list.length + parseInt(Math.random() * 100, 10),
                        name: this.image_list.length +
                            "image" +
                            parseInt(Math.random() * 100, 10),
                        shapetype: 3
                    });
                };
                this.$emit('completed-image-draw');
            },
            sendCanvasUpdate()
            {
                if(!this.is_hosting)
                    return;
                var stage = this.$refs.stage.getStage();
                console.log('stage ',stage)
                var uri = stage.toDataURL();
                this.$emit('send-canvas-update',uri)
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
                var self = this;
                container.addEventListener("keydown", function (e) {
                    console.log("keywodn event ", e);
                    self.checkToDeleteShape(e);

                });
                container.addEventListener("keypress", function (e) {
                    console.log("keywodn event ", e);
                    self.checkToDeleteShape(e);
                });
            },
            checkToDeleteShape(e=1) {
                if (e.keyCode === 8 || e.keyCode === 46 || e === 1) {
                    if (this.selectedShapeName.length > 0 && this.selectedShapeType !== null) {
                        switch (this.selectedShapeType) {
                            case 0:
                                var elem = this.text_list.find(r => r.name === this.selectedShapeName);
                                console.log('found eleme to delete ', elem);
                                // this.deleteShape();
                                var new_list =[];
                                var old_list = this.text_list;
                                old_list.forEach(element => {
                                  console.log('checking  ',element.name !== this.selectedShapeName)
                                  if(element.name !== this.selectedShapeName)
                                  {
                                    new_list.push(element);
                                  }
                                });
                                this.text_list = new_list;
                                this.selectedShapeName = "";
                                this.selectedShapeType = null;
                                this.updateTransformer();
                                break;
                              case 1:
                                var elem = this.rect_list.find(r => r.name === this.selectedShapeName);
                                console.log('found eleme to delete ', elem);
                                // this.deleteShape();
                                var new_list =[];
                                var old_list = this.rect_list;
                                old_list.forEach(element => {
                                  console.log('checking  ',element.name !== this.selectedShapeName)
                                  if(element.name !== this.selectedShapeName)
                                  {
                                    new_list.push(element);
                                  }
                                });
                                this.rect_list = new_list;
                                this.selectedShapeName = "";
                                this.selectedShapeType = null;
                                this.updateTransformer();
                                break;
                              
                              case 2:
                                var elem = this.circle_list.find(r => r.name === this.selectedShapeName);
                                console.log('found eleme to delete ', elem);
                                // this.deleteShape();
                                var new_list =[];
                                var old_list = this.circle_list;
                                old_list.forEach(element => {
                                  console.log('checking  ',element.name !== this.selectedShapeName)
                                  if(element.name !== this.selectedShapeName)
                                  {
                                    new_list.push(element);
                                  }
                                });
                                this.circle_list = new_list;
                                this.selectedShapeName = "";
                                this.selectedShapeType = null;
                                this.updateTransformer();
                                break;
                              
                              case 3:
                                var elem = this.image_list.find(r => r.name === this.selectedShapeName);
                                console.log('found eleme to delete ', elem);
                                // this.deleteShape();
                                var new_list =[];
                                var old_list = this.image_list;
                                old_list.forEach(element => {
                                  console.log('checking  ',element.name !== this.selectedShapeName)
                                  if(element.name !== this.selectedShapeName)
                                  {
                                    new_list.push(element);
                                  }
                                });
                                this.image_list = new_list;
                                this.selectedShapeName = "";
                                this.selectedShapeType = null;
                                this.updateTransformer();
                                break;
                            default:
                                console.log('unselected shape ')

                        }
                        this.$emit('completed-eraser-draw');
                    } else
                        console.log('have you selected anything?')
                }
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
                console.log('change-shape-color ', color)
                switch (this.selectedShapeType) {
                    case 0:
                        this.text_list.forEach(text => {
                            if (text.name === this.selectedShapeName)
                                text.fill = color;
                        });
                        break;
                    case 1:
                        this.rect_list.forEach(rect => {
                            if (rect.name === this.selectedShapeName)
                                rect.fill = color;
                        });
                        break;
                    case 2:
                        this.circle_list.forEach(circle => {
                            if (circle.name === this.selectedShapeName)
                                circle.fill = color;
                        });
                        break;
                }
            },
            setTextStyle(style) {
                var fontStyle;
                if (style === 1)
                    fontStyle = "bold";
                else if (style === 2)
                    fontStyle = "italic";
                else if (style === 3)
                    fontStyle = 'underline';
                switch (this.selectedShapeType) {
                    case 0:
                        this.text_list.forEach(text => {
                            if (style === 3)
                                text.textDecoration = 'underline';
                            else
                                text.fontStyle = fontStyle;
                        });
                }

            },
            closeColorPicker() {
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
            resetAllShapes()
            {
              this.rect_list = [];
              this.circle_list = [];
              this.text_list = [];
              this.image_list = [];
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
