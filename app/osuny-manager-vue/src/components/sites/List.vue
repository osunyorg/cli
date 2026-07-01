<script setup>
  import { ref } from 'vue'

  import Site from './Site.vue';
import { uniq } from '@/utils/uniq.js';

  const sites = ref(null);
  const themes = ref([]);
  // Filter by name
  const filter = ref('');
  // Filter by theme
  const theme = ref('');

  async function update() {
    const res = await fetch('/api/sites');
    sites.value = await res.json();

    sites.value.forEach((site) => {
      themes.value.push(...site.themes.map(theme => theme.name));
    });

    getThemes();
  }

  function getThemes () {
    const tempThemes = [];
    sites.value.forEach((site) => {
      tempThemes.push(...site.themes.map(theme => theme.name));
    });
    tempThemes.sort();
    themes.value = uniq(tempThemes);
  }

  update();
</script>

<template>
  <p v-if="!sites">Loading...</p>

  <div class="py-2 row">
    <div class="col-md-3">
      <div class="input-group">
        <span class="input-group-text" id="filter-by-name">Site</span>
        <input type="text" class="form-control" placeholder="Search..." aria-label="Search" v-model="filter">
      </div>
    </div>
    <div class="col-md-3">
      <div class="input-group">
        <span class="input-group-text" id="filter-by-theme">Themes</span>
        <select class="form-select" v-model="theme">
          <option value="">All themes</option>
          <option :value="theme" v-for="theme in themes">{{ theme }}</option>
        </select>
      </div>
    </div>
  </div>

  <table class="table">
    <thead>
      <tr>
        <th>site</th>
        <th>themes</th>
        <th class="actions">actions</th>
      </tr>
    </thead>
    <tbody>
      <Site v-for="site in sites" :site="site" :filter="filter" :theme="theme" />
    </tbody>
  </table>
</template>

<style scoped lang="sass">
  .actions
    text-align: right
</style>
