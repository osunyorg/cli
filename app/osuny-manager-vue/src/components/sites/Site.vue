<script setup>
  import { ref, watch } from 'vue';

  const props = defineProps({
    site: Object,
    filter: String
  });

  const isVisible = ref(true);
  const isComparing = ref(false);
  const isUpdating = ref(false);

  watch(() => props.filter, newFilter => {
    isVisible.value = !newFilter || props.site.name.toLowerCase().includes(newFilter.toLowerCase());
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
    <td class="actions">
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
    </td>
  </tr>
</template>

<style scoped lang="sass">
  table
    td:first-child
      margin-right: auto
  .actions
    display: flex
    justify-content: end
    gap: 20px
</style>
