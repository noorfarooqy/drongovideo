<template>
   
</template>

<script>
export default {
    data: function (){
        return {
            name: 'remote video',
            version: 1,
            // tracks: [],
            // in_video_src: this.video_src,
        }
    },
    mounted(){
        this.attachTracks();
    },
    methods: {
        attachTracks()
        {
            console.log('wil attach tracks')
            var container = document.querySelector('.all-tracks');
            this.video_src.forEach(track => {
                
                // this.tracks.push({html: track.attach(), kind:track.kind})
                var htmlTrack = track.attach();
                if(track.kind === "video")
                {
                    $(htmlTrack).addClass('remote-video');
                    console.log('html track ',htmlTrack);
                    $('.remote-video').remove();
                    container.append(htmlTrack);
                }
                // container.addEventListener('DomRemoved',function(){
                    
                // });
            });
        }
    },
    props: ["video_src", "muted"],
    watch: {
        video_src: function(new_val, old_val){
            console.log('changed item ');
            this.attachTracks();
        },
        muted: function()
        {
            this.video_src.forEach(source => {
                if(source.kind == "audio")
                {    
                    if(this.muted)
                        this.video_src[0].disable()
                    else
                        this.video_src[0].enable();
                }
            })
            
        }
    }
}
</script>