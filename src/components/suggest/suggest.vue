<template>
  <scroll class="suggest"  
          :data="result"  
          ref="suggest" 
          :pullup="pullup"
          @scrollToEnd="searchMore">
    <ul class="suggest-list">
      <li @click="selectItem(item)" class="suggest-item" v-for="(item,index) in result">
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
      <loading v-show="hasMore" title=""></loading>
    </ul>
  </scroll>
</template>

<script>
import { search } from 'api/search'
import { ERR_OK } from 'api/config'
import { createSong } from 'common/js/song'
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import Singer from 'common/js/singer'
import { mapMutations, mapActions} from 'vuex'

const TYPE_SINGER = 'singer'
const perpage = 20

export default {
  props: {
    query: {
      type: String,
      default: ''
    },
    showSinger: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      page: 1,
      result: [],
      pullup: true,
      hasMore: true
    }
  },
  methods: {
    search() {
      this.hasMore = true
      this.page = 1
      this.$refs.suggest.scrollTo(0,0)
      search(this.query, this.page, this.showSinger, perpage).then( res=> {
        if(Object.is(res.code,ERR_OK)) {
          this.result = this._genResult(res.data)
          this._checkmore(res.data)
        }
      })
    },
    _checkmore(res){
      const songs = res.song
      if(!songs.list.length && (songs.curum + songs.curpage * 20) > songs.totalnum) {
        this.hasMore = false
      }
    },
    _genResult(data){
      let ret =[]
      if(data.zhida && data.zhida.singerid) {
        ret.push({...data.zhida, ...{type: TYPE_SINGER}})
      }
      if(data.song) {
        ret = ret.concat(this._normalizeSongs(data.song.list))
      }
      return ret
    },
    _normalizeSongs(list){
      let ret = []
      list.forEach( (musicData) => {
        if(musicData.songid && musicData.albummid) {
          ret.push(createSong(musicData))
        }
      })
      return ret
    },
    getIconCls(item) {
      if(Object.is(item.type, TYPE_SINGER)) {
        return 'icon-mine'
      }else {
        return 'icon-music'
      }
    },
    getDisplayName(item) {
      if(Object.is(item.type , TYPE_SINGER)) {
        return item.singername
      }else {
        return `${item.name} - ${(item.singer)}`
      }
    },
    searchMore(){
      if(!this.hasMore) {
        return
      }
      this.page ++
      search(this.query, this.page, this.showSinger, perpage).then( res=> {
        if(Object.is(res.code,ERR_OK)) {
          this.result =this.result.concat(this._genResult(res.data)) 
          this._checkmore(res.data)
        }
      })
    },
    selectItem(item) {
      if(Object.is(item.type,TYPE_SINGER)) {
        const singer = new Singer({
          id: item.singermid,
          name: item.singername
        })
        this.$router.push({
          path: `/search/${singer.id}`
        })
        this.setSinger(singer)
      }else{
        this.insertSong(item)
      }
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    }),
    ...mapActions([
      'insertSong'
    ])
  },
  watch: {
    query(newQuery) {
      this.search(newQuery)
    }
  },
  components: {
    Scroll,
    Loading
  }
}
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
      .icon
        flex: 0 0 30px
        width: 30px
        [class^="icon-"]
          font-size: 14px
          color: $color-text-d
      .name
        flex: 1
        font-size: $font-size-medium
        color: $color-text-d
        overflow: hidden
        .text
          no-wrap()
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
