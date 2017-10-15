import Vue from 'vue';
import Router from 'vue-router';
import Word from '@/components/Word';
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
      component: Word,
    },
  ],
});
