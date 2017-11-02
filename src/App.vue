<template>
  <div>
    <Masthead />
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
      const notPreloadedWord = this.deck.find(word => !word.preloading);
      if (notPreloadedWord) {
        await this.$store.dispatch('fetchWord', { word: notPreloadedWord, preload: true });
      }
      this.preloadTimeout = setTimeout(() => this.preload(), 1000);
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
