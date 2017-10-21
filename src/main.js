// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import VueResource from 'vue-resource';
import localforage from 'localforage';
import App from './App';
import router from './router';
import store from './store';

localforage.config({
  name: 'word-deck-editor',
});

Vue.config.productionTip = false;
Vue.use(VueResource);
Vue.http.options.root = '/api';
Vue.http.interceptors.push((request, next) => {
  if (request.method.toLowerCase() === 'get') {
    localforage.getItem(request.url).then((cachedValue) => {
      if (!cachedValue) {
        next((response) => {
          if (response && response.status === 200) {
            localforage.setItem(request.url, response.body);
          }
        });
      }
      next(request.respondWith(cachedValue, {
        status: 200,
      }));
    }).catch(err => console.log(err.stack));
  }
});


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  store,
  components: { App },
});
