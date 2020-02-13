<template>
  <div>
    <v-circle v-for="(oval, tkey) in circle_list" :config="oval" :key="tkey"></v-circle>
  </div>
</template>
<script>
export default {
  data() {
    return {
      name: "v-circle",
      version: 1
    };
  },
  methods: {},
  props: ["circle_list"]
};
</script>
