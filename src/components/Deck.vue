<template>
  <article class="ui segments">
    <router-link
      v-for="word in deck"
      :key="word.front"
      tag="div"
      class="ui center aligned segment"
      :class="{
        green: word.preloading === 'done',
        loading: word.preloading === 'pending',
        red: word.preloading === 'failed',
      }"
      :to="{ name: 'word', params: { id: getWordId(word) }}"
    >
        <h4 class="ui header">{{word.front}}</h4>
        {{word.back}}
    </router-link>
    <router-link
      tag="div"
      class="ui center aligned blue segment"
      to="/add-new-words"
    >
        <i class="plus icon"></i>
    </router-link>
    <div class="ui center aligned red segment" @click="clear">
      <i class="refresh icon"></i>
    </div>
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
    if (!this.preloadTimeout) this.preload();
  },
  destroyed() {
    if (this.preloadTimeout) clearTimeout(this.preloadTimeout);
  },
  methods: {
    clear() {
      this.deck.forEach((word) => {
        this.$store.commit('updateWord', { word: word.front, prop: 'preloading', value: undefined });
      });
    },
    async preload() {
      const notPreloadedWord = this.deck.find(word => !word.preloading);
      if (notPreloadedWord) {
        this.$store.commit('updateWord', { word: notPreloadedWord.front, prop: 'preloading', value: 'pending' });
        const url = [
          'meta',
          encodeURIComponent(notPreloadedWord.frontLanguage),
          encodeURIComponent(notPreloadedWord.front.toLowerCase()),
        ].join('/');
        try {
          await this.$http.get(url);
          this.$store.commit('updateWord', { word: notPreloadedWord.front, prop: 'preloading', value: 'done' });
        } catch (err) {
          this.$store.commit('updateWord', { word: notPreloadedWord.front, prop: 'preloading', value: 'failed' });
        }
      }
      this.preloadTimeout = setTimeout(() => this.preload(), 1000);
    },
    getWordId(word) {
      return encodeURIComponent(word.front);
    },
  },
};
</script>

<style scoped>
  .segments > .segment {
    cursor: pointer;
  }
</style>
