<script setup>
  import { ref, onMounted } from 'vue'
  const running = ref(true);

  const props = defineProps({
    jobId: String,
    content: String
  });

  function cancel() {
    if (props.jobId) {
      fetch(`/api/jobs/${props.jobId}/cancel`, { method: 'POST' });
    }
    running.value = false;
  }
</script>

<template>
  <div class="job mb-2 pb-2">
    <div class="small mb-2">{{ props.jobId }}</div>
    <div class="job-container">
      <pre>{{ props.content }}</pre>
    </div>
    <button v-if="running" class="btn btn-small btn-danger" @click="cancel">Kill</button>
  </div>
</template>

<style scoped lang="sass">
.job:last-child
  border-bottom: none

.job-container
  max-height: calc(500px)
  display: flex
  align-items: end
  overflow-y: auto

pre
  max-width: 100%
  display: block
  background: black
  white-space: break-spaces
  margin-top: 1rem
  padding: 1rem
  flex: 1
  min-height: 100%
</style>
