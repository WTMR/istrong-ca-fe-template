/**
 * 异步组件或异步页面的注册store
 */
export default {
  namespaced: true,
  state: {
    // 异步组件库
    asyncComponents: {
      'vue-iframe': () => import('@strongsoft/ca-card-v-iframe'),
      'login': () => import('@/pages/Login')
    }
  }
}
