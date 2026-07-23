<script setup>
  import List from './components/sites/List.vue';
  import Stream from './components/Stream.vue';
</script>

<template>
  <div class="navbar">
    <div class="container-fluid">
      <div class="navbar-brand">osuny shepherd 🐑</div>
    </div>
  </div>

  <main>
    <div class="container-fluid">
      <List />
    </div>
    <div class="container-fluid">
      <Stream />
    </div>
  </main>

</template>

<style lang="sass">
  @import 'bootstrap/dist/css/bootstrap.css'
  @import './styles/fonts.css'

  body
    font-family: "Inclusive Sans", system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", "Noto Sans", "Liberation Sans", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"
</style>
