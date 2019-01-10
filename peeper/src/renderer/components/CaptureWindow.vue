<template>
  <div id="content"  >
    <div id="decoration">
      <div id="drag"  @click="drag()">
      </div>
      <div id="buttonContainer">
        <div class="btn" id="reduce-button" @click="reduce()" >
          <svg height="10" width="10" xmlns="http://www.w3.org/2000/svg">
            <g>
              <line stroke-width="1" stroke="#555555" x1="0" y1="7.5" x2="10" y2="7.5"> </line>
            </g>
          </svg>
        </div><div class="btn maximize" id="maximize-button" @click="maximize()">
          <svg height="10" width="10" xmlns="http://www.w3.org/2000/svg">
            <g class="toggleIcon active" id="maximizeIcon">
              <rect stroke-width="1.5" stroke="#555555" height="10" width="10" y="0" x="0" fill="none"></rect>
            </g>
            <g class="toggleIcon" id="minimizeIcon">
              <mask id="myMask">
                  <rect height="10" width="10" y="0" x="2"  fill="white" ></rect>
                  <rect height="7.5" width="7.5" y="2.5" x="0" fill="black"></rect>
               </mask>
              <rect stroke-width="1.5" stroke="#555555" height="7.5" width="7.5" y="2.5" x="0" fill="none"></rect>
              <rect stroke-width="1.5" stroke="#555555" height="7.5" width="7.5" y="0" x="2.5" fill="none" mask="url(#myMask)"></rect>
            </g>
          </svg>
        </div><div class="btn" id="close-button" @click="close()">
          <svg height="10" width="10" xmlns="http://www.w3.org/2000/svg">
            <g>
              <line stroke-width="1" stroke="#555555" x1="0" y1="0" x2="10" y2="10"> </line>
              <line stroke-width="1" stroke="#555555" x1="0" y1="10" x2="10" y2="0"> </line>
            </g>
          </svg>
        </div>
      </div>
    </div>
    <div id="svg-wrapper">
      <svg height="100%" width="100%" class="shadow" xmlns="http://www.w3.org/2000/svg">
        <rect id="shape"  height="100%" width="100%" />
      </svg>
    </div>
  </div>
</template>

<script >
  const ipcRenderer = require('electron').ipcRenderer
  export default {
    name: 'capture-window',
    methods: {
      drag : function(){
        console.log("drag")
        document.getElementById("svg-wrapper").classList.add('dragging')
      },
      drop : function(){
        console.log("drop")
        document.getElementById("svg-wrapper").classList.remove('dragging')
      },
      maximize : function(){
        console.log("maximize")
        document.getElementById("maximizeIcon").classList.toggle('active')
        document.getElementById("minimizeIcon").classList.toggle('active')
        ipcRenderer.send('maximize-window', {'maximized': document.getElementById("minimizeIcon").classList.contains('active')})
      },
      reduce : function(){
        console.log("reduce")
        ipcRenderer.send('reduce-window')
      },
      close : function(){
        console.log("close")
        ipcRenderer.send('close-window')
      }
    }
  }
</script>

<style>
  @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  .toggleIcon:not(.active) {
    visibility: hidden;
  }
  .toggleIcon .active {
    visibility: visible;
  }
  #content{
    height: 100%;
    width: 100%;
  }
  #close-button:hover{
    background: #FF3333;
  }
  #close-button:hover line{
    stroke: white;
  }
  .btn:hover line, .btn:hover rect{
    stroke: black;
  }
  #app{
    height: 100%;
  }

  html, body {
    width: 100% !important;
    height: 100% !important;
    background: rgba(0, 0, 0, 0);
    overflow: hidden;
  }
  .click-on      {pointer-events: all}
  .click-through {pointer-events: none}

  #decoration{
    background: #FFFFFF;
    border-top: 1px solid #48b0da;
    border-left: 1px solid #48b0da;
    border-right: 1px solid #48b0da;
    display: flex;
    height: 30px;
    user-select: none;
    filter: drop-shadow(1px 1px 1px rgba(0,0,0,1));
    width: 100%;
    margin-bottom: -1px;
  }
  #drag{
    -webkit-app-region: drag;
    flex-grow: 1;
  }
  #buttonContainer {
    /*background: red*/
  }

  #decoration #buttonContainer{
    float: right;
    padding: 0;
    margin: 0;
    line-height: 26px;
  }
  .btn {
    display: inline-block;
    padding-left: 18px;
    padding-right: 18px;
    height: 100%;
    color: rgba(0,0,0,0.7);
    transition: background 0.2s;
  }

  .btn:hover {
    background: rgba(0,0,0,0.1);
    color: black;
  }

  #svg-wrapper {
    position: relative;
    height: calc(100% - 33px);
    width: calc(100% - 1px);
  }

  #shape {
    stroke-dasharray: 10 5;
    stroke-width: 2px;
    fill: transparent;
    stroke: #fff;
    border-bottom: 5px solid black;
    transition: stroke-width 0.3s, stroke-dashoffset 0.3s, stroke-dasharray 0.3s;
  }

  #svg-wrapper:hover #shape {
    stroke-width: 1px;
    stroke-dashoffset: 50px;
  }
  .shadow {
    filter: drop-shadow(1px 1px 2px rgba(0,0,0,1));
  }
  .dragging{
    background-image: linear-gradient(45deg, #98CD8D 25%, #F6F0CF 25%, #F6F0CF 50%, #98CD8D 50%, #98CD8D 75%, #F6F0CF 75%, #F6F0CF 100%);
    background-size: 56.57px 56.57px;
  }

</style>
