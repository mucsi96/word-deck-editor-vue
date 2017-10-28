<template>
  <article class="ui segment">
    <form class="ui form" :key="word.front" :class="{ loading }">
      <div class="field" v-if="word.back">
        <div class="two fields">
          <div class="field">
            <label><i class="large crosshairs icon"></i></label>
            <input type="text" v-model="word.front" readonly>
          </div>
          <div class="field">
            <label><i class="large comment outline icon"></i></label>
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
      <div class="ui two column grid">
        <div class="column" v-if="meta.pronunciations">
          <div v-for="pronunciation in meta.pronunciations" :key="pronunciation.word" class="field">
            <label>{{pronunciation.word}}</label>
            <audio controls>
              <source :src="pronunciation.sound" type="audio/mpeg">
            </audio>
          </div>
        </div>
        <div class="ui two column grid" v-if="meta.pictures">
          <div class="column field" v-for="picture in meta.pictures" :key="picture.file">
            <img class="ui fluid image bordered" :src="picture.file" />
          </div>
        </div>
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
        const response = await this.$http.get(`meta/${encodeURIComponent(this.word.frontLanguage)}/${encodeURIComponent(this.word.front.toLowerCase())}`);
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
