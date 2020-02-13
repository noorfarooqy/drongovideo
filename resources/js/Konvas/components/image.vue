<template>
  <div>
    <v-image v-for="(image, tkey) in image_list" :config="image" :key="tkey"></v-image>
  </div>
</template>
<script>
export default {
  data() {
    return {
      name: "v-image",
      version: 1
    };
  },
  methods: {},
  props: ["image_list"]
};
</script>
