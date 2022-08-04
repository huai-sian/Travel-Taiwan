<template>
  <div class="home">
    <div class="banner shadow">
      <h1 class="banner-text">
        <span v-text="slogan[0]"></span><br />
        <span v-text="slogan[1]"></span>
      </h1>
    </div>
    <h2 class="title">熱門景點</h2>
    <div class="hot">
      <router-link 
        v-for="(item, idx) in ranCities"
        :key="item[0]"
        :to="`/`"
        class="hot-city"
      >
        <img :alt="item[0]" class="hot-city-img" :src="getImgUrl(idx + 1)">
        <div class="hot-city-content">
          <span v-text="item[1].name"></span>
        </div>
      </router-link>
    </div>
    <h2 class="title">打卡美食</h2>
    <Recommend recMode="Restaurant" amount="3" />
    <h2 class="title">住宿推薦</h2>
    <Recommend recMode="Hotel" amount="4" />
    <h2 class="title">觀光活動</h2>
    <Recommend recMode="Activity" amount="4" />
  </div>
</template>

<script>
// @ is an alias to /src
import { onMounted, ref } from 'vue'
import { dataFilter } from '../composables/modules.js'
import { sloganLib, cityLib } from '../composables/data.js'
import Recommend from '../components/Recommend.vue'

export default {
  name: 'Home',
  components: {
    Recommend
  },
  setup() {
    const slogan = ref([])
    const ranCities = ref([])
    const getImgUrl = (n) => require("../assets/images/city_"+ n +".jpg")
    onMounted(() => {
      document.title = 'Traveler'
      console.log(sloganLib)
      dataFilter(sloganLib, 1).then((res) => {
        slogan.value = res[0];
        console.log(slogan.value)
      })
      dataFilter(Object.entries(cityLib), 7).then((res) => {
        ranCities.value = res
      })
    })
    
    return { slogan, ranCities, getImgUrl }
  }
}
</script>

<style lang="scss" scoped>
  .home {
    padding: 2rem;
  }
  .banner {
    position: relative;
    width: 100%;
    height: 300px;
    border-radius: 1rem;
    overflow: hidden;
    background: url(../assets/images/banner_Home.png) no-repeat bottom right / contain ;
    @media screen and (max-width: 1024px) {
      height: 180px;
    }
    &-text {
      position: absolute;
      top: 60%;
      left: 1em;
      font-size: 4rem;
      transform: translateY(-50%);
      font-weight: 700;
      letter-spacing: 2px;
      @media screen and (max-width: 1024px) {
        font-size: 1.2rem;
      }
    }
  }
  .hot {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    flex-wrap: wrap;
    height: 300px;
    overflow: hidden;
    @media screen and (max-width: 767px) {
      height: auto;
      flex-direction: row;
    }
    &-city {
      width: calc(20% - .6rem);
      height: calc(50% - .6rem);
      overflow: hidden;
      border-radius: .5rem;
      margin: .3rem;
      position: relative;
      cursor: pointer;
      @media screen and (max-width: 767px) {
        width: calc(50% - .6rem);
        height: 150px;
      }
      &:hover {
        .hot-city-content {
          background-color: #00000066;
        }
        .hot-city-img {
          transform: scale(1.2);
        }
      }
      &:nth-child(3n + 1) {
        height: 100%;
        @media screen and (max-width: 767px) {
          width: 100%;
          height: 130px;
        }
      }
      &-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center left;
        transition: all .4s;
      }
      &-content {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: white;
        background-color: #00000019;
        width: 100%;
        height: 100%;
        transition: all .4s;
        font-weight: 600;
        font-size: 1.6rem;
      }
    }
  }
</style>
