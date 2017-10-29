<template>
  <article class="ui segment">
    <form class="ui form" :key="word.front" :class="{ loading }">
      <div class="field" v-if="word.back">
        <div class="two fields">
          <div class="field">
            <label><i class="large crosshairs icon"></i></label>
            <input type="text" v-model="word.front">
          </div>
          <div class="field">
            <label><i class="large comment outline icon"></i></label>
            <input type="text" v-model="word.back" >
          </div>
        </div>
      </div>
      <div class="field">
        <div class="three fields">
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
        </div>
      </div>
      <div class="ui grid">
        <div class="four wide column" v-if="meta.pronunciations">
          <div class="ui two cards">
            <PronuncicationCard
              v-for="pronunciation in meta.pronunciations"
              :key="pronunciation.sound"
              :word="pronunciation.word"
              :sound="pronunciation.sound"
            />
          </div>
        </div>
        <div class="twelve wide column" v-if="meta.pictures">
          <div class="ui five cards">
            <PictureCard
              v-for="picture in meta.pictures"
              :key="picture.file"
              :image="picture.file"
            />
          </div>
        </div>
      </div>
    </form>
  </article>
</template>

<script>
import PronuncicationCard from '@/components/PronuncicationCard';
import PictureCard from '@/components/PictureCard';

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
  components: {
    PronuncicationCard,
    PictureCard,
  },
};
</script>

<style scoped></style>
