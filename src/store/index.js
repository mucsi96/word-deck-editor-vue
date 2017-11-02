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
  },
  mutations: {
    addNewWords(state, words) {
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
          !preload
          && !word.pronunciations
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
          commit('updateMeta', response.body || {});
        }
      } catch (err) {
        if (preload) {
          commit('updateWord', { word: word.front, prop: 'preloading', value: 'failed' });
        } else {
          commit('updateMeta', {});
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
