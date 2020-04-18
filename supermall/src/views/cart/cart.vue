<template>
  <div class="cart">
    <nav-bar class="nav-bar">
      <div slot="center">购物车({{cartCount}})</div>
    </nav-bar>
  <cart-list/>
  <cart-bottom-bar/>
  </div>
  </template>

  <script>
  import NavBar from "../../components/common/navbar/NavBar";

  import CartBottomBar from "./childComps/CartBottomBar";
  import CartList from "./childComps/CartList";

  import {mapGetters} from 'vuex'

  export default {
    name: "cart",
    components:{
      NavBar,
      CartList,
      CartBottomBar,
    },
    computed: {
      ...mapGetters([
        'cartCount'
      ])
    }
  }
</script>

<style scoped>
  .nav-bar {
    background: var(--color-tint);
    color: #fff;
  }
</style>
