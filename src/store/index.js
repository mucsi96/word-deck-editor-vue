/* eslint-disable no-param-reassign */
import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    deck: [],
  },
  getters: {
    deck(state) {
      return state.deck;
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
  },
  plugins: [createPersistedState()],
});

export default store;
