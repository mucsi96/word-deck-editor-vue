<template>
  <div class="ui grid">
    <div class="four wide column">
      <Deck :deck="deck" @refresh="refresh" />
    </div>
    <div v-if="word" class="twelve wide stretched column">
      <Word :word="word" :meta="meta" />
    </div>
  </div>
</template>

<script>
import Deck from '@/components/Deck';
import Word from '@/components/Word';

export default {
  name: 'DeckAndWord',
  components: {
    Deck,
    Word,
  },
  computed: {
    deck() {
      return this.$store.getters.deck;
    },
    word() {
      const { id } = this.$route.params;
      return this.$store.getters.deck.find(word => encodeURIComponent(word.front) === id);
    },
    meta() {
      return this.$store.getters.meta;
    },
  },
  methods: {
    refresh() {
      this.deck.forEach((word) => {
        this.$store.commit('updateWord', { word: word.front, prop: 'preloading', value: undefined });
      });
    },
  },
};
</script>

<style scoped></style>
