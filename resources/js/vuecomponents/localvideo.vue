<template>
   
</template>

<script>
export default {
    data: function (){
        return {
            name: 'local video',
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
                    $(htmlTrack).addClass('local-video');
                    console.log('html track ',htmlTrack);
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
            console.log('will mute local audio ',this.muted);
            this.video_src.forEach(source => {
                if(source.kind == "audio")
                {    
                    if(this.muted)
                        source.disable()
                    else
                        source.enable();
                }
            })
        }
    }
}
</script>