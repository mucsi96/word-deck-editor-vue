<template>
  <article class="ui segment">
    <h4 class="ui header">Word</h4>
    <form class="ui form" :key="word.front">
      <div class="field">
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
    </form>
    <h4 class="ui header">Forvo pronunciations</h4>
    <form class="ui form" :class="{ loading: forvo.loading }" :key="word.front">
      <div v-for="pronunciation in forvo.pronunciations" :key="pronunciation.word" class="field">
        <label>{{pronunciation.word}}</label>
        <audio controls>
          <source :src="pronunciation.sound" type="audio/mpeg">
        </audio>
      </div>
    </form>
    <h4 class="ui header">Linguee pronunciations</h4>
    <form class="ui form" :class="{ loading: linguee.loading }" :key="word.front">
      <div class="field">
        <label>English</label>
        <input type="text" v-model="linguee.translation" readonly>
      </div>
      <div v-for="pronunciation in linguee.pronunciations" :key="pronunciation.word" class="field">
        <label>{{pronunciation.word}}</label>
        <audio controls>
          <source :src="pronunciation.sound" type="audio/mpeg">
        </audio>
      </div>
      <div class="field">
        <label>Tags</label>
        <input type="text" v-model="linguee.tags" readonly>
      </div>
    </form>
    <h4 class="ui header">Wiktionary pronunciations</h4>
    <form class="ui form" :class="{ loading: wiktionary.loading }" :key="word.front">
      <div class="field">
        <label>Word</label>
        <input type="text" v-model="wiktionary.word" readonly>
      </div>
      <div class="field">
        <label>IPA</label>
        <input type="text" v-model="wiktionary.ipa" readonly>
      </div>
      <div v-for="pronunciation in wiktionary.pronunciations" :key="pronunciation.word" class="field">
        <label>{{pronunciation.word}}</label>
        <audio controls>
          <source :src="pronunciation.sound">
        </audio>
      </div>
      <div v-for="picture in wiktionary.pictures" :key="picture.file" class="field">
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
      forvo: {
        loading: false,
        pronunciations: [],
      },
      linguee: {
        loading: false,
        pronunciations: [],
      },
      wiktionary: {
        loading: false,
        pronunciations: [],
        pictures: [],
      },
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
      this.fetchForvo();
      this.fetchLinguee();
      this.fetchWiktionary();
    },
    async fetchForvo() {
      try {
        this.forvo.loading = true;
        const response = await this.$http.get(`forvo/de/${encodeURIComponent(this.word.front)}`);
        if (!response.body) return;
        this.forvo.pronunciations = response.body;
      } finally {
        this.forvo.loading = false;
      }
    },
    async fetchLinguee() {
      try {
        this.linguee.loading = true;
        const response = await this.$http.get(`linguee/de/en/${encodeURIComponent(this.word.front)}`);

        if (!response.body) return;

        this.linguee.pronunciations = response.body.pronunciations;
        this.linguee.translation = response.body.translation;
        this.linguee.tags = response.body.tags.join(', ');
      } finally {
        this.linguee.loading = false;
      }
    },
    async fetchWiktionary() {
      try {
        this.wiktionary.loading = true;
        const response = await this.$http.get(`wiktionary/de/${encodeURIComponent(this.word.front)}`);

        if (!response.body) return;

        Object.assign(this.wiktionary, response.body);
      } finally {
        this.wiktionary.loading = false;
      }
    },
  },
};
</script>

<style scoped></style>
