<template>
    <div class="shapes-all">
        <v-rect v-for="(rect, rkey) in rectangles" v-bind:key="rkey" :config="rect">

        </v-rect>
    </div>
</template>
<script>
export default {
    data() {
        return {
            name: 'shapes',
            version: 1
        }
    },
    props:['rectangles']
}
</script>