<template>
  <div>
    <v-text
      @dblclick="editTextBox"
      @dbtap="editTextBox"
      @transform="resetScale"
      @keypress="keyEventText"
      v-for="(text, tkey) in text_list"
      :config="{
      text:text.text,
      x: text.x,
      y: text.y,
      scaleX: text.scaleX,
      scaleY: text.scaleY,
      id: text.id,
      draggable:true,
      name: text.name,
      shapetype: text.shapetype,
      children:1,
      ref: text.name,
      fill:text.fill,
      fontSize: text.fontSize,
      fontStyle: text.fontStyle,
      textDecoration: text.textDecoration
      
    }"
      :key="tkey"
      :ref="text.name"
    ></v-text>
  </div>
</template>
<script>
var self;
export default {
  data() {
    return {
      name: "v-text",
      version: 1
    };
  },
  props: [],
  mounted() {
    self = this;
  },
  methods: {
    keyEventText(e) {
      console.log("event key ", e.keyCode);
    },
    editTextBox(e) {
      console.log("e double click ", e);
      var name = e.target.name();
      var textNode = this.$refs[name][0].getNode();
      console.log("text node ", textNode);

      this.hideTransformer();
      this.drawLayer();
      var stage = e.target.getStage();

      // create textarea over canvas with absolute position
      // first we need to find position for textarea
      // how to find it?

      // at first lets find position of text node relative to the stage:
      var textPosition = textNode.absolutePosition();

      // then lets find position of stage container on the page:
      var stageBox = stage.container().getBoundingClientRect();

      // so position of textarea will be the sum of positions above:
      var areaPosition = {
        x: stageBox.left + textPosition.x,
        y: stageBox.top + textPosition.y
      };

      // create textarea and style it
      var textarea = document.createElement("textarea");
      document.body.appendChild(textarea);

      // apply many styles to match text on canvas as close as possible
      // remember that text rendering on canvas and on the textarea can be different
      // and sometimes it is hard to make it 100% the same. But we will try...
      textarea.value = textNode.text();
      textarea.style.position = "absolute";
      textarea.style.top = areaPosition.y + "px";
      textarea.style.left = areaPosition.x + "px";
      textarea.style.width = textNode.width() - textNode.padding() * 2 + "px";
      textarea.style.height =
        textNode.height() - textNode.padding() * 2 + 5 + "px";
      textarea.style.fontSize = textNode.fontSize() + "px";
      textarea.style.border = "none";
      textarea.style.padding = "0px";
      textarea.style.margin = "0px";
      textarea.style.overflow = "hidden";
      textarea.style.background = "none";
      textarea.style.outline = "none";
      textarea.style.resize = "none";
      textarea.style.lineHeight = textNode.lineHeight();
      textarea.style.fontFamily = textNode.fontFamily();
      textarea.style.transformOrigin = "left top";
      textarea.style.textAlign = textNode.align();
      textarea.style.color = textNode.fill();
      var rotation = textNode.rotation();
      var transform = "";
      if (rotation) {
        transform += "rotateZ(" + rotation + "deg)";
      }

      var px = 0;

      var isFirefox = navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
      if (isFirefox) {
        px += 2 + Math.round(textNode.fontSize() / 20);
      }
      transform += "translateY(-" + px + "px)";

      textarea.style.transform = transform;

      // reset height
      textarea.style.height = "auto";
      // after browsers resized it we can set actual value
      textarea.style.height = textarea.scrollHeight + 3 + "px";
      textNode.hide();
      textarea.focus();

      // functions
      // var self = this;
      function removeTextarea() {
        textarea.parentNode.removeChild(textarea);
        window.removeEventListener("click", handleOutsideClick);
        textNode.show();
        self.showTranformer();
        self.forceUpdateTransformer();
        self.drawLayer();
      }

      function setTextareaWidth(newWidth) {
        if (!newWidth) {
          // set width for placeholder
          newWidth = textNode.placeholder.length * textNode.fontSize();
        }
        // some extra fixes on different browsers
        var isSafari = /^((?!chrome|android).)*safari/i.test(
          navigator.userAgent
        );
        var isFirefox =
          navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
        if (isSafari || isFirefox) {
          newWidth = Math.ceil(newWidth);
        }

        var isEdge = document.documentMode || /Edge/.test(navigator.userAgent);
        if (isEdge) {
          newWidth += 1;
        }
        textarea.style.width = newWidth + "px";
      }

      //keywodown
      textarea.addEventListener("keydown", function(e) {
        // hide on enter
        // but don't hide on shift + enter
        if (e.keyCode === 13 && !e.shiftKey) {
          textNode.text(textarea.value);
          removeTextarea();
        }
        // on esc do not set value back to node
        if (e.keyCode === 27) {
          removeTextarea();
        }
      });

      textarea.addEventListener("keydown", function(e) {
        var scale = textNode.getAbsoluteScale().x;
        setTextareaWidth(textNode.width() * scale);
        textarea.style.height = "auto";
        textarea.style.height =
          textarea.scrollHeight + textNode.fontSize() + "px";
      });
      function handleOutsideClick(e) {
        if (e.target !== textarea) {
          textNode.text(textarea.value);
          textNode.show();
          removeTextarea();
        }
      }

      setTimeout(() => {
        window.addEventListener("click", handleOutsideClick);
      });
    },
    children() {},
    hideTransformer() {
      this.$emit("hide-transformer");
    },
    drawLayer() {
      this.$emit("draw-layer");
    },
    resetScale(e) {
      var name = e.target.name();
      var textNode = this.$refs[name][0].getNode();
      textNode.setAttrs({
        width: textNode.width() * textNode.scaleX(),
        scaleX: 1
      });
    },
    showTranformer() {
      this.$emit("show-transformer");
    },
    forceUpdateTransformer() {
      this.$emit("force-transformerUpdate");
    }
  },
  props: ["text_list"]
};
</script>
