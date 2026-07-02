<script setup>
  import { ref } from 'vue';

  const props = defineProps({
    label: String,
    column: String,
    activeColumn: String,
  });

  const emit = defineEmits(['sort']);

  const direction = ref('asc');

  function handleClick() {
    direction.value = props.activeColumn === props.column && direction.value === 'asc' ? 'desc' : 'asc';
    emit('sort', { column: props.column, direction: direction.value });
  }
</script>

<template>
  <th class="sortable" @click="handleClick">
    {{ label }}
    <span class="sort-indicator" v-if="activeColumn === column">{{ direction === 'asc' ? '▲' : '▼' }}</span>
  </th>
</template>

<style scoped lang="sass">
  .sortable
    cursor: pointer
    user-select: none

  .sort-indicator
    font-size: 0.7em
</style>
