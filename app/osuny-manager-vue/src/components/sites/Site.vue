<script setup>
  import { computed, ref } from 'vue';
  import { checkGitStatus } from '@/utils/checkGitStatus.js';
import Config from './site/Config.vue';

  const props = defineProps({
    site: Object,
    filter: String,
    theme: String,
    config: String
  });

  const isComparing = ref(false);
  const isUpdating = ref(false);
  const isUpdatingProduction = ref(false);

  const isVisible = computed(() => {
    const matchesFilter = !props.filter || props.site.name.toLowerCase().includes(props.filter.toLowerCase());
    const matchesTheme = !props.theme || props.site.themes.some(theme => theme.name === props.theme);
    const matchesConfig = handleSearchWithNot();
    return matchesFilter && matchesTheme && matchesConfig;
  });

  const gitStatusTitle = computed(() => {
    const gitStatus = props.site.gitStatus;
    if (!gitStatus) return '';

    const describe = (label, status) => {
      if (!status.branch) return `${label}: unknown`;
      if (status.upToDate) return `${label}: up to date (${status.branch})`;
      return `${label}: ${status.branch}, ${status.behind ?? '?'} behind main`;
    };

    return [
      describe('main', gitStatus.main),
      ...gitStatus.submodules.map((submodule) => describe(submodule.name, submodule)),
    ].join('\n');
  });

  function handleSearchWithNot() {
    const isNot = props.config.includes("NOT "),
          searchInConfig = props.config.replace("NOT ", ""),
          result = props.site.config.includes(searchInConfig);

    if (!props.config) {
      return true;
    }

    return isNot ? !result : result;
  }

  function run() {
    fetch('/api/sites/run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(props.site),
    });
  }

  function code() {
    fetch('/api/sites/code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(props.site),
    });
  }

  async function compare() {
    isComparing.value = true;
    await fetch('/api/sites/compare', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(props.site),
    });
    isComparing.value = false;
  }

  async function update() {
    isUpdating.value = true;
    await fetch('/api/sites/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(props.site),
    });
    isUpdating.value = false;
  }

  async function updateProduction() {
    isUpdatingProduction.value = true;
    await fetch('/api/sites/update-production', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(props.site),
    });
    isUpdatingProduction.value = false;
  }

  function checkStatus() {
    checkGitStatus(props.site);
  }
</script>

<template>
  <tr v-if="isVisible">
    <td>
      <a :href="site.url" target="_blank" v-if="site.url" class="link-underline link-underline-opacity-0 link-underline-opacity-75-hover">{{ site.name }} ↗</a>
      <span v-else>{{ site.name }}</span>
    </td>
    <td>
      <span class="badge rounded-pill bg-light text-dark me-1" v-for="theme in site.themes">
        {{ theme.name }}
      </span>
    </td>
    <td>
      <span class="badge rounded-pill" v-if="site.versions?.osuny">{{ site.versions.osuny }}</span>
    </td>
    <td>
      <span class="badge rounded-pill" v-if="site.versions?.hugo">{{ site.versions.hugo }}</span>
    </td>
    <!-- <td>
      <span v-if="site.checkingGitStatus">checking...</span>
      <span
        v-else-if="site.gitStatus"
        class="badge rounded-pill"
        :class="site.gitStatus.upToDate ? 'bg-success' : 'bg-warning text-dark'"
        :title="gitStatusTitle"
      >
        {{ site.gitStatus.upToDate ? 'up to date' : 'outdated' }}
      </span>
      <button v-else type="button" class="btn btn-light btn-sm" @click="checkStatus">check</button>
    </td> -->
    <td>
      <div class="actions d-flex gap-1">
        <button type="button" class="btn btn-light btn-sm" @click="code">code</button>
        <button type="button" class="btn btn-light btn-sm" @click="run">run</button>
        <button type="button" class="btn btn-light btn-sm" @click="update">
          <span v-if="isUpdating">updating...</span>
          <span v-else>update</span>
        </button>
        <button type="button" class="btn btn-light btn-sm" @click="updateProduction">
          <span v-if="isUpdatingProduction">updating production...</span>
          <span v-else>update production</span>
        </button>
        <button type="button" class="btn btn-light btn-sm" @click="compare">
          <span v-if="isComparing">comparing...</span>
          <span v-else>compare</span>
        </button>
        <Config :site="site"/>
      </div>
    </td>
  </tr>
</template>

