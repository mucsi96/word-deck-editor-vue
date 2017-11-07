<template>
  <div class="ui form" :class="{ loading }">
    <div class="ui relaxed divided list" v-if="suggestions.length">
      <div class="item" v-for="(word, index) in words" :key="word" v-if="suggestions[index].length">
        <div class="content">
          <div class="header">{{word}}</div>
          <div class="description">
            <button
              type="button"
              class="ui button"
              v-for="item in suggestions[index]"
              :key="item.suggestion"
              @click="$emit('applySuggestion', { word, suggestion: item })"
            >
              {{item.suggestion}}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from 'vue';

export default {
  name: 'Spellcheck',
  props: ['words', 'language'],
  data() {
    return {
      suggestions: [],
      loading: false,
      timeout: null,
    };
  },
  created() {
    this.spellCheck();
  },
  watch: {
    words: 'spellCheck',
  },
  methods: {
    withLoader(func) {
      return async () => {
        try {
          this.loading = true;
          await func();
        } finally {
          this.loading = false;
        }
      };
    },
    withDebounce(func, wait) {
      return () => {
        const later = () => {
          this.timeout = null;
          func();
        };
        clearTimeout(this.timeout);
        this.timeout = setTimeout(later, wait);
      };
    },
    spellCheck() {
      this.withDebounce(this.withLoader(async () => {
        const response = await Vue.http.post(`spell/${this.language}`, {
          words: this.words,
        });
        if (!response.body || !Array.isArray(response.body)) return;
        this.suggestions = response.body;
      }), 300)();
    },
  },
};
</script>
<style scoped>
.description {
  margin-top: 0.5em;
}

.button {
  margin-bottom: 0.3em;
}
</style>


