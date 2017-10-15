/* eslint-disable no-param-reassign */
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    deck: [
      { front: 'Apfel', back: 'alma' },
      { front: 'Auf Wiedersehen', back: 'viszontlátásra' },
    ],
  },
  mutations: {
    addNewWords(state, words) {
      state.deck = state.deck.concat(words);
    },
  },
});

export default store;
