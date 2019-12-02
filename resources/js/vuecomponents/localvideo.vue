<template>
    <div class="card-image video" >
        <div class="tracks">
            
        </div>
        
    </div>
    
</template>

<script>
export default {
    data: function (){
        return {
            name: 'local video',
            version: 1,
            tracks: [],
            in_video_src: this.video_src,
        }
    },
    mounted(){
        this.attachTracks();
    },
    methods: {
        attachTracks()
        {
            console.log('wil attach tracks')
            var container = document.querySelector('.tracks');
            this.video_src.forEach(track => {
                // $('.video').append(track.attach())
                
                this.tracks.push({html: track.attach(), kind:track.kind})
                // track.addClass('local-video');
                var htmlTrack = track.attach();
                if(track.kind === "video")
                    $(htmlTrack).addClass('local-video');
                console.log('html track ',htmlTrack);
                container.append(htmlTrack);
                // container.addEventListener('DomRemoved',function(){
                    
                // });
            });
        }
    },
    props: ["video_src"],
    watch: {
        in_video_src: function(new_val, old_val){
            console.log('changed item ');
            this.attachTracks();
        }
    }
}
</script>