<template>
  <div class="singer" ref="singer">
    <list-view :data="singers" @select="singerDetail" ref="list"></list-view>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import ListView from 'base/listview/listview'
  import {getSingerList} from 'api/singer'
  import {ERR_OK} from 'api/config'
  import Singer from 'common/js/singer'
  import {mapMutations} from 'vuex'
  import {playlistMixin} from 'common/js/mixin'
  let HOT_NAME = '热门'
  let HOT_SINGER_NUM = 10
  export default {
    mixins:[playlistMixin],
    data(){
      return {
        singers:[]
      }
    },
    created(){
      this._getSingerList()
    },
    methods:{
      handlePlaylist(playList){
        const bottom = playList.length >0 ? '60px' : 0
        this.$refs.singer.style.bottom = bottom
        this.$refs.list.refresh()
      },
      singerDetail(singer){//上面不用写括号，这里也能直接得到值
        this.$router.push(`/singer/${singer.id}`)
        this.setSinger(singer)
      },
      _getSingerList(){
        getSingerList().then((res)=>{
          if(res.code === ERR_OK){
            this.singers = this._normalizeSinger(res.data.list);
          }
        })
      },
      //处理数据
      _normalizeSinger(list){
        const map = {
          hot:{
            title:HOT_NAME,
            items:[]
          }
        }

        list.forEach((item,index)=>{
          if(index < HOT_SINGER_NUM){
            map.hot.items.push(new Singer({
              id:item.Fsinger_mid,
              name:item.Fsinger_name
            }))
          }

          let key = item.Findex
          if(!map[key]){
            map[key]={
              title:key,
              items:[]
            }
          }
          map[key].items.push(new Singer({
            id:item.Fsinger_mid,
            name:item.Fsinger_name
          }))
        })

        let hot = []
        let ret = []
        for(let key in map){
          let val = map[key]
          if(val.title.match(/[a-zA-Z]/)){
            ret.push(val)
          }else if(val.title == '热门'){
            hot.push(val)
          }
        }
        ret.sort((a,b)=>{
          return a.title.charCodeAt(0)-b.title.charCodeAt(0)
        })
        return hot.concat(ret);
      },
      ...mapMutations({
        setSinger:'SET_SINGER'
      })
    },
    components: {
      ListView
    }
  }
</script>

<style lang="stylus" scoped type="text/stylus" rel="stylesheet/stylus">
  .singer
    position: absolute
    top: 88px
    bottom: 0
    width: 100%

</style>
