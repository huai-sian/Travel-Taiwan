<template>
  <div class="search">
    <div class="banner shadow">
      <img class="banner-img" alt="Travel Guide" :src="getUrl()">
      <h1 class="banner-text" v-text="getTitle()">
      </h1>
    </div>
    <div class="mode">
      <router-link 
        :class="['mode-btn', { active: mode === 'ScenicSpot' }]"
        :to="getLink('ScenicSpot')"
        replace
      >景點</router-link>
      <router-link 
        :class="['mode-btn', { active: mode === 'Restaurant' }]"
        :to="getLink('Restaurant')"
        replace
      >餐飲</router-link>
      <router-link
        :class="['mode-btn', { active: mode === 'Hotel' }]"
        :to="getLink('Hotel')"
        replace
      >旅宿</router-link>
      <router-link
        :class="['mode-btn', { active: mode === 'Activity' }]"
        :to="getLink('Activity')"
        replace
      >活動</router-link>
    </div>
    <div :class="`card-${mode}`">
      <router-link class="card"
        v-for="item in result"
        :key="item[`${mode}ID`]"
        :to="`/detail/${item[mode + 'ID']}`">
        <div class="card-box">
          <img
            :src="item.Picture.PictureUrl1"
            :alt="item.Picture.PictureDescription1"
            class="card-img">
        </div>
        <div class="card-content">
          <h2 class="card-title" v-text="item[mode + 'Name']"></h2>
            <p class="card-text" v-if="item.Date">
              <i class="fas fa-calendar"></i>
              <span v-text="' ' + item.Date"></span>
            </p>
            <p class="card-text" v-if="!item.Date && item.StartTime">
              <i class="fas fa-calendar"></i>
              <span v-text="' ' + item.StartTime + ' ~ '"></span>
              <span v-text="item.EndTime"></span>
            </p>
            <p class="card-text" v-if="item.OpenTime">
              <i class="fas fa-clock"></i>
              <span v-text="' ' + item.OpenTime.split('；')[0]"></span>
            </p>
            <p class="card-text" v-if="item.TicketInfo">
              <i class="far fa-ticket"></i>
              <span v-text="' ' + item.TicketInfo"></span>
            </p>
            <p class="card-text" v-if="item.Address">
              <i class="fas fa-location-arrow"></i>
              <span v-if="item.Location" v-text="' ' + item.location"></span>
              <span v-text="' ' + item.Address"></span>
            </p>
            <p class="card-text" v-if="item.Class || item.Class1 || item.Class2 || item.Class3">
              <i class="fas fa-tag"></i>
              <span
                class="card-tag bdrs-sm"
                v-text="item.Class"
                v-if="item.Class"
              ></span>
              <span
                class="card-tag bdrs-sm"
                v-text="item.Class1"
                v-if="item.Class1"
              ></span>
              <span
                class="card-tag bdrs-sm"
                v-text="item.Class2"
                v-if="item.Class2"
              ></span>
              <span
                class="card-tag bdrs-sm"
                v-text="item.Class3"
                v-if="item.Class3"
              ></span>
            </p>
          </div>
      </router-link>
    </div>
    <button
      :class="['loadBtn', { hide: loadBtn}]"
      @click="loadData">
      載入更多
    </button>
  </div>
</template>

<script>
// @ is an alias to /src
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { dataFilter, getData, handleTime, getNearInfo } from '../composables/modules.js'
import { sloganLib, cityLib, modeLib } from '../composables/data.js'
import Recommend from '../components/Recommend.vue'

export default {
  name: 'Search',
  props: {
    mode: String,
    setMode: Function,
  },
  components: {
  },
  setup(props) {
    const route = useRoute();
    const router = useRouter();
    const result = ref([]);
    const loadBtn = ref(true);
    const params = route.params;
    let pageIdx = 1;
    console.log(params.value);
    //const mode = params.mode;
    const city = params.city;
    const keyword = params.keyword;
    const verify = () => {
      if(Object.keys(modeLib).indexOf(params.mode) < 0) {
        return true
      }
      if(city && !cityLib[city]) {
        return true
      }
      return false;
    }
    
    const loadData = () => {
      if(verify()) {
        router.push({ name: 'Home'});
      }
      loadBtn.value = true;
      props.setMode(params.mode);
      const load = params.city
        ? getData(params.mode, city, pageIdx, keyword)
        : getNearInfo(params.mode, params.lat, params.lon, pageIdx)
      load
        .then((res) => {
          if(res.length === 0) {
            throw new Error();
          }
          if(res.length === 6) {
            loadBtn.value = false;
          }
          return handleTime(res);
        })
        .then((data) => {
          result.value.push(...data);
          pageIdx += 1;
          console.log(result.value);
        }).catch((err) => console.log(err));
      
    }
    const getTitle = () => {
      if(keyword) {
        return keyword.split(',').join();
      } else if(city) {
        return city.replace(/[A-Z]/g, " $&");
      } else {
        return params.mode;
      }

    }
    const getUrl = () => require(`../assets/images/banner_${params.mode}.png`);
    onMounted(() => loadData());
    const getLink = (mode) => {
      return city? `/${mode}/${city}/${keyword || ''}`
      : `/${mode}/${params.lat}/${params.lon}`
    }
    return { result, getUrl, getTitle, loadBtn, loadData, getLink }
  }
}
</script>

<style lang="scss" scoped>
  .search {
    padding: 2rem;
  }
  .banner {
    position: relative;
    width: 100%;
    height: 300px;
    border-radius: 1rem;
    overflow: hidden;
    background: url(../assets/images/banner_Home.png) no-repeat bottom right / contain ;
    &-img {
      width: 100%;
      height: 100%;
      object-position: center left;
      object-fit: cover;
    }
    &-text {
      position: absolute;
      top: 70%;
      left: 1em;
      font-size: 4rem;
      transform: translateY(-50%);
      font-weight: bold;
      letter-spacing: 2px;
      color: white;
      text-shadow: 0 0 1rem #00000099;
    }
  }
  .mode {
    margin: 1.5rem 0;
    &-btn {
      display: inline-block;
      margin: 0 .5rem;
      padding: 0.3rem 0.8rem;
      color: #ff9999;
      border: 1px solid #ff9999;
      text-decoration: none;
      cursor: pointer;
      border-radius: 0.5rem;
      overflow: hidden;
      &.active {
        color: white;
        background-color: #ff9999;
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
    &-city {
      width: calc(20% - .6rem);
      height: calc(50% - .6rem);
      overflow: hidden;
      border-radius: .5rem;
      margin: .3rem;
      position: relative;
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
  .loadBtn {
  display: block;
  margin: 0 auto;
  padding: 0.5rem 4rem;
  color: #ff9999;
  border: none;
  outline: none;
  transition: color 0.5s, background-color 0.5s;
  cursor: pointer;
  border-radius: 0.5rem;
  overflow: hidden;
  font-size: 1.3rem;
  font-weight: bold;
  &.hide {
    opacity: 0;
  }
  &:hover {
    color: white;
    background-color: #ff9999;
  }
}
</style>
