<template>
  <div class="ui grid">
    <div class="four wide column">
      <Deck />
    </div>
    <div v-if="word" class="twelve wide stretched column">
      <Word :word="word" />
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
    word() {
      const { id } = this.$route.params;
      return this.$store.getters.deck.find(word => encodeURIComponent(word.front) === id);
    },
  },
};
</script>

<style scoped></style>
