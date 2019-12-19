<template>
    <div>
        <v-image :config="config" style="border:thin solid red"></v-image>    
    </div>
</template>
<script>
export default {
    data() {
        return {
            name: 'file viewer',
            version: 1,
            files: [],
            config : null,
            
        }
    },
    methods: {

    },
    computed: {
        // config: function(imageConfig) {
        //     return imageConfig;
        // },
        reconfigImage:  function (){

            
        }
    },
    watch: {
        file_info: function(){
            if(this.file_info === null || this.file_info.src === "")
            {
                console.log('File is not thre ',this.file_info);
                return;
            }
            var image = this.file_info.src;
            var config = {};
            // image.onload = () => {
                console.log('image width ',image.width);
                console.log('image height ',image.height);
                var w,h;
                if(image.width > this.file_info.width)
                    w = this.file_info.width;
                else
                    w = image.width;
                if(image.height > this.file_info.height)
                {
                    h= this.file_info.height;

                }
                else
                    h = image.height;
                
                this.config = {image:image, x:0, y: 0, width:this.file_info.width-20, height:700, src: this.file_info.url};
                console.log('image updated config ',this.config);
                // return config
                // this.config = config;
            // }
            // console.log('page is ',image)
            // this.config(config);
                // return config
            
        },
    },
    props:["file_info"],


}
</script>