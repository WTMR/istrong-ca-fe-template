<template>
  <div class="app">
    <!--transitionName指定路由跳转的动画效果名称，具体看vue的transition文档-->
    <transition :name="transitionName_MPage" @after-enter="onAfterEnter" appear>
      <div key="singlePage" class="transition-slide-appPage" v-show="!isModulePage">
        <!--页面是否缓存通过meta的keepAlive属性控制-->
        <transition :name="transitionName" @after-enter="onAfterEnter" appear>
          <keep-alive>
            <router-view v-if="$route.meta.keepAlive && !isModulePage" class="transition-slide-appPage" />
          </keep-alive>
        </transition>
        <transition :name="transitionName" @after-enter="onAfterEnter" appear>
          <router-view v-if="!$route.meta.keepAlive && !isModulePage" class="transition-slide-appPage" />
        </transition>
      </div>
    </transition>
    <transition :name="transitionName_MPage" @after-enter="onAfterEnter" appear>
      <div key="modulePage" class="transition-slide-appPage" v-show="!!isModulePage">
        <!--头部模块菜单tab，类似uc浏览器中的频道-->
        <keep-alive v-if="isModulePage">
          <yd-scrollnav class="moduleTab" :callback="onChooseModule" :index="currentModuleIndex" v-bind="scrollnavOpts">
            <yd-scrollnav-panel :label="moduleItem.label" v-for="(moduleItem,index) in modules" :key="index">
            </yd-scrollnav-panel>
          </yd-scrollnav>
        </keep-alive>
        <!-- <transition :name="transitionName" @after-enter="onAfterEnter" appear> -->
        <div class="modulePage">
          <!--页面是否缓存通过meta的keepAlive属性控制-->
          <keep-alive>
            <router-view v-if="$route.meta.keepAlive && isModulePage" />
          </keep-alive>
          <router-view v-if="!$route.meta.keepAlive && isModulePage" />
        </div>
        <!-- </transition> -->
      </div>
    </transition>
  </div>
</template>

<script>
import 'vue-ydui/dist/ydui.base.css'; //因为整体框架使用了ydui的scrollnav
import { ScrollNav, ScrollNavPanel } from 'vue-ydui/dist/lib.px/scrollnav';
import { findIndex, cloneDeep } from 'lodash';
import mixinInterface from './libs/appInterface';

export default {
  name: 'app',
  mixins: [mixinInterface],
  components: {
    'yd-scrollnav': ScrollNav,
    'yd-scrollnav-panel': ScrollNavPanel
  },
  data() {
    return {
      transitionName_MPage: '',
      transitionName: ''
    };
  },
  watch: {
    $route(to, from) {
      let isInitializeRouter = this._isInitializeRouter;
      delete this._isInitializeRouter;
      //regin tab模块中记录当前加载的路由，这里是由于tab切换时候要记录当前tab中加载的子路由，下次点击时加载这个子路由
      let { moduleName } = to.meta || {};
      if (moduleName && moduleName !== '') {
        let index = findIndex(this.modules, module => {
          return module.name === moduleName;
        });
        if (index !== -1) {
          this.currentModuleIndex = index;
          this.modules[index].route = to;
        }
      }
      //endregin

      let { moduleName: fModuleName } = from.meta || {};
      let isModulePage_To = moduleName && moduleName !== '';
      let isModulePage_From = fModuleName && fModuleName !== '';
      if (isModulePage_To === isModulePage_From) {
        //两个都是相同的模块页或者非模块页
        this.transitionName_MPage = '';
        this.transitionName = 'left';
      } else {
        this.transitionName_MPage = 'left';
        this.transitionName = '';
      }

      let toPath = to.path;
      let fromPath = from.path;
      if (
        isInitializeRouter ||
        to.path === '/login' ||
        (toPath === fromPath && to.name === from.name)
      ) {
        this.transitionName = '';
        this.transitionName_MPage = '';
      }
    }
  },
  created() {
    this._isInitializeRouter = true;
  },
  methods: {
    /**@augments 需要实现的路由信息获取并注册功能 */
    async generateRoutes() {
      //下面代码是动态路由注册的代码
      const pages = this.$store.getters['config/app']('pages');
      //返回路由配置
      return pages;
    }
  }
};
</script>

{{#if_eq uiLibrary 'vux'}}
<style lang="less">
@import '~vux/src/styles/reset.less';
</style>
{{/if_eq}}
<style scoped>
#app > div {
  width: 100%;
  height: 100%;
}
.modulePage {
  position: relative;
  top: 45px;
}

.transition-slide-appPage {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
  position: absolute;
  width: 100%;
  height: 100%;
}

.left-enter,
.right-leave-active {
  -webkit-transform: translate3d(-100%, 0, 0);
  transform: translate3d(-100%, 0, 0);
}
.left-leave-active,
.right-enter {
  -webkit-transform: translate3d(100%, 0, 0);
  transform: translate3d(100%, 0, 0);
}
</style>
<style >
.moduleTab .yd-scrollnav-tab-item > li.yd-scrollnav-current > i {
  display: none;
}
</style>

