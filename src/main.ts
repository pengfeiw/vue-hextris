// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import Vuex from 'vuex'
import Game from './engine/game';

Vue.use(Vuex);
Vue.use(ElementUI);

export const store = new Vuex.Store({
    state: {
        game: new Game()
    },
    mutations: {
        restart(state) {
            state.game.updateScoreToLocalstorage();
            const outerLen = state.game.outerSideL;
            state.game = new Game();
            state.game.outerSideL = outerLen;
            state.game.start();
        }
    },
    getters: {
        status: (state) => {
            return state.game.status;
        }
    }
});

Vue.config.productionTip = false

new Vue({
    render: h => h(App),
    store
}).$mount('#app')
