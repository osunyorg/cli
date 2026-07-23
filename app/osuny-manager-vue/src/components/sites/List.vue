<script setup>
  import { computed, ref } from 'vue'

  import Site from './Site.vue';
  import SortableTh from './SortableTh.vue';
  import { uniq } from '@/utils/uniq.js';
  import { checkGitStatus } from '@/utils/checkGitStatus.js';

  const sites = ref(null);
  const themes = ref([]);
  const isCheckingAllGitStatus = ref(false);
  // Filter by name
  const filter = ref('');
  // Filter by theme
  const theme = ref('');
  // Filter by config
  const config = ref('');
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
      case 'gitStatus':
        if (!site.gitStatus) return '';
        return site.gitStatus.upToDate ? '2' : '1';
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

  async function checkAllGitStatus() {
    isCheckingAllGitStatus.value = true;
    await Promise.all(sites.value.map((site) => checkGitStatus(site)));
    isCheckingAllGitStatus.value = false;
  }

  update();
</script>

<template>
  <p v-if="!sites">Loading...</p>
  <div class="py-2 row">
    <div class="col-md-10">
      <ul class="nav gap-2">
        <li class="nav-item">
          <div class="input-group">
            <input type="text" class="form-control form-control-sm" placeholder="Search by name..." aria-label="Search" v-model="filter">
          </div>
        </li>
        <li class="nav-item">
          <div class="input-group">
            <select class="form-select form-select-sm" v-model="theme">
              <option value="">All themes</option>
              <option :value="theme" v-for="theme in themes">{{ theme }}</option>
            </select>
          </div>
        </li>
        <li class="nav-item">
          <div class="input-group">
            <input type="text" class="form-control form-control-sm" placeholder="Search in config..." aria-label="Search in config" v-model="config">
          </div>
        </li>
      </ul>
    </div>
    <div class="col-md-2 d-flex gap-2 justify-content-end">
      <!--
      <button type="button" class="btn btn-light btn-sm" @click="checkAllGitStatus" :disabled="isCheckingAllGitStatus || !sites">
        <span v-if="isCheckingAllGitStatus">checking all sites...</span>
        <span v-else>check all status</span>
      </button>
      -->
      <button class="btn btn-light btn-sm" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvas-stream">
        open jobs
      </button>
      <button class="btn btn-light btn-sm" type="button" @click="update()">
        refresh list
      </button>
    </div> 
  </div>
  <table class="table table-responsive table-hover">
    <thead>
      <tr>
        <SortableTh label="site" column="name" :active-column="sortColumn" @sort="sortBy" />
        <SortableTh label="themes" column="themes" :active-column="sortColumn" @sort="sortBy" />
        <SortableTh label="osuny" column="osuny" :active-column="sortColumn" @sort="sortBy" />
        <SortableTh label="hugo" column="hugo" :active-column="sortColumn" @sort="sortBy" />
        <!-- <SortableTh label="status" column="gitStatus" :active-column="sortColumn" @sort="sortBy" /> -->
        <th>actions</th>
      </tr>
    </thead>
    <tbody>
      <Site v-for="site in sortedSites" :site="site" :filter="filter" :config="config" :theme="theme" />
    </tbody>
  </table>
</template>

