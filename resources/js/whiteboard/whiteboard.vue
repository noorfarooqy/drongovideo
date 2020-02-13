<template>
    <div class="easyui-layout layout panel-noscroll" id="cc" style="visibility: visible;">
        <whiteboardheader></whiteboardheader>
        <menuleft></menuleft>
        <mainbody></mainbody>
    </div>
</template>
<script>
import whiteboardheader from "./header.vue"
import menuleft from "./menuleft.vue"
import mainbody from "./mainbody.vue"
export default {
    data() {
        return {
            name: 'whiteboard',
            version :1
        }
    },
    components: {whiteboardheader,menuleft,mainbody}
}
</script>
