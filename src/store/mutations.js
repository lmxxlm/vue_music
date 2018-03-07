import * as types from './mutation-types'

const mutations = {
  [types.SET_SINGER](state,singer){
    state.singer = singer
  },
  [types.SET_PLAYING](state,flag){
    state.playing = flag
  },
  [types.SET_FULL_SCREEN](state,flag){
    state.fullScreen= flag
  },
  [types.SET_PLAY_LIST](state,playList){
    state.playList = playList
  },
  [types.SET_SEQUENCE_LIST](state,sequenceList){
    state.sequenceList = sequenceList
  },
  [types.SET_CURRENT_INDEX](state,index){
    state.currentIndex = index
  },
  [types.SET_MODE](state,mode){
    state.mode = mode
  },
  [types.SET_DISC](state,disc){
    state.disc = disc
  },
  [types.SET_TOP_LIST](state,topList){
    state.topList = topList
  },
  [types.SET_SEARCH_HISTORY](state,history){
    state.searchHistory = history
  },
  [types.SET_PLAY_HISTORY](state,playHistory){
    state.playHistory = playHistory
  },
  [types.SET_FAVORITE_LIST](state,favoriteList){
    state.favoriteList = favoriteList
  }
}

export default mutations
