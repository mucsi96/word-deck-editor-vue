<template>
  <article class="ui segment">
    <span>{{word.front}}</span>
    <span>{{word.back}}</span>
  </article>
</template>

<script>
import { makeURLCompatible } from '@/utils';

export default {
  name: 'Word',
  props: ['id'],
  computed: {
    word() {
      const { deck } = this.$store.state;
      const { id } = this.$route.params;
      return deck.find(word => makeURLCompatible(word.front) === id);
    },
  },
};
</script>

<style scoped></style>
