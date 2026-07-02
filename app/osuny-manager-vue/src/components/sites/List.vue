<script setup>
  import { computed, ref } from 'vue'

  import Site from './Site.vue';
  import SortableTh from './SortableTh.vue';
  import { uniq } from '@/utils/uniq.js';

  const sites = ref(null);
  const themes = ref([]);
  // Filter by name
  const filter = ref('');
  // Filter by theme
  const theme = ref('');
  // Sort
  const sortColumn = ref('name');
  const sortDirection = ref('asc');

  function sortBy({ column, direction }) {
    sortColumn.value = column;
    sortDirection.value = direction;
  }

  function getSortValue(site, column) {
    switch (column) {
      case 'themes':
        return site.themes.map(t => t.name).sort().join(', ').toLowerCase();
      case 'osuny':
        return site.versions?.osuny ?? '';
      case 'hugo':
        return site.versions?.hugo ?? '';
      default:
        return site.name?.toLowerCase() ?? '';
    }
  }

  const sortedSites = computed(() => {
    if (!sites.value) return [];
    const direction = sortDirection.value === 'asc' ? 1 : -1;
    return [...sites.value].sort((a, b) => {
      const valueA = getSortValue(a, sortColumn.value);
      const valueB = getSortValue(b, sortColumn.value);
      return valueA.localeCompare(valueB, undefined, { numeric: true, sensitivity: 'base' }) * direction;
    });
  });

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
        <SortableTh label="site" column="name" :active-column="sortColumn" @sort="sortBy" />
        <SortableTh label="themes" column="themes" :active-column="sortColumn" @sort="sortBy" />
        <SortableTh label="osuny" column="osuny" :active-column="sortColumn" @sort="sortBy" />
        <SortableTh label="hugo" column="hugo" :active-column="sortColumn" @sort="sortBy" />
        <th class="actions">actions</th>
      </tr>
    </thead>
    <tbody>
      <Site v-for="site in sortedSites" :site="site" :filter="filter" :theme="theme" />
    </tbody>
  </table>
</template>

<style scoped lang="sass">
  .actions
    text-align: right
</style>
