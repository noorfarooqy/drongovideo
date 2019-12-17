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
            config:null,
        }
    },
    methods: {

    },
    watch: {
        file_info: function(){
            
            var image = new window.Image();
            image.src = 'https://drongovideo.local/pdfs/08b85cd637f48e879a6cff571576556742_ppt_-1.png';
            
            image.onload = () => {
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
                    
                this.config = {image:image, x:0, y: 0, width:this.file_info.width-20, height:700};
            }
            console.log('page is ',image)
        }
    },
    props:["file_info"],


}
</script>