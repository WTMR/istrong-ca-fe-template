// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
var Promise = require('es6-promise').Promise;
window.Promise = Promise;//这里是为了兼容安卓4.4以下的promise问题。

import './styles/app.css';

import Vue from 'vue'
import App from './App'
import router, { routeAuthentication } from '@/router'//注册路由配置
import store from '@/store' //全局状态管理器
import api from 'istrong-common-model';

//region 使用 fastclick 解决移动端 300ms 点击延迟
import FastClick from 'fastclick';
FastClick.attach(document.body);
//endregion 使用 fastclick 解决移动端 300ms 点击延迟

Vue.use(api, {
  apiConfig: {
    api: './config/api.json',
    commonModel: './config/interface_common_model.json'
  }
});

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App },
  beforeCreate() {
    this.$api.get({ url: './config/app.json', cache: true }).then(config => {
      this.$store.commit('config/pushAppConfig', config || {});//配置信息初始化到config中
      routeAuthentication(this);
    });
  },
  methods: {
    identityCheck() {
      return new Promise((resolve, reject) => {
        this.$store.commit('global/setUserInfo', { username: '158590******' });
        resolve()
      });
    }
  }
})