<template>
<transition name="slide">
  <music-list :songs="songs" :title="title" :bg-image="bgImage"></music-list>
</transition>
</template>
<script>
  import { mapGetters} from 'vuex'
  import { getSingerDetail} from 'api/singer'
  import { ERR_OK} from 'api/config'
  import {createSong, isValidMusic, processSongsUrl} from 'common/js/song'
  import MusicList from 'components/music-list/music-list'

  export default {
    data(){
      return {
        songs:[]
      }
    },
    computed: {
      title() {
        return this.singer.name
      },
      bgImage(){
        return this.singer.avatar
      },
      ...mapGetters([
        'singer'
      ])
    },
    created() {
      this._getDetail()

    },
    methods: {
      _getDetail() {
        if(!this.singer.id) {
          this.$router.push('/singer')
          return
        }
        getSingerDetail(this.singer.id).then((res) => {
          if(res.code === ERR_OK) {
             processSongsUrl(this._normalizeSongs(res.data.list)).then((songs) => {
              this.songs = songs
            })
          }
        })
      },
      _normalizeSongs(list){
        let ret = []
        list.forEach((item) => {
          let {musicData} =item
          if (isValidMusic(musicData)) {
            ret.push(createSong(musicData))
          }
        })
        return ret
      }
    },
    components: {
      MusicList
    }
  }
</script>
<style lang="stylus" scoped>
  @import "~common/stylus/variable"
  .slide-enter-active,.slide-leave-active
    transition: all .3s
  .slide-enter,.slide-leave-to
    transform: translate3d(100%,0,0)
</style>

