<template>
  <article class="ui segment">
    <h4 class="ui header">Word</h4>
    <form class="ui form" :key="word.front" :class="{ loading }">
      <div class="field" v-if="word.back">
        <div class="two fields">
          <div class="field">
            <label>Front</label>
            <input type="text" v-model="word.front" readonly>
          </div>
          <div class="field">
            <label>Back</label>
            <input type="text" v-model="word.back" >
          </div>
        </div>
      </div>
      <div class="field" v-if="meta.wordClass">
        <label>Class</label>
        <input type="text" v-model="meta.wordClass" readonly>
      </div>
      <div class="field" v-if="meta.gender">
        <label>Gender</label>
        <input type="text" v-model="meta.gender" readonly>
      </div>
      <div class="field" v-if="meta.ipa">
        <label>IPA</label>
        <input type="text" v-model="meta.ipa" readonly>
      </div>
      <div v-if="meta.pronunciations" v-for="pronunciation in meta.pronunciations" :key="pronunciation.word" class="field">
        <label>{{pronunciation.word}}</label>
        <audio controls>
          <source :src="pronunciation.sound" type="audio/mpeg">
        </audio>
      </div>
      <div v-if="meta.pictures" v-for="picture in meta.pictures" :key="picture.file" class="field">
        <img class="ui medium bordered image" :src="picture.file" />
      </div>
    </form>
  </article>
</template>

<script>
export default {
  name: 'Word',
  data() {
    return {
      word: {},
      meta: {},
      loading: false,
    };
  },
  created() {
    this.fetchData();
  },
  watch: {
    $route: 'fetchData',
  },
  methods: {
    async fetchData() {
      const { deck } = this.$store.state;
      const { id } = this.$route.params;
      const match = deck.find(word => encodeURIComponent(word.front) === id);
      this.word = match || {};
      if (!match) {
        return;
      }
      try {
        this.loading = true;
        this.meta = {};
        const response = await this.$http.get(`meta/de/${encodeURIComponent(this.word.front)}`);
        if (!response.body) return;
        Object.assign(this.meta, response.body);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped></style>
