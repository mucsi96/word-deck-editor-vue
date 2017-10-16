<template>
  <article class="ui segment">
    <span>{{front}}</span>
    <span>{{back}}</span>
    <div v-if="forvoPronunciation">
      Forvo pronunciation
      <audio controls>
        <source :src="forvoPronunciation" type="audio/mpeg">
      </audio>
    </div>
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
