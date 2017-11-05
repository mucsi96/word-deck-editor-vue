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
      active-class="inverted"
    >
        <h4 class="ui header">{{word.front}}</h4>
        {{word.back}}
    </router-link>
  </article>
</template>

<script>
export default {
  name: 'Deck',
  props: ['deck'],
  methods: {
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

  .segments {
    height: 95vh;
    overflow-y: auto;
  }
</style>
