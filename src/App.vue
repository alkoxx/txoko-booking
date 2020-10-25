<template>
  <v-app>
    <component :is="this.$route.meta.layout" />
  </v-app>
</template>

<script>
export default {
  name: 'App',
};
</script>
