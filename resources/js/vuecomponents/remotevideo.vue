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
    created(){
        
    },
    mounted(){
        // this.attachTracks();
    },
    updated() {
        console.log('remote updated');
    },
    methods: {
        attachTracks()
        {
            var all_tracks = document.querySelector('.remote-video');
            console.log('I have tracks ',all_tracks);
            if(all_tracks)
            {
                console.log('will remvoe them ');
                all_tracks.remove();
            }
                
            console.log('wil attach tracks')
            var container = document.querySelector('.all-tracks');
            // this.tracks = [];
            this.video_src.forEach(track => {
                // $('.video').append(track.attach())
                
                // this.tracks.push({html: track.attach(), kind:track.kind})
                // track.addClass('local-video');
                var htmlTrack = track.attach();
                if(track.kind === "video")
                {
                    $(htmlTrack).addClass('remote-video');
                    console.log('html track ',htmlTrack);
                    htmlTrack.style.height = null;
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
            
            this.attachTracks();
        },
        muted: function()
        {
            // this.video_src[0].disabled()
        }
    }
}
</script>