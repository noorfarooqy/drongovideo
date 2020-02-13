<template>
  <div>
    <v-rect v-for="(rect, tkey) in rect_list" :config="rect" :key="tkey"></v-rect>
  </div>
</template>
<script>
export default {
  data() {
    return {
      name: "v-rect",
      version: 1
    };
  },
  methods: {},
  props: ["rect_list"]
};
</script>
