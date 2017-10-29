<template>
  <div class="ui grid">
    <div class="four wide column">
      <Deck />
    </div>
    <div class="twelve wide stretched column">
      <Word />
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
};
</script>

<style scoped></style>
