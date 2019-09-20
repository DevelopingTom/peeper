<template>
  <div>
    <div id="alertVideo">Video source  not found</div>
    <video></video>
  </div>
</template>

<script defer>
  const electron = require('electron')
  var timer;
  const ipcRenderer = electron.ipcRenderer

  export default {
    mounted: function() {
      let sourceId
      ipcRenderer.on('close video', function(data) {
        document.getElementById('alertVideo').style.display = "block"
      })
    },
    name: 'video-window',
    methods: {
    }
  }
</script>

<style>
#alertVideo {
  display: none;
  text-align: center;
  margin: auto;
  margin-top: 50px;
  font-size: 18px;
}
</style>
