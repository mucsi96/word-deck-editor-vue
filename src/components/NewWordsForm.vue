<template>
  <div class="ui grid">
    <div :class="[(cropper ? 'five' : 'sixteen'), 'wide', 'column']" >
      <article class="ui segment">
        <form class="ui form" @submit="submit" :class="{ loading }">
          <div class="field">
            <label><i class="large photo icon"></i></label>
            <textarea rows="1" @paste="pasteImage"></textarea>
          </div>
          <div class="ui horizontal segments">
            <div class="ui segment" :class="{ loading: front.loading }">
              <div class="ui block header"><i class="large crosshairs icon"></i></div>
              <div class="field" v-if="front.language">
                <label><i class="large flag outline icon"></i></label>
                <select class="ui dropdown" v-model="front.language">
                  <option v-for="language in languages" :key="language.code" :value="language.code">{{language.name}}</option>
                </select>
              </div>
              <div class="field">
                <label>
                  <i class="large align justify icon"></i>
                  <button v-if="cropper" type="button" @click="ocrImage('front')" class="ui button icon"><i class="crop icon"></i></button>
                </label>
                <textarea :lang="front.language" spellcheck :rows="front.items.split('\n').length || 10" v-model="front.items"></textarea>
              </div>
              <div class="field">
                <Spellcheck :words="front.items" :language="front.language" @applySuggestion="applyFrontSuggestion" />
              </div>
            </div>
            <div class="ui segment" :class="{ loading: back.loading }">
              <div class="ui block header"><i class="large comment outline icon"></i></div>
              <div class="field" v-if="back.language">
                <label><i class="large flag outline icon"></i></label>
                <select class="ui dropdown" v-model="back.language">
                  <option v-for="language in languages" :key="language.code" :value="language.code">{{language.name}}</option>
                </select>
              </div>
              <div class="field">
                <label>
                  <i class="large align justify icon"></i>
                  <button v-if="cropper" type="button" @click="ocrImage('back')" class="ui button icon"><i class="crop icon"></i></button>
                </label>
                <textarea :lang="back.language" spellcheck :rows="back.items.split('\n').length || 10" v-model="back.items"></textarea>
              </div>
              <div class="field">
                <Spellcheck :words="back.items" :language="back.language" @applySuggestion="applyBackSuggestion" />
              </div>
            </div>
          </div>
          <router-link
            to="/"
            class="ui basic big icon button"
          >
            <i class="arrow left icon"></i>
          </router-link>
          <button class="ui icon big primary button" :disabled="!this.front.items"><i class="checkmark icon"></i></button>
        </form>
      </article>
    </div>
    <div class="eleven wide stretched column" :class="{ invisible: !cropper }">
      <article class="ui segment">
        <form class="ui form">
          <div class="field">
            <label>
              <button type="button" @click="cropper.zoom(0.1)" class="ui button icon"><i class="zoom icon"></i></button>
              <button type="button" @click="cropper.zoom(-0.1)" class="ui button icon"><i class="zoom out icon"></i></button>
            </label>
            <div>
              <img id="pastedImage">
            </div>
          </div>
        </form>
      </article>
    </div>
  </div>
</template>

<script>
/* global Tesseract */
import Cropper from 'cropperjs';
import Spellcheck from '@/components/Spellcheck';
import 'cropperjs/dist/cropper.min.css';

export default {
  name: 'NewWordForm',
  data() {
    return {
      mode: localStorage.getItem('newWordMode') || 'text',
      loading: false,
      languages: [],
      front: {
        language: localStorage.getItem('frontLanguage') || 'de',
        items: '',
        loading: false,
      },
      back: {
        language: localStorage.getItem('backLanguage') || 'en',
        items: '',
        loading: false,
      },
      cropper: null,
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
        this.cropper = new Cropper(image, {
          autoCrop: false,
          zoomOnWheel: false,
          viewMode: 3,
        });
      };
      reader.readAsDataURL(blob.getAsFile());
    },
    ocrImage(side) {
      const section = side === 'front' ? this.front : this.back;
      section.loading = true;
      const croppedCanvas = this.cropper.getCroppedCanvas();
      this.cropper.clear();
      Tesseract.recognize(croppedCanvas, {
        lang: this.languages.find(lang => lang.code === section.language).code3,
      })
        .then(({ text }) => {
          section.loading = false;
          this.saveText(side, text);
        });
    },
    saveText(side, text) {
      const section = side === 'front' ? this.front : this.back;
      const newItems = text
        .trim()
        .split('\n')
        .map(line => line.split(',')[0])
        .map(line => line.replace(/^[-.]/, ''))
        .map(line => line.trim())
        .filter(line => line);

      if (section.items) {
        section.items = [section.items, ...newItems].join('\n');
      } else {
        section.items = [...newItems].join('\n');
      }
    },
    submit(event) {
      event.preventDefault();
      const backItems = this.back.items.toString().split('\n');
      const words = this.front.items.toString().split('\n').map((front, index) => ({
        front,
        back: backItems[index],
        frontLanguage: this.front.language,
        backLanguage: this.back.language,
      }));
      localStorage.setItem('frontLanguage', this.front.language);
      localStorage.setItem('backLanguage', this.back.language);
      this.$store.commit('addNewWords', words);
      this.front.items = '';
      this.back.items = '';
    },
    async fetchData() {
      try {
        this.loading = true;
        const response = await this.$http.get('languages');
        if (!response.body) return;
        Object.assign(this.languages, response.body);
      } finally {
        this.loading = false;
      }
    },
    applyFrontSuggestion(data) {
      this.applySuggestion('front', data);
    },
    applyBackSuggestion(data) {
      this.applySuggestion('back', data);
    },
    applySuggestion(side, { word, suggestion }) {
      const section = side === 'front' ? this.front : this.back;
      section.items = section.items.split('\n').map((item) => {
        if (item !== word) return item;
        return item.replace(suggestion.word, suggestion.suggestion);
      }).join('\n');
    },
  },
  components: {
    Spellcheck,
  },
};
</script>
<style scoped>
  #pastedImage {
    max-width: 100%
  }
</style>
