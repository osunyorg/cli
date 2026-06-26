<script setup>
  import { ref } from 'vue'
  const props = defineProps({
    site: Object
  })
</script>

<template>
  <tr>
    <td>
      <span class="badge">{{ site.name }}</span>
    </td>
    <td>
      <span class="badge">osuny</span>
    </td>
    <td>
      <button type="button" class="btn btn-link badge">ouvrir</button>
    </td>
    <td>
      <button type="button" class="btn badge">run</button>
    </td>
    <td>
      <button type="button" class="btn badge">compare</button>
    </td>
  </tr>
</template>

<style scoped></style>
