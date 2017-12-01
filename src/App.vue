<template>
  <div>
    <Masthead @refresh="refresh" @erase="erase" />
    <main>
      <router-view :key="$route.name + ($route.params.id || '')" />
    </main>
  </div>
</template>
<script>
import 'semantic-ui-css/semantic.css';

import Masthead from '@/components/Masthead';

export default {
  name: 'app',
  components: {
    Masthead,
  },
  computed: {
    deck() {
      return this.$store.getters.deck;
    },
  },
  created() {
    if (!this.preloadTimeout) this.preload();
  },
  destroyed() {
    if (this.preloadTimeout) clearTimeout(this.preloadTimeout);
  },
  methods: {
    async preload() {
      const wordToPreload = this.$store.getters.wordToPreload;
      if (wordToPreload) {
        await this.$store.dispatch('fetchWord', { word: wordToPreload, preload: true });
      }
      this.preloadTimeout = setTimeout(() => this.preload(), 1000);
    },
    refresh() {
      this.deck.forEach((word) => {
        this.$store.commit('updateWord', { word: word.front, prop: 'preloading', value: undefined });
      });
    },
    erase() {
      this.$store.commit('erase');
    },
  },
};
</script>

<style>
main {
  margin-top: 4em;
  margin-left: 8em;
  margin-right: 8em;
}

.large.icon {
  font-size: 2em;
}

.invisible {
  visibility: hidden;
}
</style>
