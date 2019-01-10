<template>
  <div id="content"  >
    <div id="decoration">
      <div id="drag"  @click="drag()">
      </div>
      <div id="buttonContainer" @click="drag()">
        <div class="btn" id="close-button">x</div><div class="btn" id="maximize-button">m</div><div class="btn" id="reduce-button">_</div>
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
  export default {
    name: 'capture-window',
    methods: {
      drag : function(){
        console.log("drag")
        document.getElementById("svg-wrapper").classList.add('dragging');
        document.getElementById("drag").classList.add('test');
      },
      drop : function(){
        console.log("drop")
        document.getElementById("svg-wrapper").classList.remove('dragging');
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
  #content{
    height: 100%;
    width: 100%;
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
  }
  .btn {
    display: inline-block;
    padding-left: 15px;
    padding-right: 15px;
    height: 100%;
    color: rgba(0,0,0,0.7);
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
    /*border: 1px solid rgba(0,0,0,0.5);*/
    /* Similar syntax to box-shadow */
  }
  .dragging{
    background-image: linear-gradient(45deg, #98CD8D 25%, #F6F0CF 25%, #F6F0CF 50%, #98CD8D 50%, #98CD8D 75%, #F6F0CF 75%, #F6F0CF 100%);
    background-size: 56.57px 56.57px;
  }

</style>
