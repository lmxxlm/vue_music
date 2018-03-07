<template>
  <scroll class="listview"
          :data="data"
          ref="listView"
          :listenScroll="listenScroll"
          :probeType="probeType"
          @scroll="scroll"
  >
    <ul>
      <li v-for="group in data" class="list-group" ref="listGroup">
         <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li v-for="item in group.items" class="list-group-item" @click="selectItem(item)">
            <img v-lazy="item.avatar"  class="avatar">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>

    <div class="list-shortcut" @touchstart="onShortCutTouchStart" @touchmove.stop.prevent="onShortCutTouchMove">
      <ul >
        <li v-for="(item,index) in shortCutList"
            class="item"
            :class="{'current':currentIndex===index}"
            :data-index="index"
        >
          {{item}}
        </li>
      </ul>
    </div>
    <div class="list-fixed" v-show="fixedTitle" ref="fixed">
      <h1 class="fixed-title">{{fixedTitle}}</h1>
    </div>
    <div class="loading-container" v-show="!data.length">
      <loading></loading>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll'
  import {getData} from 'common/js/dom'
  import loading from 'base/loading/loading'
  const ANCHOR_HEIGHT = 18
  const TITLE_HEIGHT = 30
   export default {
     created(){
       this.touch ={}//因为data props computed里面都有内置的get和set，需要监听数据的变化，而touch知识需要给下面两个方法共享变量，所以放在created里，
       this.listenScroll = true
       this.probeType=3
       this.listHeight=[]
     },
     props: {
       data: {
         type: Array,
         default: [],
       }
     },
     data(){
       return {
         scrollY:-1,
         currentIndex:0,
         diff:-1//表示上线-滚动的距离 是否小于 顶部fixed高度  ：用来做过度
       }
     },
     computed:{

       shortCutList(){
           return this.data.map((group)=>{
              return group.title.substr(0,1)
           })
       },
       fixedTitle(){
           if(this.scrollY>0){
               return ''
           }
           return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
       }
     },
     methods:{
       selectItem(item){
         this.$emit('select',item)
       },
       onShortCutTouchStart(el){
         let anchorIndex = getData(el.target,'index')
         let firstNap = el.touches[0]
         this.touch.y1 = firstNap.pageY
         this.touch.anchorIndex = anchorIndex
        // this.currentIndex=anchorIndex
         this._scrollTo(anchorIndex)
       },
       onShortCutTouchMove(el){
         let firstNap = el.touches[0]
         this.touch.y2 = firstNap.pageY
         let delta = (this.touch.y2 - this.touch.y1)/ANCHOR_HEIGHT|0
         let anchorIndex = parseInt(this.touch.anchorIndex)+ delta
         this._scrollTo(anchorIndex)
       },
       refresh(){
         this.$refs.listView.refresh()
       },
       scroll(pos){
         this.scrollY=pos.y
       },
       _calculateHeight(){
         this.listHeight=[]
         let listGroup = this.$refs.listGroup
         let height=0
         this.listHeight.push(height)
         for(let i=0;i<listGroup.length;i++){
           height += listGroup[i].clientHeight
           this.listHeight.push(height)
         }
       },
       _scrollTo(index){
         //解决第一个和最后一个不好使  拖到顶部和底部
         if(!index && index!==0){//让他点击没反应
           return
         }
         //解决滑动
         if(index<0){
           index=0
         }else if(index >this.listHeight.length-2){
           index=this.listHeight.length-2
         }
         //点击的时候让右面对应显示高亮
         this.scrollY = -this.listHeight[index]
         this.$refs.listView.scrollToElement(this.$refs.listGroup[index],0)
       }
     },
     watch:{
       data(){
         setTimeout(()=>{
           this._calculateHeight()
         },20)
       },
       scrollY(newY){
         let listHeight = this.listHeight
         //滚动到顶部
         if(newY>0){
           this.currentIndex=0
           return
         }
         for(let j=0;j<listHeight.length-1;j++){
           let height1=listHeight[j]
           let height2=listHeight[j+1]
           this.diff = height2+newY
           //滚动到中间部分：就是去掉没有下线的时候
           if(-newY<height2 && -newY>=height1){
             this.currentIndex=j
             this.diff = height2 + newY
             return
           }

           //
         }
         //滚动到底部  且-newY大于最后一个上线
         this.currentIndex=listHeight.length-2
       },
       diff(newVal){
         let fixedTop = (newVal>0 && newVal<TITLE_HEIGHT)?newVal-TITLE_HEIGHT:0
         if(this.fixedTop === fixedTop){
             return
         }
         this.fixedTop=fixedTop

         this.$refs.fixed.style.transform=`translate3d(0,${fixedTop}px,0)`

       }
     },
     components:{
       Scroll,
       loading
     }

   }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
