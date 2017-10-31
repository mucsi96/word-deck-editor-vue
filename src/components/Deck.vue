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
    <div class="ui center aligned red segment" @click="$emit('refresh')">
      <i class="refresh icon"></i>
    </div>
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
</style>
