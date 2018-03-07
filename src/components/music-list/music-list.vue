<template>
  <div class="music-list">
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="title" v-html="title"></h1>
    <div class="bg-image" :style="bgStyle"  ref="bgImg">
      <div class="play-wrapper" v-show="songs.length>0" ref="play" @click="_randomPlay">
        <div class="play">
          <i class="icon-play"></i>
          <span class="text">随机播放</span>
        </div>
      </div>
      <div class="filter" ref="filter"></div>
    </div>

    <div class="bg-layer" ref="layer"></div>
    <scroll
      :data="songs"
      :probeType="probeType"
      :listenScroll="listenScroll"
      class="list"
      @scroll="scroll"
      ref="list"
    >
      <div class="song-list-wrapper">
        <song-list :songs="songs" :rank="rank" @select="selectItem"></song-list>
      </div>

      <div class="loading-container" v-show="!songs.length">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll'
  import SongList from 'base/song-list/song-list'
  import {prefixStyle} from 'common/js/dom'
  import Loading from 'base/loading/loading'
  import {mapActions} from'vuex'
  import {playlistMixin} from 'common/js/mixin'
  const INTERVAL_HEIGHT = 40
  const transform = prefixStyle('transform')
  const backdrop = prefixStyle('backdrop-filter')
  export default{
    mixins:[playlistMixin],
    props:{
      title:{
        type:String,
        default:''
      },
      songs:{
        type:Array,
        default:[]
      },
      bgImg:{
        type:String,
        default:''
      },
      rank:{
        type:Boolean,
        default:false
      }
    },
    data(){
      return {
        scrollY:0
      }
    },
    computed:{
      bgStyle(){
         return `background-image:url(${this.bgImg})`//这里一定要进行this引入
      }
    },
    created(){
      this.probeType=3
      this.listenScroll=true
    },
    mounted(){
      this.bgImgHeight=this.$refs.bgImg.clientHeight
      this.maxHeight=-this.bgImgHeight+INTERVAL_HEIGHT
      this.$refs.list.$el.style.top=`${this.bgImgHeight}px`
    },
    methods:{
      handlePlaylist(playList){
        let bottom = playList > 0 ? '60px' : ''
        this.$refs.list.$el.style.bottom = bottom
        this.$refs.list.refresh()
      },
      scroll(pos){
        this.scrollY = pos.y
      },
      back(){
        this.$router.back()
      },
      selectItem(song,index){
        this.selectPlay({
          list:this.songs,
          index:index
        })
      },
      _randomPlay(){
        this.randomPlay({//赋值的时候不能直接传
          list:this.songs
        })
      },
      ...mapActions([
        'selectPlay',
        'randomPlay'
      ])
    },
    watch:{
      scrollY(newY){
        let tranlateY = Math.max(this.maxHeight,newY)
        let zIndex = 0
        let scale =1
        let blur = 0//高斯模糊
        const percent = Math.abs(newY/this.bgImgHeight)
        this.$refs.layer.style[transform]=`translate3d(0,${tranlateY}px,0)`

        if(newY < this.maxHeight){//向上滚动的时候
          zIndex=10
          this.$refs.bgImg.style.height=`${INTERVAL_HEIGHT}px`
          this.$refs.bgImg.style.paddingTop=0
          this.$refs.play.style.display='none'
        }else{
          this.$refs.bgImg.style.height=0
          this.$refs.bgImg.style.paddingTop=`70%`
          zIndex=0
          this.$refs.play.style.display=''
        }
        if(newY>0){//就是向下滑动
          scale=scale+percent
          zIndex=10
        }else{
          blur = Math.min(20,percent*20)
        }
        this.$refs.bgImg.style.zIndex=zIndex
        this.$refs.bgImg.style.transform=`scale(${scale})`
        this.$refs.filter.style[backdrop]=`${blur}`
      }
    },
    components:{
      Scroll,
      SongList,
      Loading
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .music-list
    position: fixed
    z-index: 100
    top: 0
    left: 0
    bottom: 0
    right: 0
    background: $color-background
    .back
      position absolute
      top: 0
      left: 6px
      z-index: 50
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
    .title
      position: absolute
      top: 0
      left: 10%
      z-index: 40
      width: 80%
      no-wrap()
      text-align: center
      line-height: 40px
      font-size: $font-size-large
      color: $color-text
    .bg-image
      position: relative
      width: 100%
      height: 0
      padding-top: 70%
      transform-origin: top
      background-size: cover
      .play-wrapper
        position: absolute
        bottom: 20px
        z-index: 50
        width: 100%
        .play
          box-sizing: border-box
          width: 135px
          padding: 7px 0
          margin: 0 auto
          text-align: center
          border: 1px solid $color-theme
          color: $color-theme
          border-radius: 100px
          font-size: 0
          .icon-play
            display: inline-block
            vertical-align: middle
            margin-right: 6px
            font-size: $font-size-medium-x
          .text
            display: inline-block
            vertical-align: middle
            font-size: $font-size-small
      .filter
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        background: rgba(7, 17, 27, 0.4)
    .bg-layer
      position: relative
      height: 100%
      background: $color-background
    .list
      position: fixed
      top: 0
      bottom: 0
      width: 100%
      background: $color-background
      .song-list-wrapper
        padding: 20px 30px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
