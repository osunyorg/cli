<script setup>
  const props = defineProps({
    site: Object
  });
</script>

<template>
  <button type="button" class="btn btn-light btn-sm" data-bs-toggle="modal" :data-bs-target="`#${site.name}-config-modal`">
    config
  </button>
  <div class="modal fade" :id="`${site.name}-config-modal`" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5">{{ site.name }} config</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          <pre class="site-config">{{ site.config }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="sass">
  .site-config
    background: black
    padding: 10px
</style>
