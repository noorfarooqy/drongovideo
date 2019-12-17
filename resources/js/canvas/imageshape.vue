<template>
    
    <div>
        <v-image ref="animateMe" v-for="(image, ikey) in images" :key="ikey" :config="image.image" @mousedown="mouseDownOnImage">

        </v-image>

        
    </div>

</template>
<script>
export default {
    data() {
        
        // var image = this.imageConfig;
        return {
            images: [],
            name: 'imageshpae',
            image_counter: 0,
            selectedImageName:'',
        }
    },
    created() {
        // const image = new window.Image();
        console.log('created , property is ',this.imageConfig)
    },
    mounted() {
        console.log('mounted , property is ',this.imageConfig)

    },
    methods: {
        mouseDownOnImage(e)
        {
            this.$emit('image-tranformer', e);

        }
    },
    watch: {
        imageConfig: function (){
            this.images .push( { 
                image: {
                    image: this.imageConfig.image,
                    x: this.imageConfig.x,
                    y: this.imageConfig.y,
                    draggable: true,
                    name:'image_'+this.image_counter,
                }
            });
            
                
            this.image_counter +=1;
        },
        transformerStatus: function(){
            if(this.transformerStatus === false)
            {
                this.$emit('turn-off-transformer');
            }
        }
    },
    props: ["imageConfig", 'transformerStatus']

}
</script>