<template>
    <div class="video" >
        <div class="tracks">
            
        </div>
        
    </div>
    
</template>

<script>
export default {
    data: function (){
        return {
            name: 'remote video',
            version: 1,
            tracks: []
        }
    },
    created(){
        
    },
    methods: {
        attachTracks()
        {
            console.log('wil attach tracks')
            this.video_src.forEach(track => {
                // $('.video').append(track.attach())
                var container = document.querySelector('.tracks');
                // this.tracks.push({html: track.attach(), kind:track.kind})
                container.append(track.attach());
                container.addEventListener('DomRemoved',function(){
                    
                });
            });
        }
    },
    props: ["video_src"],
    watch: {
        video_src: function(new_val, old_val){
            
            this.attachTracks();
        }
    }
}
</script>