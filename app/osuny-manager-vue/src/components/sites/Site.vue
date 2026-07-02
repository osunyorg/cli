<script setup>
  import { computed, ref } from 'vue';

  const props = defineProps({
    site: Object,
    filter: String,
    theme: String
  });

  const isComparing = ref(false);
  const isUpdating = ref(false);

  const isVisible = computed(() => {
    const matchesFilter = !props.filter || props.site.name.toLowerCase().includes(props.filter.toLowerCase());
    const matchesTheme = !props.theme || props.site.themes.some(theme => theme.name === props.theme);
    return matchesFilter && matchesTheme;
  });

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
</script>

<template>
  <tr v-if="isVisible">
    <td>
      {{ site.name }}
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
    <td>
      <div class="actions">
        <a :href="site.url" target="_blank" v-if="site.url">open ↗</a>
        <button type="button" class="btn btn-light btn-sm" @click="code">code</button>
        <button type="button" class="btn btn-light btn-sm" @click="run">run</button>
        <button type="button" class="btn btn-light btn-sm" @click="update">
          <span v-if="isUpdating">updating...</span>
          <span v-else>update</span>
        </button>
        <button type="button" class="btn btn-light btn-sm" @click="compare">
          <span v-if="isComparing">comparing...</span>
          <span v-else>compare</span>
        </button>
      </div>
    </td>
  </tr>
</template>

<style scoped lang="sass">
  .actions
    display: flex
    justify-content: end
    gap: 20px
    white-space: nowrap
</style>
