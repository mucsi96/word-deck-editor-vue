<template>
  <article class="ui segment">
    <form class="ui form" :class="{ loading: meta && !Object.keys(meta).length }">
      <div class="field" v-if="word.back">
        <div class="two fields">
          <div class="field">
            <label><i class="large crosshairs icon"></i></label>
            <input type="text" v-model="word.front">
          </div>
          <div class="field">
            <label><i class="large comment outline icon"></i></label>
            <input type="text" v-model="word.back" >
          </div>
        </div>
      </div>
      <div class="field" v-if="meta">
        <div class="three fields">
          <div class="field" v-if="meta.wordClass">
            <label>Class</label>
            <input type="text" v-model="meta.wordClass" readonly>
          </div>
          <div class="field" v-if="meta.gender">
            <label>Gender</label>
            <input type="text" v-model="meta.gender" readonly>
          </div>
          <div class="field" v-if="meta.ipa">
            <label>IPA</label>
            <input type="text" v-model="meta.ipa" readonly>
          </div>
        </div>
      </div>
      <div class="ui grid" v-if="meta">
        <div class="four wide column" v-if="meta.pronunciations">
          <div class="ui two cards">
            <PronuncicationCard
              v-for="pronunciation in meta.pronunciations"
              :key="pronunciation.sound"
              :word="pronunciation.word"
              :sound="pronunciation.sound"
              :pined="word.pronunciation === pronunciation.sound"
              :pinedPhrase="word.pronunciationPhrase === pronunciation.sound"
              @pin="pinPronunciation(pronunciation.sound)"
              @unpin="pinPronunciation(undefined)"
              @pinPhrase="pinPronunciationPhrase(pronunciation.sound)"
              @unpinPhrase="pinPronunciationPhrase(undefined)"
            />
          </div>
        </div>
        <div class="twelve wide column" v-if="meta.pictures">
          <div class="ui five cards">
            <PictureCard
              v-for="picture in meta.pictures"
              :key="picture.file"
              :image="picture.file"
              :pined="word.picture === picture.file"
              @pin="pinPicture(picture.file)"
              @unpin="pinPicture(undefined)"
            />
          </div>
        </div>
      </div>
    </form>
  </article>
</template>

<script>
import PronuncicationCard from '@/components/PronuncicationCard';
import PictureCard from '@/components/PictureCard';

export default {
  name: 'Word',
  props: ['word', 'meta'],
  created() {
    this.fetchData();
  },
  methods: {
    pinPronunciation(sound) {
      this.$store.commit('updateWord', { word: this.word.front, prop: 'pronunciation', value: sound });
    },
    pinPronunciationPhrase(sound) {
      this.$store.commit('updateWord', { word: this.word.front, prop: 'pronunciationPhrase', value: sound });
    },
    pinPicture(picture) {
      this.$store.commit('updateWord', { word: this.word.front, prop: 'picture', value: picture });
    },
    async fetchData() {
      if (!this.word.front) return;
      await this.$store.dispatch('fetchWord', { word: this.word });
    },
  },
  components: {
    PronuncicationCard,
    PictureCard,
  },
};
</script>

<style scoped></style>
