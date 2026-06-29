<script setup>
  import { ref, onMounted } from 'vue'
  import { Offcanvas } from 'bootstrap';
  import CONFIG from "../../config";

  const terminal = ref('');
  const offcanvas = ref();
  const currentJobId = ref();
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

  function cancelJob(jobId) {
    if (jobId) {
      fetch(`/api/jobs/${jobId}/cancel`, { method: 'POST' });
    }
  }

  onMounted(() => {
    bsOffcanvas = new Offcanvas(offcanvas.value);

    window.addEventListener('ws:job:start',    (e) => onJobStart(e.detail));
    // window.addEventListener('ws:job:progress', (e) => onJobProgress(e.detail));
    window.addEventListener('ws:job:out',      (e) => onJobOut(e.detail));
    window.addEventListener('ws:job:err',      (e) => onJobErr(e.detail));
    window.addEventListener('ws:job:done',     (e) => onJobDone(e.detail));

    function onJobStart({ jobId, total }) {
      cancelJob(currentJobId.value);

      currentJobId.value = jobId;

      bsOffcanvas.show();
    }

    function onJobProgress({ jobId, done, total }) {
      console.log('progress');
    }

    function onJobOut({ jobId, text }) {
      terminal.value += text;
    }

    function onJobErr({ jobId, text }) {
      terminal.value += text;
    }

    function onJobDone({ jobId, cancelled, total }) {
      bsOffcanvas.hide();
      console.log('done !')
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
      <div class="terminal-container">
        <pre>{{ terminal }}</pre>
      </div>
      <div v-if="currentJobId">
        <button class="btn btn-small btn-danger"  @click="cancelJob(currentJobId)">Kill</button>
        <div class="small mt-2">{{ currentJobId }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.terminal-container {
  height: calc(100vh - 200px);
  display: flex;
  align-items: end;
  overflow-y: auto;
}

pre {
  max-width: 100%;
  display: block;
  background: black;
  white-space: break-spaces;
  margin-top: 1rem;
  padding: 1rem;
  flex: 1;
  min-height: 100%;
}
</style>
