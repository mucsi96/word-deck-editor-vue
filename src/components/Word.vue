<template>
  <article class="ui segment">
    <h4 class="ui header">Word</h4>
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
    </form>
    <h4 class="ui header">Forvo pronunciations</h4>
    <form class="ui form" :class="{ loading: forvo.loading }">
      <div v-for="pronunciation in forvo.pronunciations" :key="pronunciation.word" class="field">
        <label>{{pronunciation.word}}</label>
        <audio controls>
          <source :src="pronunciation.sound" type="audio/mpeg">
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
      forvo: {
        loading: false,
        pronunciations: [],
      },
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
      await this.fetchForvo();
    },
    async fetchForvo() {
      try {
        this.forvo.loading = true;
        const response = await this.$http.get(`forvo/de/${makeURLCompatible(this.word.front)}`);
        this.forvo.pronunciations = response.body;
      } finally {
        this.forvo.loading = false;
      }
    },
  },
};
</script>

<style scoped></style>
