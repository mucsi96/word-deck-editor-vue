/* eslint-disable no-param-reassign */
import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    deck: [],
    meta: {},
  },
  getters: {
    deck(state) {
      return state.deck;
    },
    meta(state) {
      return state.meta;
    },
    wordToPreload(state) {
      return state.deck.find(word => !word.preloading);
    },
  },
  mutations: {
    addNewWords(state, words) {
      words.forEach((newWord) => {
        if (state.deck.find(word => word.front === newWord.front)) {
          throw new Error(`Word ${newWord.front} already added!`);
        }
      });
      state.deck = state.deck.concat(words);
    },
    updateWord(state, { word, prop, value }) {
      const index = state.deck.findIndex(w => w.front === word);
      const w = state.deck[index];
      Vue.set(w, prop, value);
      Vue.set(state.deck, index, w);
    },
    updateMeta(state, meta) {
      state.meta = meta;
    },
    erase(state) {
      state.deck = [];
    },
  },
  actions: {
    async fetchWord({ commit }, { word, preload }) {
      const wordToFetch = word.frontLanguage === 'de' ? word.front.replace(/^(da |der |die |das )/, '') : word.front;
      if (preload) {
        commit('updateWord', { word: word.front, prop: 'preloading', value: 'pending' });
      } else {
        commit('updateMeta', {});
      }
      const url = [
        'meta',
        encodeURIComponent(word.frontLanguage),
        encodeURIComponent(wordToFetch.toLowerCase()),
      ].join('/');
      try {
        const response = await Vue.http.get(url);
        if (
          !word.pronunciations
          && response.body.pronunciations
          && response.body.pronunciations.length
        ) {
          commit('updateWord', {
            word: word.front,
            prop: 'pronunciation',
            value: response.body.pronunciations[0].sound,
          });
        }
        if (preload) {
          commit('updateWord', { word: word.front, prop: 'preloading', value: 'done' });
        } else {
          commit('updateMeta', response.body || null);
        }
      } catch (err) {
        if (preload) {
          commit('updateWord', { word: word.front, prop: 'preloading', value: 'failed' });
        } else {
          commit('updateMeta', null);
        }
      }
    },
    async upload({ state }, { provider, ...providerProps }) {
      await Vue.http.post('upload', { provider, deck: state.deck, ...providerProps });
    },
  },
  plugins: [createPersistedState()],
});

export default store;
