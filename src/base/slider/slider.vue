<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot></slot>
    </div>
    <div class="dots">
      <span class="dot" :class="{active: currentPageIndex === index }" v-for="(item, index) in dots"></span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll'
  import {addClass} from 'common/js/dom'
  export default {
    data(){
      return {
        dots:[],
        currentPageIndex:0
      }
    },
    props: {
      loop: {
        type: Boolean,
        default: true
      },
      autoPlay: {
        type: Boolean,
        default: true
      },
      interval: {
        type: Number,
        default: 4000
      }
    },
    mounted() {
      setTimeout(()=>{
        this._setSliderWidth()
        this._initDots()
        this._initSlider()
        if(this.autoPlay){
          this._play()
        }
        window.addEventListener('resize',()=>{
          if(!this.slider){
              return
          }
          this._setSliderWidth(true)
          this.slider.refresh()
        })
      }, 20)//设置20秒是因为浏览器刷新为17秒
    },
    methods: {
      _setSliderWidth(isResize) {
        this.children = this.$refs.sliderGroup.children
        let width = 0
        let sliderWidth = this.$refs.slider.clientWidth
        for(let i=0;i < this.children.length;i++){
          let child = this.children[i]
          addClass(child,'slider-item')
          child.style.width = sliderWidth +'px'
          width += sliderWidth
        }
        if(this.loop && !isResize){
          width += 2*sliderWidth
        }
        this.$refs.sliderGroup.style.width=width+'px'
      },
      _initDots(){
        this.dots = new Array(this.children.length)
      },
      _initSlider() {
        this.slider = new BScroll(this.$refs.slider,{
          scrollX:true,
          scrollY:false,
          momentum:false,
          snap:true,
          snapLoop:this.loop,
          snapThreshold:0.3,
          snapSpeed:400,
         // click:true  和fastclick有点冲突，会被禁止，因为页面是a链接，有默认跳转，不用click
        })

        this.slider.on('scrollEnd',()=>{
          let pageIndex = this.slider.getCurrentPage().pageX//代表的是第几个子元素
          if(this.loop){
            pageIndex -= 1
          }
          this.currentPageIndex = pageIndex

          if(this.autoPlay){
            clearTimeout(this.timer)//防止手动滑动冲突
            this._play()
          }
        })
      },
      _play() {
        //自动播放：准备播放的是下一页
        let pageIndex = this.currentPageIndex+1 //currentPageIndex 是从0开始的
        if(this.loop){
	  //如果是循环，要在此基础上+1，因为前后各多了个元素
          pageIndex += 1
        }
        this.timer=setTimeout(()=>{
          this.slider.goToPage(pageIndex,0,400)//这里的0代表y方向
        },this.interval)
      }
    },
    destroyed() {
      clearTimeout(this.timer)//这是一个好习惯，所有带计时器的，最好在销毁的时候，被清除掉
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .slider
    min-height: 1px
    .slider-group
      position: relative
      overflow: hidden
      white-space: nowrap
      .slider-item
        float: left
        box-sizing: border-box
        overflow: hidden
        text-align: center
        a
          display: block
          width: 100%
          overflow: hidden
          text-decoration: none
        img
          display: block
          width: 100%
    .dots
      position: absolute
      right: 0
      left: 0
      bottom: 12px
      text-align: center
      font-size: 0
      .dot
        display: inline-block
        margin: 0 4px
        width: 8px
        height: 8px
        border-radius: 50%
        background: $color-text-l
        &.active
          width: 20px
          border-radius: 5px
          background: $color-text-ll
</style>
