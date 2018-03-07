<template>
  <div id="app">
   <m-header></m-header>
    <tab></tab>
    <keep-alive><!--在点击tab时为了不让他重新请求和加载-->
      <router-view></router-view>
    </keep-alive>
    <player></player>
  </div>
</template>

<script type="text/esmascript-6">
  import MHeader from 'components/m-header/m-header'
  import Tab from 'components/tab/tab'
  import Player from 'components/player/player'
  export default{
     components:{
        MHeader,
        Tab,
        Player
     }
  }

</script>

