<template>
  <div id="wrapper" @click.capture="ping" class="click-on">
    <link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet">
    <div id="mainPanel">
      <div id="overlay" >
        <svg id="overlaySVG" height="100%" width="100%" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">

        </svg>
      </div>
      <div class="sidenav" id="firstLeftBar">
        <div class="control" id="resizeSideBar"></div>
        <div class="title">Servers</div>
        <div class="group" id="projects">
          <div class="project">Crispy guacamole</div>
        </div>
        <div class="title">Users List</div>
        <div class="group" >
          <user id="user-list" v-for="user in users" v-bind:user="user"></user>
        </div>
      </div>

      <div class="main click-on">
        <div class="chatContainer" id="chatContainer">
          <message id="message-list" v-for="message in messages" v-bind:message="message"></message>
        </div>
        <div class="inputContainer"><div class="inputControls"><div contenteditable="true" type="text" class="chatInput" id="mainInput"></div>
        <div  class="chatControls"><i class="material-icons">gif</i></div>
        <div @click="createWindow" class="chatControls"><i class="material-icons">tag_faces</i></div>
        <div @click="createWindow" class="chatControls"><i class="material-icons">aspect_ratio</i></div>
      </div></div>
      </div>
    </div>

  </div>
</template>
<script>
  import User from './MainView/User'
  import Message from './MainView/Message'
  import socket from './socket.js'

  export default {
    name: 'main-view',
    components: { User, Message },
    mounted: function() {
      let that = this;
      this.users = [];
      this.messages = [];
      let usersById = {};

      socket.on('new user', function(msg){
        console.log('new', msg)
        addUser(msg)
      });

      socket.on('chat message', function(msg){
          console.log(msg)
          addMessage(msg);
          var objDiv = document.getElementById("chatContainer");
          objDiv.scrollTop = objDiv.scrollHeight;
      });


      socket.on('users', function(msg){
          addUsers(msg);
      });
      socket.on('user status', function(msg){
        for (let index = 0; index < that.users.length; index++) {
          const user = that.users[index];
          
          if (user.id === msg.id) {
            user.status = msg.status;
            user.serving = msg.serving;
          }
        }
      });
      socket.on('history', function(msg){
          addMessages(msg);
      });
      socket.on('user disconnected', function(msg){
        for (let index = 0; index < that.users.length; index++) {
          const user = that.users[index];
          
          if (user.id === msg.id) {
            that.users.splice(index, 1);
            return;
          }
        }
      });


      function addUser(user) {
        let usrtmp = {}
        usrtmp[user.id] = user;
        addUsers(usrtmp);
      }
      function addUsers(msgs) {
        for (var userId in msgs) {
          that.users.push(msgs[userId]);
        }
        for (let user of that.users) {
          usersById[user.id] = user
        }
        console.log("users", usersById)
      }
      function addMessage(msg) {
        addMessages([msg]);
      }0

      let prevMessage;
      function addMessages(msgs) {
        for (let msg of msgs){
          that.messages.push(msg);
        }
        for (let message of that.messages){
          if (message.userId in usersById) {
            message.author = usersById[message.userId]
          } else {
            message.author = {name: message.name, icon: message.icon}
          }
          if (prevMessage && prevMessage.userId != message.userId || !prevMessage || message.timestamp > prevMessage.timestamp + 3600) {
            message.isFirstFromAuthor = true
          }
          prevMessage = message
        }
      } 

      socket.emit('connect to server')
      let mouseDown = false
      let diffMargin = 
      document.getElementById('resizeSideBar').onmousedown = function(e) {
        mouseDown = true
        let oldWidth = document.getElementById('firstLeftBar').offsetWidth
        diffMargin = oldWidth - e.pageX
      }
      document.addEventListener ('mousemove',  function(e) {
        if (mouseDown) {
          let newWidth = e.pageX + diffMargin
          document.getElementById('firstLeftBar').style.width = newWidth + 'px'
        }
      })
      document.addEventListener ('mouseup',   mouseupListener);
      function mouseupListener (e) {
        mouseDown = false
      }
      document.getElementById('mainInput').addEventListener('keypress', function (e) {
        console.log(e)
        var key = e.which || e.keyCode;
        if (key === 13) { // 13 is enter
          let msg = {timestamp: Date.now() / 1000, content: document.getElementById('mainInput').innerHTML}
          socket.emit('message', msg);
          document.getElementById('mainInput').innerHTML  = '';
          e.preventDefault()
        }
      });
        
    },
    data: function() {
      return {
        users: [],
        messages: []
      }
    },
    methods: {
      createWindow() {
        const ipcRenderer = require('electron').ipcRenderer
        ipcRenderer.send('capture-zone')
      },
      ping(e) {
        if (e.ctrlKey) {
          e.stopPropagation()
          e.preventDefault()
          console.log('test')
          // get the inner DOM of alpha.svg
          let a = document.getElementById('overlaySVG')
          let element = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
          element.setAttributeNS(null, 'fill', 'none')
          element.setAttributeNS(null, 'stroke', 'cyan')
          element.setAttributeNS(null, 'stroke-width', 3)
          element.setAttributeNS(null, 'r', 2)
          element.setAttributeNS(null, 'cx', e.pageX)
          element.setAttributeNS(null, 'cy', e.pageY)

          let animate = document.createElementNS('http://www.w3.org/2000/svg', 'animate')
          animate.setAttributeNS(null, 'attributeType', 'XML')
          animate.setAttributeNS(null, 'attributeName', 'r')
          animate.setAttributeNS(null, 'values', '1;35');
          animate.setAttributeNS(null, 'dur', '0.5s')
          animate.setAttributeNS(null, 'repeatCount', 'indefinite')

          let animate2 = document.createElementNS('http://www.w3.org/2000/svg', 'animate')
          animate2.setAttributeNS(null, 'attributeType', 'XML')
          animate2.setAttributeNS(null, 'attributeName', 'opacity')
          animate2.setAttributeNS(null, 'values', '1;0.2');
          animate2.setAttributeNS(null, 'dur', '1s')
          animate2.setAttributeNS(null, 'repeatCount', 'indefinite')

          element.appendChild(animate)
          element.appendChild(animate2)

          a.appendChild(element)
          setTimeout(function() {
            element.remove()
          }, 1000)
        }
      }
    }
  }


</script>
<style>
  @import "~material-design-icons/iconfont/material-icons.css";
</style>
<style>
#overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 1;
  top: 0;
  pointer-events: none;
  left: 0;
}
.sidenav {
  height: 100%; /* Full-height: remove this if you want "auto" height */
  background-color: #242b3a; /* Black */
  padding-top: 20px;
  font-family: 'Open Sans', sans-serif;
  filter: drop-shadow(1px 0px 1px rgba(0,0,0,0.5));
  border-right: 1px solid #3a3a44;
  min-width: 150px;
  position: relative;
  user-select: none;
}
#resizeSideBar{
  height: 100%;
  width:5px;
  /*background: red;*/
  position: absolute;
  right: 0;
  top: 0;
  cursor: e-resize;
}
#projects {
  min-height: 50px;
}
html, body {
  width: 100% !important;
  height: 100% !important;
  background: rgba(0, 0, 0, 0);
  overflow: hidden;
}
[data-rz-handle] {
    flex: 0 0 6px;
    background-color: rgba(0, 0, 0, 0.5);
}

[data-rz-handle] div {
    width: 6px;
    background-color: rgba(0, 0, 0, 0.5);
}
.title {
  /*width: 80%;*/
  margin: auto;
  margin-top: 10px;
  color: white;
  color: #BBBBBB;
  margin-bottom: 5px;
  font-size: 15px;
  padding: 6px;
  margin-bottom: 8px;
  /* padding: 0px 8px 3px 0px; */
  background: #ffffff0d;
  /* border-bottom: 1px solid #BBBBBB; */
}

.sidenav .project {
  padding: 3px 8px 3px 22px;
  text-decoration: none;
  font-size: 14px;
  color: #818181;
  display: block;
}

/* When you mouse over the navigation links, change their color */
.sidenav .project:hover {
  background: #ffffffb5;
  color: #242b3a;
}
.sidenav .user:hover {
  background: #ffffffb5;
  color: #242b3a;
}

.main {
  flex-grow: 1;
  font-family: 'Open Sans', sans-serif;
  padding: 0px 10px;
  height: 100%;
  background: #21232b;
  display: flex;
  flex-direction: column;
}
.inputContainer {
   min-height: 44px;
   width: 100%;
   margin-bottom: 10px;
}
.group {
  overflow: auto;
}
.inputControls {
  height: 100%;
  width: 100%;
  display: block;
  background: #2f303c;
  padding: 5px 15px;
  font-size: 14px;
  border: 1px solid #7d7a7a;
  color: #c3c3d2;
  display: flex;
}
.chatInput {
  height: 100%;
  flex-grow: 1;
  padding-top: 3px;
}
.chatControls {
  background: none;
  border: none;
  cursor: pointer;
  margin: auto;
  margin-left: 5px;
}
.chatControls:hover {
  color: white;
}
:focus {
    outline: none;
}
.chatContainer{
  flex-grow: 1;
  overflow: auto;
  margin: 15px 0;
}


*::-webkit-scrollbar {
    width: 5px;
}

*::-webkit-scrollbar-track {
  background-color: #2d2d3e;
}

*::-webkit-scrollbar-thumb {
  background-color: #3b3c52;
  border-radius: 15px;
  outline: none;
}
#wrapper {
  height: 100%;
}
#mainPanel {
  height: 100%;
  display: flex
}
</style>
