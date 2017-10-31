<template>
  <article class="ui vertical fluid icon menu">
    <router-link
      class="item"
      v-for="word in deck"
      :key="word.front"
      :to="{ name: 'word', params: { id: getWordId(word) }}"
      :class="{ disabled: !word.preloaded }"
    >
      <div class="header">{{word.front}}</div>
      {{word.back}}
    </router-link>
    <router-link
      to="/add-new-words"
      class="item"
    >
      <i class="plus icon"></i>
    </router-link>
  </article>
</template>

<script>
export default {
  name: 'Deck',
  computed: {
    deck() {
      return this.$store.state.deck;
    },
  },
  created() {
    setTimeout(() => this.preload(), 100);
  },
  methods: {
    async preload() {
      const notPreloadedWord = this.deck.find(word => !word.preloaded);
      if (notPreloadedWord) {
        console.log(`Preloading ${notPreloadedWord.front}...`);
        await this.$http.get(`meta/${encodeURIComponent(notPreloadedWord.frontLanguage)}/${encodeURIComponent(notPreloadedWord.front.toLowerCase())}`);
        this.$store.commit('updateWord', { word: notPreloadedWord.front, prop: 'preloaded', value: true });
      }
      setTimeout(() => this.preload(), 100);
    },
    getWordId(word) {
      return encodeURIComponent(word.front);
    },
  },
};
</script>

<style scoped></style>
