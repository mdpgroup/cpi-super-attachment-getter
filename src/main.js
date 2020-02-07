import Vue from 'vue'
import App from './App.vue'
import SuiVue from 'semantic-ui-vue';
import 'semantic-ui-css/semantic.min.css';
import './assets/css/style.css'
import Data from './data/Data'
import router from './router/router'
import IntegrationContents from './data/IntegrationContents'
import MessageProcessingLog from './data/MessageProcessingLog'

global.storage = new Data()
global.data = new IntegrationContents()
global.message = new MessageProcessingLog()

Vue.config.productionTip = false
Vue.use(SuiVue);
new Vue({
  render: h => h(App),
  router
}).$mount('#app')
