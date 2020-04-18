import Vue from "vue";
import Vuex from "vuex";

import mutations from "./mutations";
import getters from "./getters";
import actions from './actions'

//安装插件
Vue.use(Vuex)

const state={
  cartList:[]
}


// 2.创建Store对象
const store = new Vuex.Store({
  state,
  mutations,
  actions,
  getters
})

//3.挂载在Vue实例上
export default store
