<template>
  <article class="ui segment">
    <form class="ui form" @submit="submit" :class="{ loading }">
      <div class="field">
        <div class="basic large ui buttons">
          <button type="button" class="ui icon button" :class="{ active: mode === 'text' }" @click="setMode('text')">
            <i class="font icon"></i>
          </button>
          <button type="button" class="ui icon button" :class="{ active: mode === 'image' }" @click="setMode('image')">
            <i class="photo icon"></i>
          </button>
        </div>
      </div>
      <div v-if="mode === 'image'">
        <div class="field">
          <label><i class="large paste icon"></i></label>
          <textarea rows="1" v-model="backs" @paste="pasteImage"></textarea>
        </div>
        <div class="field">
          <label><i class="large image icon"></i></label>
          <img id="pastedImage" class="fluid image">
        </div>
      </div>
      <div class="ui horizontal segments">
        <div class="ui segment">
          <div class="ui block header"><i class="large crosshairs icon"></i></div>
          <div class="field" v-if="frontLanguage">
            <label><i class="large flag outline icon"></i></label>
            <select class="ui dropdown" v-model="frontLanguage">
              <option v-for="language in languages" :key="language.code" :value="language.code">{{language.name}}</option>
            </select>
          </div>
          <div class="field">
            <label><i class="large align justify icon"></i></label>
            <textarea rows="10" v-model="fronts"></textarea>
          </div>
          <div class="field">
            <button type="button" @click="fronts = ocrImage()" class="ui button primary icon"><i class="write icon"></i></button>
          </div>
        </div>
        <div class="ui segment">
          <div class="ui block header"><i class="large comment outline icon"></i></div>
          <div class="field" v-if="backLanguage">
            <label><i class="large flag outline icon"></i></label>
            <select class="ui dropdown" v-model="backLanguage">
              <option v-for="language in languages" :key="language.code" :value="language.code">{{language.name}}</option>
            </select>
          </div>
          <div class="field">
            <label><i class="large align justify icon"></i></label>
            <textarea rows="10" v-model="backs"></textarea>
          </div>
          <div class="field">
            <button type="button" @click="backs = ocrImage()" class="ui button primary icon"><i class="write icon"></i></button>
          </div>
        </div>
      </div>
      <button class="ui icon big primary button"><i class="checkmark icon"></i></button>
    </form>
  </article>
</template>

<script>
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.min.css';

export default {
  name: 'NewWordForm',
  data() {
    return {
      mode: localStorage.getItem('newWordMode') || 'text',
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
    setMode(mode) {
      this.mode = mode;
      localStorage.setItem('newWordMode', mode);
    },
    pasteImage(event) {
      const blob = Array.from(event.clipboardData.items).find(({ type }) => type.startsWith('image'));
      if (!blob) return;
      const reader = new FileReader();
      reader.onload = ({ target: { result } }) => {
        const image = document.getElementById('pastedImage');
        image.src = result;
        this.cropper = new Cropper(image);
      };
      reader.readAsDataURL(blob.getAsFile());
    },
    ocrImage() {
      return JSON.stringify(this.cropper.getData());
    },
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
