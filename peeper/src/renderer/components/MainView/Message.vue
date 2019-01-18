<template>
  <div>
    <div v-if="type" v-bind:class="getClassMessage()">
      <div class="authorIcon">
        <img v-if="message.isFirstFromAuthor" :src="message.author.icon">
      </div>
      <div class="textContainer">
        <div class="authorDate" v-if="message.isFirstFromAuthor"><div class="authorName">{{ message.author.name }}</div><div class="date">{{ readableDate }}</div></div>
        <div class="textContent">{{ message.content }}</div>
      </div>
    </div>
    <div v-if="!type" class="metaContainer">
      <div class="line"></div>
      <div class="authorName">{{ message.author.name }}</div><div class="metaContent">{{ message.content }}</div>
      <div class="line"></div>
    </div>
  </div>
</template>

<script>
  import dayjs from 'dayjs'
  import relativeTime from 'dayjs/plugin/relativeTime'
  dayjs.extend(relativeTime)
  let TYPES = {
    text: 1,
    meta: 2,
  }
  export default {
    props: {
      message: Object
    },
    TYPES: TYPES,
    computed: {
      readableDate: function () {
        return dayjs.unix(this.message.timestamp).fromNow()
      },
      type: function () {
        return this.message.typeMessage == TYPES.text
      }
    },
    methods: {
      getClassMessage(){
        return "messageContainer " + (this.message.isFirstFromAuthor ? "first" : "")
      },
    }
  }
</script>

<style scoped>
  .messageContainer {
    display: flex;
    font-family: 'Open Sans', sans-serif;
    width: 100%;
    text-decoration: none;
    font-size: 14px;
    line-height: 25px;
  }
  .messageContainer.first {
    margin-top: 15px;
  }
  .textContainer {
    display: flex;
    flex-direction: column;
    color: #c7c3ce;
    font-size: 13px;
  }

  .authorIcon {
    margin-right: 12px;
    margin-top: 5px;
    width: 30px;
  }
  .authorIcon img {
    width: 30px;
    cursor: pointer;
    position: relative;
    height: 30px;
  }
  .authorIcon img:hover {
  filter: drop-shadow(2px 2px 2px rgba(0,0,0,1));
  }
  .authorName {
    font-weight: 600;
    color: white;
  }
  .authorDate .date {
    color: #736a88;
    margin-left: 7px;
    font-size: 12px;
  }
  .authorDate {
    display: flex;
  }
  .metaContainer{
    display: flex;
    font-size: 12px;
  }
  .metaContainer .authorName{
  }
  .metaContainer .metaContent{
    color: grey;
    margin-left: 5px;
  }
  .line {
    height: 1px;
    background: #686886;
    flex-grow: 1;
    margin-top: 9px;
  }
  .line:first-child{
    margin-left: 20%;
    margin-right: 10px;
  }
  .line:last-child{
    margin-left: 10px;
    margin-right: 20%;
  }
</style>
