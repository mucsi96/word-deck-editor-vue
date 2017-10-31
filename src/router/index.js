import Vue from 'vue';
import Router from 'vue-router';
import DeckAndWord from '@/components/DeckAndWord';
import NewWordsForm from '@/components/NewWordsForm';
import UploadForm from '@/components/UploadForm';

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
      path: '/upload',
      component: UploadForm,
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
