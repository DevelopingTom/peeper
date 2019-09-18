<template>
  <div v-bind:class="getClassUser()" data-tippy="Tooltip">
    <div class="icon">
      <img :src="user.icon">
      <div v-bind:class="getClassIcon()"></div>
    </div>
    <div class="name">{{ user.name }}</div>
    <div v-if="user.messages" class="messages">{{ user.messages }}</div>
  </div>
</template>

<script>
  export default {
    props: {
      user: Object
    },
    status: {
      active: 0,
      inactive: 1,
      absent: 2,
      disconnected: 3
    },
    methods: {
      getClassIcon(){
        let statusClasses = [
          'active',
          'inactive',
          'absent',
          'disconnected'
        ]
        return "status " + statusClasses[this.user.status]
      },
      getClassUser(){
        return  "user slideDown " + (this.user.active ? "active" : "") + " " + (this.user.unseen ? "unseen" : "") + " "
      }
    }
  }
</script>

<style scoped>
  .user {
    display: flex;
    font-family: 'Open Sans', sans-serif;
    padding: 9px;
    text-decoration: none;
    font-size: 14px;
    line-height: 25px;
    color: #818181;
    cursor: pointer;
  }

  .user .icon{
    margin-right: 6px;
    position: relative;
  }
  .user .status {
    border-radius: 8px;
    /* margin-left: auto; */
    /* margin-top: 5px; */
    width: 12px;
    /* vertical-align: bottom; */
    filter: drop-shadow(1px 1px 1px rgba(0,0,0,0.5));
    height: 12px;
    top: 16px;
    right: -2px;
    position: absolute;
  }
  .user .status.active {
    border: 2px solid #225022;
    background: #caffa8;
  }
  .user .status.inactive {
    border: 2px solid #734e26;
    background: #ffc800;
  }
  .user .status.absent {
    border: 2px solid #696969;
    background: #d3d3d3;
  }

  .user .icon img {
    width: 25px;
    height: 25px;
  }
  .user.active {
    color: #000000;
    background: #aeb6e2;
  }
  .unseen {
    animation: blinker 1.2s linear infinite;
  }
  @keyframes blinker {
    50% {
      background-color: #ffda9921;
    }
  }

  .unseen.slideDown {
    animation: blinker 1.2s linear infinite, slideDown 0.8s ease;
  }
  .user .messages {
    margin-left: auto;
    background: #d64e55;
    border-radius: 5px;
    height: 14px;
    color: white;
    /* vertical-align: middle; */
    margin-top: 7px;
    min-width: 21px;
    font-size: 9px;
    text-align: center;
    line-height: 11px;
  }
  .slideDown{
    animation: slideDown 0.8s ease;
  }
  @keyframes slideDown {
    0% {
      transform: translateY(-100%);
    }
    50%{
      transform: translateY(8%);
    }
    65%{
      transform: translateY(-4%);
    }
    100%{
      transform: translateY(0%);
    }
  }


</style>
