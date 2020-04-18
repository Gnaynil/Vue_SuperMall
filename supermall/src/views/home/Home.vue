<template>
  <div id="home">
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
    <TabControl
      :titles="['流行','新款','精选']"
      @tabClick="tabClick"
      ref="tabControl1"
      @click.native="backClick1"
      class="tab-control"
      v-show="isTabFixed"
      >
    </TabControl>
    <Scroll class="content"
            ref="scroll"
            :probe-type="3"
            @scroll="contentScroll"
            :pull-up-load="pullUpLoad"
            @pullingUp="loadMore">
      <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"></home-swiper>
      <home-recommend-view :recommends="recommends"/>
      <FeatureView/>
      <TabControl
        :titles="['流行','新款','精选']"
        @tabClick="tabClick"
        ref="tabControl2"
      >
      </TabControl>
      <goods-list :goods="showGoods"></goods-list>
  </Scroll>
  <BackTop @click.native="backClick" v-show="isShowBackTop"></BackTop>
  </div>

</template>

<script>
  import HomeSwiper from "./childComps/HomeSwiper";
  import HomeRecommendView from "./childComps/HomeRecommendView";
  import FeatureView from "./childComps/FeatureView";



  import NavBar from "../../components/common/navbar/NavBar";
  import TabControl from "../../components/content/tabControl/TabControl";
  import GoodsList from "../../components/content/goods/GoodsList";
  import Scroll from "../../components/common/scroll/Scroll";
  import BackTop from "../../components/content/backTop/BackTop";


  import {
    getHomeMultidata,
    getHomeGoods,
  } from "../../network/home";
  import {debounce} from "../../common/utils";
  import { itemListenerMixin } from "../../common/mixin";

  export default {
    name: "Home",
    components:{
      HomeSwiper,
      HomeRecommendView,
      FeatureView,
      NavBar,
      TabControl,
      GoodsList,
      Scroll,
      BackTop,

    },
    mixins: [itemListenerMixin],
    data(){
      return{
        banners:[],
        recommends:[],
        goods:{
          'pop':{page:0,list:[]},
          'new':{page:0,list:[]},
          'sell':{page:0,list:[]},
        },
        currentType:'pop',
        pullUpLoad:true,
        isShowBackTop:false,
        taboffsetTop:0,
        isTabFixed:false,
        saveY: 0,
      }
    },
    activated() {
      this.$refs.scroll.refresh();
      this.$refs.scroll.scrollTo(0, this.saveY, 0);

    },
    deactivated() {
      // 保存Y值
      this.saveY = this.$refs.scroll.scroll.y;
      // 取消全局监听
      this.$bus.$off("itemImageLoad", this.itemImageListener);
    },
    computed:{
      showGoods(){
        return this.goods[this.currentType].list
      }
    },
    created() {
      // 1.请求多个数据
      this.getHomeMultidata()

      //2.请求商品数据
      this.getHomeGoods('pop')
      this.getHomeGoods('new')
      this.getHomeGoods('sell')


    },
    mounted() {
      //1.监听图片加载完成
      //防抖函数 debounce
      // const refresh = debounce(this.$refs.scroll.refresh,200)
      //
      // this.$bus.$on('itemImageLoad',() => {
      //   refresh()
      // })


    },
    methods:{
      /**
       *  事件监听方法
       */
      tabClick(index){
        // switch(index) {
        //   case 0:
        //     this.currentType = 'pop'
        //     break
        //   case 1:
        //     this.currentType = 'new'
        //     break
        //   case 2:
        //     this.currentType = 'sell'
        //     break
        // }
        this.currentType=Object.keys(this.goods)[index]
        this.$refs.tabControl1.currentIndex = index;
        this.$refs.tabControl2.currentIndex = index;
      },
      backClick(){
        this.$refs.scroll.scroll.scrollTo(0,0)
      },
      backClick1(){
        this.$refs.scroll.scroll.scrollTo(0,-this.taboffsetTop+40)
      },
      contentScroll(position){
        // console.log(position);
        // 1.判断BackTop是否显示
        this.isShowBackTop = -position.y>1000
        // 2.觉得tabControl是否吸顶(position:fixed)
        this.isTabFixed = (-position.y) > this.taboffsetTop

      },
      loadMore(){
        this.getHomeGoods(this.currentType)
      },
      //2.获取tabControl的offsetTop
      swiperImageLoad(){
        this.taboffsetTop=this.$refs.tabControl2.$el.offsetTop
      },

      /**
       *  网络请求相关方法
       */
      getHomeMultidata(){
        getHomeMultidata().then(res=>{
          this.banners=res.data.banner.list;
          this.recommends=res.data.recommend.list;
        })
      },
      getHomeGoods(type){
        const page =this.goods[type].page + 1
        getHomeGoods(type,page).then(res=>{
          this.goods[type].list.push(...res.data.list)
          this.goods[type].page += 1

          //完成上拉加载更多
          this.$refs.scroll.finishPullUp()
        })
      }
    }
  }
</script>

<style scoped>
  #home{
    /*padding-top: 44px;*/
    height: 100vh;
  }
.home-nav{
  background-color: var(--color-tint);
  color: #fff;
  /*在浏览器原生滚动时,为了让导航栏不跟随滚动*/
  /*position: fixed;*/
  /*left: 0;*/
  /*right: 0;*/
  /*top: 0;*/
  /*z-index: 9;*/
}
  /*.content{*/

  /*  overflow: hidden;*/
  /*  z-index: 9;*/
  /*  position: absolute;*/
  /*  top: 44px;*/
  /*  bottom: 49px;*/
  /*  left: 0;*/
  /*  right: 0;*/
  /*}*/
  .tab-control{
    position: relative;
    z-index: 9;
  }
  .content{
    height: calc(100% - 93px);
    overflow: hidden;
    /*margin-top: 44px;*/
  }
</style>
