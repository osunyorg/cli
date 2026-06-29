<script setup>
  import List from './components/sites/List.vue';
  import Stream from './components/Stream.vue';
</script>

<template>
  <div class="navbar">
    <div class="container-fluid">
      <div class="navbar-brand">Osuny Manager</div>
    </div>
  </div>
  <div class="container-fluid">
    <List />
  </div>
  <div class="container-fluid">
    <Stream />
  </div>
</template>

<style>
  @import 'bootstrap/dist/css/bootstrap.css';
</style>
