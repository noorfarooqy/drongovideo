<template>
  <div>
    <v-stage
      :config="configKonva"
      dragstart="handleDragstart"
      dragend="handleDragend"
      ref="stage"  @mousedown="handleStageMouseDown" @touchstart="handleStageMouseDown"
    >
      <v-layer ref="layer">
          <v-rect :config="{
          x: 20,
          y: 50,
          width: 100,
          height: 100,
          fill: 'red',
          shadowBlur: 10,
          id: 230,
          draggable : true,
        }"  @transformend="handleTransformEnd"
      />
        <v-star
          v-for="item in list"
          :key="item.id"
          :config="{
            x: item.x,
            y: item.y,
            rotation: item.rotation,
            id: item.id,
            numPoints: 5,
            innerRadius: 30,
            outerRadius: 50, fill: '#89b717',
            opacity: 0.8,
            draggable: true,
            scaleX: dragItemId === item.id ? item.scale * 1.2 : item.scale,
            scaleY: dragItemId === item.id ? item.scale * 1.2 : item.scale,
            shadowColor: 'black',
            shadowBlur: 10,
            shadowOffsetX: dragItemId === item.id ? 15 : 5,
            shadowOffsetY: dragItemId === item.id ? 15 : 5,
            shadowOpacity: 0.6
          }"
        ></v-star>
        <v-text :config="{text: 'Default text', id: 't1', draggable: true}"></v-text>
         <v-transformer ref="transformer" />
      </v-layer>
    </v-stage>
  </div>
</template>

<script>
const width = window.innerWidth;
const height = window.innerHeight;
export default {
  data() {
    return {
      list: [],
      dragItemId: null,
      configKonva: {
        width: width,
        height: height
      },
      rectangles: [{
          x: 20,
          y: 50,
          width: 100,
          height: 100,
          fill: 'red',
          shadowBlur: 10,
          id: 230,
          draggable : true,
      }]
    };
  },
  props:["out_configKonva"],
  methods: {
    handleDragstart(e) {
      // save drag element:
      console.log('dragging ',e);
      this.dragItemId = e.target.id();
      // move current element to the top:
      const item = this.list.find(i => i.id === this.dragItemId);
      const index = this.list.indexOf(item);
      this.list.splice(index, 1);
      this.list.push(item);
    },
    handleDragend(e) {
      this.dragItemId = null;
    },
    getClientWidth() {
        return this.$refs.cardHW.clientWidth;
    },
    getClientHeight() {
        return this.$refs.cardHW.clientHeight;
    },

    handleTransformEnd(e) {
      // shape is transformed, let us save new attrs back to the node
      // find element in our state
      console.log('transofrming end',e);
      const rect = this.rectangles.find(r => r.name === this.selectedShapeName);
      // update the state
      rect.x = e.target.x();
      rect.y = e.target.y();
      rect.rotation = e.target.rotation();
      rect.scaleX = e.target.scaleX();
      rect.scaleY = e.target.scaleY();

      // change fill
      rect.fill = Konva.Util.getRandomColor();
    },
    handleStageMouseDown(e) {
      // clicked on stage - clear selection

      console.log('transofrming doiwn',e);
      if (e.target === e.target.getStage()) {
      console.log('transofrming stage',e);
        this.selectedShapeName = '';
        this.updateTransformer();
        return;
      }

      // clicked on transformer - do nothing
      const clickedOnTransformer =
        e.target.getParent().className === 'Transformer';
      if (clickedOnTransformer) {
        return;
      }

      // find clicked rect by its name
      const name = e.target.name();
      const rect = this.rectangles.find(r => r.name === name);
      if (rect) {
        this.selectedShapeName = name;
      } else {
        this.selectedShapeName = '';
      }
      this.updateTransformer();
    },
    updateTransformer() {
      // here we need to manually attach or detach Transformer node
      const transformerNode = this.$refs.transformer.getNode();
      const stage = transformerNode.getStage();
      const { selectedShapeName } = this;

      const selectedNode = stage.findOne('.' + selectedShapeName);
      // do nothing if selected node is already attached
      if (selectedNode === transformerNode.node()) {
        return;
      }

      if (selectedNode) {
        // attach to another node
        transformerNode.attachTo(selectedNode);
      } else {
        // remove transformer
        transformerNode.detach();
      }
      transformerNode.getLayer().batchDraw();
    }
  
  },
  mounted() {
    //   this.configKonva.width = this.getClientWidth();
    this.configKonva = this.out_configKonva;
    for (let n = 0; n < 30; n++) {
      this.list.push({
        id: Math.round(Math.random() * 10000).toString(),
        x: Math.random() * width,
        y: Math.random() * height,
        rotation: Math.random() * 180,
        scale: Math.random()
      });
    }
  }
};
</script>

<style>
body {
  margin: 0;
  padding: 0;
}
</style>