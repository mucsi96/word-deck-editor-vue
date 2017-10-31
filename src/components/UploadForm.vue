<template>
  <article class="ui segment">
    <form class="ui form" @submit="upload">
      <div class="field">
        <label>Course URL</label>
        <input type="text" v-model="memrise.courseUrl">
      </div>
      <div class="field">
        <router-link
          to="/"
          class="ui basic big icon button"
        >
          <i class="arrow left icon"></i>
        </router-link>
        <button type="submit" class="ui big icon primary button">
          <i class="cloud upload icon"></i>
        </button>
      </div>
    </form>
  </article>
</template>

<script>
export default {
  name: 'UploadForm',
  data() {
    return {
      memrise: {
        courseUrl: '',
      },
    };
  },
  methods: {
    upload(event) {
      event.preventDefault();
      this.$store.dispatch('upload', { provider: 'memrise' });
    },
  },
};
</script>

