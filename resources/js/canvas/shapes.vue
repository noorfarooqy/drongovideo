<template>
    <div class="shapes-all">
        <v-rect v-for="(rect, rkey) in rectangles" v-bind:key="rkey" :config="rect">

        </v-rect>
        <v-shape-image v-bind="{imageConfig:imageConfig, transformerStatus:transformerStatus}"
        v-on:image-tranformer="sendImageTransfor"></v-shape-image>
        <v-file-viewer v-bind="{file_info: file_sharing}"></v-file-viewer>
        <textshape v-bind="{text_config: text_shape, texttransformer: transformerStatus, Draw:Draw}"></textshape>
        <!-- <v-text :config="{text: 'this default text', y:100, x:100}"></v-text> -->
    </div>
</template>
<script>
import imageshape from "./imageshape.vue";
import fileviewer from "./fileviewer.vue";
import textshape from "./textshape.vue";
export default {
    
    data() {
        return {
            name: 'shapes',
            version: 1,
            image:{
                visible: false,
                imageConfig: this.imageConfig,
                text_config: this.text_shape
            }
        }
    },
    methods: {
        sendImageTransfor(e)
        {
            this.$emit('image-transformer',e)
        }
    },
    props:['rectangles','imageConfig', 'transformerStatus', 'file_sharing', 'text_shape', 'Draw'],
    components: {vShapeImage:imageshape, vFileViewer: fileviewer, 
    textshape : textshape
    }
}
</script>