<template>
    <div class="shapes-all">
        <v-rect v-for="(rect, rkey) in rectangles" v-bind:key="rkey" :config="rect">

        </v-rect>
        <v-shape-image v-bind="{imageConfig:imageConfig, transformerStatus:transformerStatus}"
        v-on:image-tranformer="sendImageTransfor"></v-shape-image>
        <v-file-viewer v-bind="{file_info: file_sharing}"></v-file-viewer>
    </div>
</template>
<script>
import imageshape from "./imageshape.vue";
import fileviewer from "./fileviewer.vue";
export default {
    
    data() {
        return {
            name: 'shapes',
            version: 1,
            image:{
                visible: false,
                imageConfig: this.imageConfig
            }
        }
    },
    methods: {
        sendImageTransfor(e)
        {
            this.$emit('image-transformer',e)
        }
    },
    props:['rectangles','imageConfig', 'transformerStatus', 'file_sharing'],
    components: {vShapeImage:imageshape, vFileViewer: fileviewer}
}
</script>