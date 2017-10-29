/* eslint-disable no-param-reassign */
import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    deck: [],
  },
  mutations: {
    addNewWords(state, words) {
      state.deck = state.deck.concat(words);
    },
    updateWord(state, { word, prop, value }) {
      const wordToUpdate = state.deck.find(w => w.front === word);
      wordToUpdate[prop] = value;
    },
  },
  plugins: [createPersistedState()],
});

export default store;
