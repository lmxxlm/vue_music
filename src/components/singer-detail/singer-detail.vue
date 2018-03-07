<template>
  <transition name="slide">
    <music-list  :songs="songs" :title="title" :bg-img="bgImg"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
  import {getSingerDetail} from 'api/singer'
  import {ERR_OK} from 'api/config'
  import {mapGetters} from 'vuex'
  import {createSong} from 'common/js/song'
  import MusicList from 'components/music-list/music-list'

  export default{
    computed:{//这里是计算属性，一般都是函数性质
      title(){
        return this.singer.name
      },
      bgImg(){
        return this.singer.avatar
      },
      ...mapGetters([
        'singer'
      ])

    },
    data(){
       return {
         songs:[],
       }
    },
    created() {
      this._getDetail()
    },
    methods:{
      _getDetail() {
        if(!this.singer.id){//解决一刷新就没值得状况
            this.$router.push('/singer')
          return
        }
        getSingerDetail(this.singer.id).then((res) => {
          console.log(this.singer.id+res.code)
          if (res.code === ERR_OK) {
             this.songs=this._normalizeSong(res.data.list)
          }
        })
      },
      _normalizeSong(list){
        let ret=[]
        list.forEach((item)=>{
           let {musicData} = item
          if (musicData.songid && musicData.albummid) {
            ret.push(createSong(musicData))
          }
        })
        return ret
      }
    },
    components:{
      MusicList
    }
  }

</script>

<style lang="stylus" scoped type="text/stylus" rel="stylesheet/stylus">
   @import "~common/stylus/variable"
  .slide-enter-active,.slide-leave-active
    transition: all 0.5s
  .slide-enter,.slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
