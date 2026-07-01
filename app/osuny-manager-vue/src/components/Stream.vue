<script setup>
  import { ref, onMounted } from 'vue'
  import { Offcanvas } from 'bootstrap';
  import CONFIG from "../../config";
  import Job from './stream/Job.vue';

  const offcanvas = ref();
  const jobs = ref({});

  let bsOffcanvas = null;
  let socket = null;
  let reconnectTimer = null;
  
  function connect() {
    const proto = location.protocol === 'https:' ? 'wss:' : 'ws:';
    socket = new WebSocket(`${proto}//localhost:${CONFIG.SERVER_PORT}/api`);

    socket.onopen = () => {
      clearTimeout(reconnectTimer);
    };

    socket.onclose = () => {
      reconnectTimer = setTimeout(connect, 2000);
    };

    socket.onmessage = (event) => {
      let msg;
      try { msg = JSON.parse(event.data); } catch { return; }
      window.dispatchEvent(new CustomEvent('ws:' + msg.type, { detail: msg }));
    };
  }

  onMounted(() => {
    bsOffcanvas = new Offcanvas(offcanvas.value);

    window.addEventListener('ws:job:start',    (e) => onJobStart(e.detail));
    // window.addEventListener('ws:job:progress', (e) => onJobProgress(e.detail));
    window.addEventListener('ws:job:out',      (e) => onJobOut(e.detail));
    window.addEventListener('ws:job:err',      (e) => onJobErr(e.detail));
    window.addEventListener('ws:job:done',     (e) => onJobDone(e.detail));

    function onJobStart({ jobId, total }) {
      jobs.value[jobId] = {
        jobId,
        content: ''
      };

      bsOffcanvas.show();
    }

    function onJobProgress({ jobId, done, total }) {
      console.log('progress');
    }

    function onJobOut({ jobId, text }) {
      if (jobs.value[jobId]) 
        jobs.value[jobId].content += text;
    }

    function onJobErr({ jobId, text }) {
      if (jobs.value[jobId])
        jobs.value[jobId].content += text;
    }

    function onJobDone({ jobId, cancelled, total }) {
      bsOffcanvas.hide();
    }

    connect();
  });
</script>

<template>
  <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvas-stream" ref="offcanvas">
    <div class="offcanvas-header">
      <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
    </div>
    <div class="offcanvas-body">
      <div class="jobs">
        <Job v-for="job in jobs" :content="job.content" :jobId="job.jobId" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="sass">
.jobs
  display: flex
  flex-direction: column-reverse
</style>
