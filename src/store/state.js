import {playMode} from 'common/js/config'
import {loadSearch,localPlay,localFavorite} from 'common/js/catch'
const state = {
  singer:{},
  playing:false,
  fullScreen:false,
  playList:[],
  sequenceList:[],
  currentIndex:-1,
  mode:playMode.sequence,
  disc:{},
  topList:{},
  searchHistory:loadSearch(),
  playHistory:localPlay(),
  favoriteList:localFavorite()

}

export default state
