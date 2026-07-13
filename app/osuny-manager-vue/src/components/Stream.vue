<script setup>
  import { ref, onMounted } from 'vue';
  import { Offcanvas } from 'bootstrap';
  import CONFIG from "../../config";
  import Job from './stream/Job.vue';

  const offcanvas = ref();
  const jobs = ref({});
  const noJobs = ref(true);

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

    function onJobStart({ id, total }) {
      jobs.value[id] = {
        id,
        content: '',
        done: false
      };

      bsOffcanvas.show();
      noJobs.value = false;
    }

    // function onJobProgress({ id, done, total }) {
    //   console.log('progress');
    // }

    function onJobOut({ id, text }) {
      if (jobs.value[id]) 
        jobs.value[id].content += text;
    }

    function onJobErr({ id, text }) {
      if (jobs.value[id])
        jobs.value[id].content += text;
    }

    function onJobDone({ id, cancelled, total }) {
      if (jobs.value[id])
        jobs.value[id].done = true;
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
      <div class="jobs accordion" id="jobs-accordion">
        <Job v-for="job in jobs" :job="job" />
        <p v-if="noJobs">No jobs</p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="sass">
.offcanvas
  width: 600px
</style>