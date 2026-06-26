<script setup>
  import { ref } from 'vue'
  import Site from './Site.vue';

  const sites = ref(null);

  async function update() {
    const res = await fetch('/api/sites');
    sites.value = await res.json();
  }

  update();
</script>

<template>
  <button @click="update">Update list</button>
  <p v-if="!sites">Loading...</p>

  <table class="table">
    <thead>
      <tr>
        <th>
          Site
        </th>
        <th>
          Thèmes
        </th>
        <th></th>
        <th></th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      <Site v-for="site in sites" :site="site" />
    </tbody>
  </table>

</template>

<style scoped></style>
