<template>
  <div>
    <v-rect :key="b001" :config="initialBG" v-if="initialBG.show"></v-rect>
    <v-rect v-for="(rect, tkey) in rect_list" :config="rect" :key="tkey"></v-rect>
  </div>
</template>
<script>
export default {
  data() {
    return {
      name: "v-rect",
      version: 1,
      b001: 'b00-1',
      in_bg_color: "#ffffff",
      initialBG:null
    };
  },
  created() {
    // this.initialBG.width = this.width;
    this.initialBG = {
        rotation: 0,
        x: 0,
        y: 0,
        width: this.width,
        height: this.height,
        scaleX: 1,
        scaleY: 1,
        fill: this.bg_color,
        stroke: 'black',
        strokeWidth:1,
        draggable: false,
        id: -1,
        name: '-1',
        shapetype: 1,
        show:false,
      },
    this.initialBG.fill = this.bg_color.rgbaString;
    this.initialBG.show = true;
  },
  watch: {
    bg_color()
    {
      this.in_bg_color = this.bg_color;
      this.initialBG.fill = this.bg_color.rgbaString;
    },
    width() {

      this.initialBG.width = this.width;
    }
  },
  methods: {},
  props: ["rect_list", "bg_color", "width", "height"]
};
</script>
