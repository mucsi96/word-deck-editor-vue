<template>
  <div class="ui form" :class="{ loading }">
    <div class="ui relaxed divided list" v-if="suggestions && suggestions.length">
      <div class="item" v-for="(word, index) in lines" :key="word" v-if="suggestions[index] && suggestions[index].length">
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
import debounce from 'debounce-promise';

const getSuggestions = async ({ words, language, start, end }) => {
  start();
  const response = await Vue.http.post(`spell/${language}`, {
    words,
  });
  end();
  if (!response.body || !Array.isArray(response.body)) return [];
  return response.body;
};

const debouncedGetSuggestions = debounce(getSuggestions, 300);

export default {
  name: 'Spellcheck',
  props: ['words', 'language'],
  data() {
    return {
      loading: false,
      timeout: null,
    };
  },
  computed: {
    lines() {
      return this.words.split('\n');
    },
  },
  asyncComputed: {
    async suggestions() {
      return debouncedGetSuggestions({
        words: this.lines,
        language: this.language,
        start: () => { this.loading = true; },
        end: () => { this.loading = false; },
      });
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


