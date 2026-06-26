<script setup>
async function getSites() {
const res = await fetch('/api/sites', {
  method: 'GET',
  headers: { 'Content-Type': 'application/json' },
});
}
const { sites, total, root } = await res.json();
</script>

<template>
  <button @click="getSites">Get sites</button>
</template>

<style scoped></style>
