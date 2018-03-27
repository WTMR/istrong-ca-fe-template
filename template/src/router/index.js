import Vue from 'vue';
import Router from 'vue-router';
//路由鉴权
import routeAuthentication from './authentication'

Vue.use(Router)

const router = new Router({
});

export {
  routeAuthentication
}
export default router;