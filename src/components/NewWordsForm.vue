<template>
  <article class="ui segment">
    <form class="ui form" @submit="submit" :class="{ loading }">
      <div class="field">
        <div class="two fields">
          <div class="field" v-if="frontLanguage">
            <label>Front</label>
            <select class="ui dropdown" v-model="frontLanguage">
              <option v-for="language in languages" :key="language.code" :value="language.code">{{language.name}}</option>
            </select>
          </div>
          <div class="field" v-if="backLanguage">
            <label>Back</label>
            <select class="ui dropdown" v-model="backLanguage">
              <option v-for="language in languages" :key="language.code" :value="language.code">{{language.name}}</option>
            </select>
          </div>
        </div>
      </div>
      <div class="field">
        <div class="two fields">
          <div class="field">
            <textarea rows="10" v-model="fronts"></textarea>
          </div>
          <div class="field">
            <textarea rows="10" v-model="backs"></textarea>
          </div>
        </div>
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
      loading: false,
      languages: [],
      fronts: '',
      backs: '',
    };
  },
  created() {
    this.fetchData();
  },
  watch: {
    $route: 'fetchData',
  },
  methods: {
    submit(event) {
      event.preventDefault();
      const backs = this.backs.toString().split('\n');
      const words = this.fronts.toString().split('\n').map((front, index) => ({
        front,
        back: backs[index],
        frontLanguage: this.frontLanguage,
        backLanguage: this.backLanguage,
      }));
      localStorage.setItem('frontLanguage', this.frontLanguage);
      localStorage.setItem('backLanguage', this.backLanguage);
      this.$store.commit('addNewWords', words);
    },
    async fetchData() {
      try {
        this.frontLanguage = localStorage.getItem('frontLanguage') || 'de';
        this.backLanguage = localStorage.getItem('backLanguage') || 'en';
        this.loading = true;
        const response = await this.$http.get('languages');
        if (!response.body) return;
        Object.assign(this.languages, response.body);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped></style>
