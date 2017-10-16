<template>
  <article class="ui segment">
    <form class="ui form">
      <div class="field">
        <div class="two fields">
          <div class="field">
            <label>Front</label>
            <input type="text" v-model="front" readonly>
          </div>
          <div class="field">
            <label>Back</label>
            <input type="text" v-model="back" >
          </div>
        </div>
      </div>
      <div class="field" v-if="forvoPronunciation">
        <label>Forvo pronunciation</label>
        <audio controls>
          <source :src="forvoPronunciation" type="audio/mpeg">
        </audio>
      </div>
    </form>
  </article>
</template>

<script>
import { makeURLCompatible } from '../utils';

export default {
  name: 'Word',
  data() {
    return {
      front: '',
      back: '',
      forvoPronunciation: '',
    };
  },
  created() {
    this.fetchData();
  },
  watch: {
    $route: 'fetchData',
  },
  methods: {
    async fetchData() {
      const { deck } = this.$store.state;
      const { id } = this.$route.params;
      const activeWord = deck.find(word => makeURLCompatible(word.front) === id);
      this.front = activeWord.front;
      this.back = activeWord.back;
      const { body: { soundFile } } = await this.$http.get(`forvo/standard-pronunciation/de/${makeURLCompatible(activeWord.front)}`);
      this.forvoPronunciation = soundFile;
    },
  },
};
</script>

<style scoped></style>
