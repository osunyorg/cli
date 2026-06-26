<script setup>
  import { ref, watch } from 'vue';
  import Run from './buttons/Run.vue';

  const props = defineProps({
    site: Object,
    filter: String
  });

  const isVisible = ref(true);

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
</script>

<template>
  <tr v-if="isVisible">
    <td>
      <span class="badge">{{ site.name }}</span>
    </td>
    <td>
      <span class="badge">osuny</span>
    </td>
    <td>
      <a :href="site.url" target="_blank" v-if="site.url">ouvrir ↗</a>
    </td>
    <td>
      <button type="button" class="btn badge" @click="run">run</button>
    </td>
    <td>
      <button type="button" class="btn badge">update</button>
    </td>
    <td>
      <button type="button" class="btn badge">compare</button>
    </td>
  </tr>
</template>

<style scoped></style>
