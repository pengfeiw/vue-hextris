// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import Vuex from 'vuex'
import {GameStatus} from './engine/status';

Vue.use(Vuex);
Vue.use(ElementUI);

const store = new Vuex.Store({
    state: {
        status: GameStatus.UNSTART
    },
    mutations: {
        switchStatus(state, status) {
            state.status = status;
        }
    }
});


Vue.config.productionTip = false

new Vue({
    render: h => h(App),
    store
}).$mount('#app')
