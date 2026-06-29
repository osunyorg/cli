<script setup>
  import List from './components/sites/List.vue';
  import Stream from './components/Stream.vue';
</script>

<template>
  <div class="navbar">
    <div class="container">
      <div class="navbar-brand">Osuny Manager</div>
    </div>
  </div>
  <Stream />
  <div class="container">
    <List />
  </div>
</template>

<style>
  @import 'bootstrap/dist/css/bootstrap.css';
</style>
