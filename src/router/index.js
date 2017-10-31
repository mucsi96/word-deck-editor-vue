import Vue from 'vue';
import Router from 'vue-router';
import DeckAndWord from '@/components/DeckAndWord';
import NewWordsForm from '@/components/NewWordsForm';

Vue.use(Router);

export default new Router({
  mode: 'history',
  linkActiveClass: 'active',
  routes: [
    {
      path: '/add-new-words',
      component: NewWordsForm,
    },
    {
      name: 'word',
      path: '/word/:id',
      component: DeckAndWord,
    },
    {
      path: '/',
      component: DeckAndWord,
    },
  ],
});
