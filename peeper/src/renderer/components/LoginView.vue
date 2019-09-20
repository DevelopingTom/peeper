<template>
  <div id="wrapperlogin" class="click-on" >
    <link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet">
     <form class="form" id="loginform" @submit="login">
            <div id="alert"></div>
          <img id="logo" src="~@/assets/logo.png" alt="electron-vue">
          <label class="label">Name
          <input type="text" id="name"></label>
          <label class="label">Remember me
          <input type="checkbox" id="remember"></label>
          <input type="submit"  id="submitbtn">
    </form>
  </div>
</template>
<script>

  import socket from './socket.js'
  
  const ipcRenderer = require('electron').ipcRenderer
  export default {
    name: 'login-view',
    mounted: function() {
      if (localStorage.getItem('myId')) {
        document.getElementById('loginform').style.display = 'none';
        socket.emit("login by id", {id: localStorage.getItem('myId')});
      }
      socket.on('connect_error', function(err) {
        document.getElementById('alert').style.display = 'block'
        document.getElementById('alert').innerHTML = "Error connecting to server";
      });
        
      socket.on('error login', function(msg){
        document.getElementById('loginform').style.display = 'flex';
        document.getElementById('alert').style.display = 'block'
        document.getElementById('alert').innerHTML = msg;
      });

      var that = this;
      socket.on('your infos', function(msg){
        ipcRenderer.send('socketId', msg.id)
        if (msg.remember) {
          localStorage.setItem('myId', msg.id);
        }
        that.$router.push('/main');
      });
    },
    methods: {
        login(e) {
            let userInfo = {name: document.getElementById("name").value};
            userInfo.remember = document.getElementById("remember").checked;
            if (document.getElementById("remember").checked === false) {
              localStorage.removeItem('myId');
            }
            socket.emit("login", userInfo);
            e.preventDefault()
        }
    }
  }

</script>
<style>
  @import "~material-design-icons/iconfont/material-icons.css";
</style>
<style>
#alert{
    border: 1px solid #e47c7c;
    color: #ff6a6a;
    text-align: center;
    margin-bottom: 19px;
    font-size: 18px;
    padding: 4px;
    display: none;
}
#wrapperlogin {
  padding-top: 25px;
  height: 100%;
  width: 100%;
  font-family: 'Open Sans', sans-serif;
  display: block;
  background: #21232b;
}

.form {
    width: 400px;
    margin: auto;
    padding: 50px;
    color: white;
    display: flex;
    background: #00000026;
    border: 1px solid #ffffff17;
    flex-direction: column;
}
#submitbtn {
    display: block;
    margin-top: 12px;
    padding-left: 12px;
    height: 36px;
    font-size: 18px;
    width: 100%;
}
#name {
    display: block;
    margin-bottom: 12px;
    padding-left: 12px;
    height: 36px;
    font-size: 18px;
    width: 100%;
}
</style>
