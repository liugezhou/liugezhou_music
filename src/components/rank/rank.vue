<template>
  <div class="rank" ref="rank">
    <scroll class="toplist" ref="toplist" :data="topList">
      <ul>
        <li class="item" v-for="(item,index) of topList" :key="index" @click="seletToplist(item)">
          <div class="icon">
            <img v-lazy="item.picUrl" width="100" height="100">
          </div>
          <ul class="songlist">
            <li class="song" v-for="(song,index) of item.songList" :key="index">
              <span>{{index + 1}}</span>
              <span>{{song.songname}}--{{song.singername}}</span>
            </li>
          </ul>
        </li>
      </ul>
      <div class="loading-container" v-if="!topList.length">
        <loading></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>
<script>
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import { getTopList } from 'api/rank'
  import { ERR_OK } from 'api/config'
  import { playlistMixin} from 'common/js/mixin'
  import { mapMutations } from 'vuex'

  export default {
    mixins: [playlistMixin],
    data() {
      return {
        topList: []
      }
    },
    components: {
      Scroll,
      Loading
    },
    created() {
      this._getTopList()
    },
    methods: {
      handlePlaylist(playlist) {
        const bottom = playlist.length >0 ? '60px' : ''
        this.$refs.rank.style.bottom = bottom
        this.$refs.toplist.refresh()
      },
      _getTopList() {
        getTopList().then(res=> {
          if(Object.is(res.code, ERR_OK)) {
            this.topList = res.data.topList
          }
        })
      },
      seletToplist(item) {
        this.$router.push({
          path: `/rank/${item.id}`
        })
        this.SET_TOPLIST(item)
      },
      ...mapMutations({
        SET_TOPLIST:'SET_TOPLIST'
      })
    }
  }
</script>
<style lang="stylus" scoped>
  @import '~common/stylus/variable'
  @import '~common/stylus/mixin'
  .rank
    position fixed
    width 100%
    top 88px
    bottom 0
    .toplist
      height 100%
      overflow hidden
      .item
        display flex
        margin 0 20px
        padding-top 20px
        height 100px
        &:last-child
          padding-bottom 20px
        .icon
          flex 0 0 100px
          width 100px
          height 100px
        .songlist
          flex 1
          display flex
          flex-direction column
          justify-content center
          padding 0 20px
          height 100px
          overflow hidden
          background $color-highlight-background
          color $color-text-d
          font-size $font-size-small
          .song
            no-wrap()
            line-height 26px
      .loading-container
        position absolute 
        width 100% 
        height 50%
        top 50%
        transform translateY(-50%)
</style>

