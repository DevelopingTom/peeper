<template>
  <div id="content"  >
    <div id="decoration" class="click-on">

      <div id="drag"  @click="drag()">
      </div>
      <div id="button-container">
        <div class="btn" id="reduce-button" @click="reduce()" >
          <svg height="10" width="10" xmlns="http://www.w3.org/2000/svg">
            <g>
              <line stroke-width="1" stroke="#555555" x1="0" y1="7.5" x2="10" y2="7.5"> </line>
            </g>
          </svg>
        </div><div class="btn maximize" id="maximize-button" @click="maximize()">
          <svg height="10" width="10" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
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
          <svg height="10" width="10" xmlns="http://www.w3.org/2000/svg" >
            <g>
              <line stroke-width="1" stroke="#555555" x1="0" y1="0" x2="10" y2="10"> </line>
              <line stroke-width="1" stroke="#555555" x1="0" y1="10" x2="10" y2="0"> </line>
            </g>
          </svg>
        </div>
      </div>
    </div>
    <div id="svg-wrapper" class="click-through">
      <svg height="100%" width="100%" class="shadow" xmlns="http://www.w3.org/2000/svg">
        <rect id="shape"  height="100%" width="100%" />
      </svg>
      <div class="invisibleControl click-on" id="barLeft"></div>
      <div class="invisibleControl click-on" id="barBottom"></div>
      <div class="invisibleControl click-on" id="barRight"></div>
    </div>

    <div id="resize-corner" class="click-on">
      <svg width="30" height="30">
        <circle class="resize-circle third-row"  cx="20"  cy="4"  r="0"/>
        <circle class="resize-circle third-row"  cx="12"  cy="12" r="0"/>
        <circle class="resize-circle second-row" cx="20"  cy="12" r="0"/>
        <circle class="resize-circle third-row"  cx="4"   cy="20" r="0"/>
        <circle class="resize-circle second-row" cx="12"  cy="20" r="0"/>
        <circle class="resize-circle first-row"  cx="20"  cy="20" r="0"/>
      </svg>
    </div>

  </div>
</template>

<script defer>
  const electron = require('electron')
  var timer;
  const ipcRenderer = electron.ipcRenderer
  ipcRenderer.on("window-move", () => {
    clearTimeout(timer)
    timer = setTimeout(()=>{document.getElementById("svg-wrapper").classList.remove('dragging');}, 300)
    document.getElementById("svg-wrapper").classList.add('dragging');
  })
  export default {
    mounted: function() {
      
      console.log('mounted')
      
      let mouseDown = false
      const TransparencyMouseFix = require('electron-transparency-mouse-fix')
      const fix = new TransparencyMouseFix({
        log: true,
        fixPointerEvents: 'auto'
      })
      document.getElementById('resize-corner').onmousedown = function(e) {
        mouseDown = true
      }
      document.getElementById('resize-corner').onmousemove = function(e) {
        if (mouseDown) {
          ipcRenderer.send('resize-window', {screenX: e.screenX, screenY: e.screenY, pageX: e.pageX, pageY: e.pageY})
        }
      }
      document.addEventListener ('mouseup',   mouseupListener);
      function mouseupListener (e) {
        console.log('upppppp')
        mouseDown = false
      }
    },
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
  .click-on      {pointer-events: all}
  .click-through {pointer-events: none}
  .invisibleControl{
    position: absolute;
    display: block;
  }
  .invisibleControl:hover {
    /*background: rgba(255,0,0,0.5);*/
  }
  #barLeft.invisibleControl, #barRight.invisibleControl {
    width: 10px;
    height: 100%;
    top: 0;
  }
  #barBottom.invisibleControl{
    bottom: -10px;
    width: 100%;
    height: 20px;
  }
  #barLeft.invisibleControl{
    left: -1px;
  }
  #barRight.invisibleControl{
    right: -2px;
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

  #decoration{
    background: white;
    border-top: 1px solid #48b0da;
    border-left: 1px solid #48b0da;
    border-right: 1px solid #48b0da;
    display: flex;
    height: 30px;
    filter: drop-shadow(2px 1px 2px rgba(0,0,0,0.5));
    user-select: none;
    width: 100%;
    margin-bottom: -5px;
    padding-bottom: 1px;
    position: relative;
    z-index: 1000;
  }

  #drag{
    -webkit-app-region: drag;
    flex-grow: 1;
  }

  #button-container {
    /*background: red*/
  }

  #decoration #button-container{
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
    background: -webkit-repeating-linear-gradient(
      -45deg,
      transparent,
      transparent 1rem,
      rgba(255, 255, 255, 0.05) 1rem,
      rgba(255, 255, 255, 0.05) 2rem
    );
    background-size: 200% 200%;

    -webkit-animation-name: barberpole;
    -webkit-animation-duration: 15s;
    -webkit-animation-timing-function: linear;
    -webkit-animation-iteration-count: infinite;
  }

  @keyframes barberpole {
    100% {
      background-position: 100% 100%;
    }
  }

  #resize-corner{
    position: fixed;
    right: 2px;
    bottom: 8px;
    width: 30px;
    height: 30px;
    cursor: nwse-resize;
  }

  .resize-circle{
    fill: transparent;
    stroke: white;
    stroke-width: 1px;
    stroke-dasharray: 0px;
    transition: r 0.1s, stroke-dasharray 0.9s, stroke-width 0.3s;
  }

  #resize-corner:hover .resize-circle{
    r: 3px;
  }

  .first-row{
    transition-delay: 0s;
  }

  .second-row{
    transition-delay: 0.05s;
  }

  .third-row{
    transition-delay: 0.1s;
  }
</style>
