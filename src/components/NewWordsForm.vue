<template>
  <article class="ui segment">
    <form class="ui form" @submit="submit">
      <div class="field">
        <label>Words</label>
        <textarea rows="10" v-model="words"></textarea>
      </div>
      <button class="ui button">Add words</button>
    </form>
  </article>
</template>

<script>
export default {
  name: 'NewWordForm',
  data() {
    return {
      words: ['word 1 front', 'word 1 back', 'word 2 front', 'word 2 back'].join('\n'),
    };
  },
  methods: {
    submit(event) {
      event.preventDefault();
      const words = this.words.toString().split('\n').reduce((result, word) => {
        if (!word) return result;

        const restWords = result.slice(0, -1);
        const lastWord = result[result.length - 1];

        if (lastWord && !lastWord.back) {
          return [...restWords, { ...lastWord, back: word }];
        }

        return [...result, { front: word }];
      }, []);
      this.$store.commit('addNewWords', words);
    },
  },
};
</script>

<style scoped></style>
