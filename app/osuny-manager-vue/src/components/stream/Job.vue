<script setup>
  import { ref, watch, onMounted } from 'vue'
  import { Collapse } from 'bootstrap';
  const running = ref(true);
  const localhostUrl = ref('');
  let bsCollapse = null;

  const props = defineProps({
    job: Object
  });

  watch(() => props.job.done, (done) => {
    if (done) {
      running.value = false;
      close();
    }
  });

  watch(() => props.job.content, (content) => {
    watchLocalhostRunUrl(content);
    show();
  });

  function cancel() {
    if (props.job.id) {
      fetch(`/api/jobs/${props.job.id}/cancel`, { method: 'POST' });
    }

    running.value = false;
    close();
  }

  onMounted(() => {
    bsCollapse = new Collapse(`#${ props.job.id }`);
    bsCollapse.show();
  });

  function close (){
    setTimeout(() => {
      bsCollapse.hide();
    }, 2000);
  }

  function show (){
    bsCollapse.show();
  }

  function watchLocalhostRunUrl (text) {
    const matches = text.match(/(?:https?:)?\/\/[^\s()]+/);
    if (matches?.length > 0) {
      localhostUrl.value = `http:${matches[0]}`; // Add http: to the url
    }
  }
</script>

<template>
  <div class="accordion-item">
    <h2 class="accordion-header">
      <button class="accordion-button" type="button" data-bs-toggle="collapse" :data-bs-target="`#${props.job.id}`" aria-expanded="true" :aria-controls="props.job.id">
        {{ props.job.id }}
      </button>
    </h2>
    <div :id="props.job.id" class="accordion-collapse collapse" data-bs-parent="#jobs-accordion">
      <div class="accordion-body p-0">
        <div class="job-container">
          <pre>{{ props.job.content }}</pre>
          <div class="job-actions p-2">
            <button v-if="running" class="btn btn-small btn-danger me-2" @click="cancel">Kill</button>
            <a class="btn btn-small btn-info" target="_blank" v-if="localhostUrl && running" :href="localhostUrl">Open ↗</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="sass">
.job:last-child
  border-bottom: none
.job-container
  max-height: calc(100vh - 200px)
  overflow-y: auto
  position: relative
  background: black
  .job-actions
    position: sticky
    bottom: 0
    left: 0
    right: 0
  pre
    margin: 0
    max-width: 100%
    display: block
    white-space: break-spaces
    padding: 1rem 1rem 50px
    flex: 1
    min-height: 100%
    display: flex
    align-items: end


</style>
