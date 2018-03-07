
import * as types from './mutation-types'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'
import {saveSearch,deleteSearch,clearSearch,savePlay,saveFavorite,deleteFavorite} from 'common/js/catch'

function getRandomIndex(list,song){
  return list.findIndex((item)=>{
    return item.id === song.id
  })
}

export const selectPlay = function({commit,state},{list,index}){
  commit(types.SET_SEQUENCE_LIST,list)
  if(state.mode === playMode.random){
    const randomList = shuffle(list)
    index = getRandomIndex(randomList,list[index])
    commit(types.SET_PLAY_LIST,randomList)
  }else{
    commit(types.SET_PLAY_LIST,list)
  }
  commit(types.SET_CURRENT_INDEX,index)
  commit(types.SET_FULL_SCREEN,true)
  commit(types.SET_PLAYING,true)
}

export const randomPlay = function({commit},{list}){
  commit(types.SET_MODE,playMode.random)
  commit(types.SET_SEQUENCE_LIST,list)
  const randomList = shuffle(list)
  commit(types.SET_PLAY_LIST,randomList)
  commit(types.SET_CURRENT_INDEX,0)
  commit(types.SET_FULL_SCREEN,true)
  commit(types.SET_PLAYING,true)
}

export const insertSong = function({commit,state},song){//这里的song不用{}
  let playList = state.playList.slice()//获取副本
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex
  let currentSong = playList[currentIndex]

  //找下插入这首歌在原来的列表里有没有，以及索引是什么
  let fpindex = getRandomIndex(playList,song)
  //插入在当前索引的后面
  currentIndex++
  //已经插入玩的列表
  playList.splice(currentIndex,0,song)
  //证明原列表有该条数据
  if(fpindex > -1){
    if(currentIndex > fpindex){
      playList.splice(fpindex,1)
      //整个数组的长度减一
      currentIndex--
    }else{
      playList.splice(fpindex+1,1)
    }
  }

  let currentsIndex = getRandomIndex(sequenceList,currentSong)+1
  let fsindex = getRandomIndex(sequenceList,song)
  sequenceList.splice(sequenceList,0,song)

  if(fsindex > -1){
    if(currentsIndex > fsindex){
      sequenceList.splice(fsindex,1)
    }else{
      sequenceList.splice(fsindex+1,1)
    }
  }

  commit(types.SET_PLAY_LIST,playList)
  commit(types.SET_SEQUENCE_LIST,sequenceList)
  commit(types.SET_CURRENT_INDEX,currentIndex)
  commit(types.SET_FULL_SCREEN,true)
  commit(types.SET_PLAYING,true)
}

export const saveSearchHistory = function({commit,state},query){
  commit(types.SET_SEARCH_HISTORY,saveSearch(query))
}

export const deleteSearchHistory = function({commit,state},query){
  commit(types.SET_SEARCH_HISTORY,deleteSearch(query))
}

export const clearSearchHistory = function({commit,state},query){
  commit(types.SET_SEARCH_HISTORY,clearSearch())
}

export const deleteSong = function({commit,state},song){
  let playList = state.playList.slice()//获取副本
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex
  let pindex = getRandomIndex(playList,song)
  playList.splice(pindex,1)
  let sindex = getRandomIndex(sequenceList,song)
  sequenceList.splice(sindex,1)

  if(currentIndex > pindex || currentIndex === playList.length){
    currentIndex--
  }

  commit(types.SET_SEQUENCE_LIST,sequenceList)
  commit(types.SET_PLAY_LIST,playList)
  commit(types.SET_CURRENT_INDEX,currentIndex)

  playList = playList > 0 //只能给自己进行这么赋值
  commit(types.SET_PLAYING,playList)
}

export const deleteSongList = function({commit}){
  commit(types.SET_SEQUENCE_LIST,[])
  commit(types.SET_PLAY_LIST,[])
  commit(types.SET_CURRENT_INDEX,-1)
  commit(types.SET_PLAYING,false)
}

export const savePlayHistory = function({commit},song){
  commit(types.SET_PLAY_HISTORY,savePlay(song))
}

export const saveFavoriteList = function({commit},song){
  commit(types.SET_FAVORITE_LIST,saveFavorite(song))
}

export const deleteFavoriteList = function({commit},song){
  commit(types.SET_FAVORITE_LIST,deleteFavorite(song))
}
