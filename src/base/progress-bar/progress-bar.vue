<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper" ref="progressBtn"
           @touchstart.prevent="proTouchStart"
           @touchmove.prevent="proTouchMove"
           @touchend="proTouchEnd"
      >
        <div class="progress-btn" ></div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {prefixStyle} from 'common/js/dom'
  const progressBtnWidth = 16
  const transform = prefixStyle('transform')
  export default {
    props:{
      percent:{
        type:Number,
        default:0
      }
    },
    created(){
      this.touch={}
    },
    methods:{
      proTouchStart(e){
        this.touch.initage = true
        this.touch.startX=e.touches[0].pageX
        this.touch.left = this.$refs.progress.clientWidth
      },
      proTouchMove(e){
        if(!this.touch.initage){
          return
        }
        let delt = e.touches[0].pageX-this.touch.startX
        const offsetWidth =Math.min(this.$refs.progressBar.clientWidth - progressBtnWidth,Math.max(0,this.touch.left + delt))
        this._offset(offsetWidth)
      },
      proTouchEnd(){
        this.touch.initage = false
        this._progressTouched()
      },
      _progressTouched(){
        const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
        const percent = this.$refs.progress.clientWidth / barWidth
        this.$emit('progressChange',percent)
      },
      _offset(offsetWidth){
        this.$refs.progress.style.width = `${offsetWidth}px`
        this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px,0,0)`
      },
      progressClick(e){
        //进度条偏移
        //this._offset(e.offsetX)//不好使
        const react = this.$refs.progressBar.getBoundingClientRect()
        const offsetWidth = e.pageX - react.left
        this._offset(offsetWidth)
        //通知audio 进行播放到偏移位置
        this._progressTouched()
      }
    },
    watch:{
      percent(newPercent){
        if(newPercent > 0 && !this.touch.initage){
          let barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
          let offsetWidth = barWidth * newPercent
          this._offset(offsetWidth)
        }
      }
    }
  }

</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .progress-bar
    height: 30px
    .bar-inner
      position: relative
      top: 13px
      height: 4px
      background: rgba(0, 0, 0, 0.3)
      .progress
        position: absolute
        height: 100%
        background: $color-theme
      .progress-btn-wrapper
        position: absolute
        left: -8px
        top: -13px
        width: 30px
        height: 30px
        .progress-btn
          position: relative
          top: 7px
          left: 7px
          box-sizing: border-box
          width: 16px
          height: 16px
          border: 3px solid $color-text
          border-radius: 50%
          background: $color-theme
</style>
