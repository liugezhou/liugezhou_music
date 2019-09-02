import * as types from './mutation-types'

const mutations = {
  [types.SET_SINGER](state, singer) {
    state.singer = singer
  },
  [types.SET_PLAYING_STATE](state, flag) {
    state.playing = flag
  },
  [types.SET_FULLSCREEN](state, flag) {
    state.fullScreen = flag
  },
  [types.SET_PLAYLIST](state, list) {
    state.playlist = list
  },
  [types.SET_SEQUENCELIST](state, list) {
    state.sequenceList = list
  },
  [types.SET_MODE](state, mode) {
    state.mode = mode
  },
  [types.SET_CURRENTINDEX](state, index) {
    state.currentIndex = index
  },
  [types.SET_DISC](state, disc) {
    state.disc = disc
  },
  [types.SET_TOPLIST](state, toplist) {
    state.toplist = toplist
  },
  [types.SET_SEARCH_HISTORY](state, history) {
    state.searchHistory = history
  }
}

export default mutations
