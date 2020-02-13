<template>
  <div :style="{background: color}" style="position:absolute" 
  id="ShapeColorPickerContainer"></div>
</template>

<script>
import Picker from "vanilla-picker";

export default {
  components: {},
  data() {
    return {
      color: "#59c7f9",
      colorPicker: {
            picker: null,
            visible: false,
            current: {rgbaString: '#ffffff'}
        },
    }
    
  },
  mounted() {
      if(this.visible)
        this.changeColor();
  },
  watch: {
      visible: function(new_val){
        //   if(this.visible)
            // this.changeColor();

      }
  },
  methods: {
    changeColor() {
      var self = this;
      this.colorPicker.picker = new Picker({
        parent: document.querySelector("#ShapeColorPickerContainer"),
        editor: true,
        popup: true,
        cancelButton: true,
        onChange: function(color) {
          self.notifyBackgroundChange(color);
        },
        onDone: function(color) {
          self.notifyDonePicker(color);
        },
        color: this.colorPicker.current.rgbaString
      });
      console.log("picker is ready ", this.colorPicker.picker);
      this.colorPicker.visible = true;
      this.colorPicker.picker.openHandler();
    },
    notifyBackgroundChange(color) {
      this.colorPicker.current = color;
    },
    notifyDonePicker(color) {
      console.log(
        "Done picker color to changed to ",
        color.rgbaString,
        "from ",
        this.colorPicker.current.rgbaString
      );
      this.colorPicker.current = color;
      this.$emit('change-shape-color',color.rgbaString);
      this.$emit('close-color-picker',color.rgbaString);
      this.colorPicker.picker = null;
    }
  },
  props: ["visible"]
};
</script>