// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'regenerator-runtime/runtime';
import Vue from 'vue';
import VueResource from 'vue-resource';
import AsyncComputed from 'vue-async-computed';
import App from './App';
import router from './router';
import store from './store';

Vue.config.productionTip = false;
Vue.use(VueResource);
Vue.use(AsyncComputed);
Vue.http.options.root = '/api';

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  store,
  components: { App },
});
