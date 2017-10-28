<template>
  <article class="ui vertical fluid icon menu">
    <router-link
      class="item"
      v-for="word in deck"
      :key="word.front"
      :to="{ name: 'word', params: { id: getWordId(word) }}"
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
  methods: {
    getWordId(word) {
      return encodeURIComponent(word.front);
    },
  },
};
</script>

<style scoped></style>
