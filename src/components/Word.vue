<template>
  <article class="ui segment">
    <form class="ui form">
      <div class="field">
        <div class="two fields">
          <div class="field">
            <label>Front</label>
            <input type="text" v-model="word.front" readonly>
          </div>
          <div class="field">
            <label>Back</label>
            <input type="text" v-model="word.back" >
          </div>
        </div>
      </div>
      <div class="field">
        <label>Forvo pronunciation</label>
        <audio ref="forvoPronunciation" controls>
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
      word: {},
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
      const match = deck.find(word => makeURLCompatible(word.front) === id);
      this.word = match || {};
      if (!match) {
        return;
      }
      const { body: { soundFile } } = await this.$http.get(`forvo/standard-pronunciation/de/${makeURLCompatible(this.word.front)}`);
      this.$refs.forvoPronunciation.src = soundFile;
      this.$refs.forvoPronunciation.load();
    },
  },
};
</script>

<style scoped></style>
