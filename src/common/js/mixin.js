import {mapGetters,mapMutations,mapActions} from 'vuex'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'

export const playlistMixin = {
  computed: {
    ...mapGetters([
      'playList'
    ])
  },
  mounted() {
    this.handlePlaylist(this.playList)
  },
  activated() {
    this.handlePlaylist(this.playList)
  },
  watch: {
    playList(newVal) {
      this.handlePlaylist(newVal)
    }
  },
  methods: {
    handlePlaylist() {
      throw new Error('component must implement handlePlaylist method')
    }
  }
}

export const playerMixin = {
  computed:{
    iconMode(){
      return this.mode === playMode.sequence ? 'icon-sequence' : (this.mode === playMode.loop ? 'icon-loop': 'icon-random')
    },
    ...mapGetters([
      'sequenceList',
      'currentSong',
      'mode',
      'playList',
      'favoriteList'
    ])
  },
  methods:{
    changeMode(){
      //改变播放模式
      const mode = (this.mode+1) % 3
      this.setMode(mode)
      let list = null
      if(mode === playMode.random){
        list = shuffle(this.sequenceList)
      }else{
        list = this.sequenceList
      }
      this.resetCurrentIndex(list)
      this.setPlayList(list)//放到播放列表里
    },
    resetCurrentIndex(list){
      let index = list.findIndex((item)=>{
        return item.id === this.currentSong.id
      })
      this.setCurrentIndex(index)
    },
    getFavoriteIcon(song){
      if(this.isFavorite(song)){
        return 'icon-favorite'
      }
      return 'icon-not-favorite'
    },
    toggleFavorite(song){
      if(this.isFavorite(song)){
        this.deleteFavoriteList(song)
      }else{
        this.saveFavoriteList(song)
      }
    },
    isFavorite(song){
      const index = this.favoriteList.findIndex((item) => {
        return item.id === song.id
      })
      return index > -1
    },
    ...mapActions([
      'saveFavoriteList',
      'deleteFavoriteList'
    ]),
    ...mapMutations({
      setPlaying:'SET_PLAYING',
      setCurrentIndex:'SET_CURRENT_INDEX',
      setMode:'SET_MODE',
      setPlayList:'SET_PLAY_LIST'
    })
  }
}

export const searchMixin = {
  data(){
    return {
      query:'',
      refreshDelay:100
    }
  },
  computed:{
    ...mapGetters([
      'searchHistory'
    ])
  },
  methods:{
    inputBlur(){
      this.$refs.searchBox.blur()
    },
    saveSearch(){
      this.saveSearchHistory(this.query)
    },
    onQueryChange(newQuery){//记住上面的事件不用加括号
      this.query = newQuery
    },
    selectKey(key){
      this.$refs.searchBox.setKey(key)
    },
    ...mapActions([
      'saveSearchHistory',
      'deleteSearchHistory'
    ])
  }
}
