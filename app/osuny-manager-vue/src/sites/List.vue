<script setup>
  import { ref } from 'vue'

  import Site from './Site.vue';

  const sites = ref(null);
  const filter = ref('');

  async function update() {
    const res = await fetch('/api/sites');
    sites.value = await res.json();
  }

  update();
</script>

<template>
  <button class="btn" @click="update">Update list</button>
  <p v-if="!sites">Loading...</p>

  <input type="text" v-model="filter">

  <table class="table">
    <thead>
      <tr>
        <th>Site</th>
        <th>Thèmes</th>
        <th></th>
        <th></th>
        <th></th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      <Site v-for="site in sites" :site="site" :filter="filter" />
    </tbody>
  </table>
</template>

<style scoped></style>
