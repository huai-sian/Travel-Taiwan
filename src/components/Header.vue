<template>
  <div class="header">
    <div class="header-main d-flex align-items-center justify-content-between">
      <router-link to="/" class="header-logo"></router-link>
      <button class="header-btn" @click.prevent="closeHeader">
        <i class="fas fa-chevron-left"></i>
      </button>
    </div>
    <div class="header-select d-flex" @click.prevent="openCity = !openCity">
      <span class="select-input" v-text="`${cityName(city)}｜${searchMode}`"></span>
      <button class="select-btn">
        <i class="fas fa-chevron-circle-down"></i>
      </button>
    </div>
    <div :class="['dropdown', { show: openCity }]">
      <h3 class="dropdown-title">選擇區域</h3>
      <span :class="['dropdown-item', { active: city === 'Taiwan'}]" style="width: 15%;" @click="setCity('Taiwan')">臺灣</span>
      <div class="tabs">
        <input type="radio" id="tabs1" class="tabs-radio" name="tabs" checked />
        <input type="radio" id="tabs2" class="tabs-radio" name="tabs" />
        <input type="radio" id="tabs3" class="tabs-radio" name="tabs" />
        <input type="radio" id="tabs4" class="tabs-radio" name="tabs" />
        <ul class="tabs-cnt">
          <li class="tabs-cnt-item d-flex justify-content-around">
            <span 
              v-for="item in cityFilter('North')"
              :key="item"
              v-text="cityName(item)"
              :class="['dropdown-item', {active: city === item}]"
              @click="setCity(item)"></span>
          </li>
          <li class="tabs-cnt-item d-flex justify-content-around">
            <span 
              v-for="item in cityFilter('Central')"
              :key="item"
              v-text="cityName(item)"
              class="dropdown-item"
              :class="['dropdown-item', {active: city === item}]"
              @click="setCity(item)"></span>
          </li>
          <li class="tabs-cnt-item d-flex justify-content-around">
            <span 
              v-for="item in cityFilter('South')"
              :key="item"
              v-text="cityName(item)"
              class="dropdown-item"
              :class="['dropdown-item', {active: city === item}]"
              @click="setCity(item)"></span>
          </li>
          <li class="tabs-cnt-item d-flex justify-content-around">
            <span 
              v-for="item in cityFilter('East')"
              :key="item"
              v-text="cityName(item)"
              class="dropdown-item"
              :class="['dropdown-item', {active: city === item}]"
              @click="setCity(item)"></span>
          </li>
          <li class="tabs-cnt-item d-flex justify-content-around">
            <span 
              v-for="item in cityFilter('Outer')"
              :key="item"
              v-text="cityName(item)"
              class="dropdown-item"
              :class="['dropdown-item', {active: city === item}]"
              @click="setCity(item)"></span>
          </li>
        </ul>
        <div class="tabs-ctl d-flex justify-content-around">
          <label for="tabs1" class="tabs-ctl-item">北部</label>
          <label for="tabs2" class="tabs-ctl-item">中部</label>
          <label for="tabs3" class="tabs-ctl-item">南部</label>
          <label for="tabs4" class="tabs-ctl-item">東部&離島</label>
        </div>
      </div>
      <hr class="dropdown-hr" />
      <h3 class="dropdown-title">選擇類型</h3>
      <div class="dropdown-mode d-flex justify-content-around align-items-center" style="flex-wrap: wrap;">
        <span
          :class="['dropdown-item', { active: mode === 'ScenicSpot'}]"
          @click.prevent="mode = 'ScenicSpot'"
        >景點</span>
        <span
          :class="['dropdown-item', { active: mode === 'Restaurant'}]"
          @click.prevent="mode = 'Restaurant'"
        >餐飲</span>
        <span
          :class="['dropdown-item', { active: mode === 'Hotel'}]"
          @click.prevent="mode = 'Hotel'"
        >旅宿</span>
        <span
          :class="['dropdown-item', { active: mode === 'Activity'}]"
          @click.prevent="mode = 'Activity'"
        >活動</span>
      </div>
      <button class="dropdown-btn fz-sm bdrs-sm" @click="openCity = !openCity">
        OK!
      </button>
    </div>
    <div class="textbox d-flex">
      <input type="text" v-model="keyword" placeholder="多筆資料用空格格開(選填)" @keypress.enter="goSearch()" class="textbox-input">
      <button @click="goSearch()" class="textbox-btn">
        <i class="fas fa-search"></i>
        </button>
    </div>
    <button class="searchBtn" @click.prevent="goSearch()">
      <i class="fas fa-search"></i>
      開始搜尋
      </button>
    <h3 class="title">精選主題</h3>
    <div class="theme d-flex justify-content-around align-items-center">
      <div
        class="theme-item bdrs-sm"
        @click="goSearch('ScenicSpot', '觀光,遊憩')"
      >
        <img
          src="../assets/images/theme_1.png"
          alt="觀光遊憩"
          class="theme-img"
        />
        <h4 class="theme-text df-center fz-sm">觀光遊憩</h4>
      </div>
      <div
        class="theme-item bdrs-sm"
        @click="goSearch('ScenicSpot', '自然,風景')"
      >
        <img
          src="../assets/images/theme_2.png"
          alt="自然風景"
          class="theme-img"
        />
        <h4 class="theme-text df-center fz-sm">自然風景</h4>
      </div>
      <div
        class="theme-item bdrs-sm"
        @click="goSearch('ScenicSpot', '地方,特產')"
      >
        <img
          src="../assets/images/theme_3.png"
          alt="地方特產"
          class="theme-img"
        />
        <h4 class="theme-text df-center fz-sm">地方特產</h4>
      </div>
      <div
        class="theme-item bdrs-sm"
        @click="goSearch('ScenicSpot', '異國,料理')"
      >
        <img
          src="../assets/images/theme_4.png"
          alt="異國料理"
          class="theme-img"
        />
        <h4 class="theme-text df-center fz-sm">異國料理</h4>
      </div>
      <div
        class="theme-item bdrs-sm"
        @click="goSearch('ScenicSpot', '度假,民宿')"
      >
        <img
          src="../assets/images/theme_5.png"
          alt="度假民宿"
          class="theme-img"
        />
        <h4 class="theme-text df-center fz-sm">度假民宿</h4>
      </div>
      <div
        class="theme-item bdrs-sm"
        @click="goSearch('ScenicSpot', '國際,旅館')"
      >
        <img
          src="../assets/images/theme_6.png"
          alt="國際旅館"
          class="theme-img"
        />
        <h4 class="theme-text df-center fz-sm">國際旅館</h4>
      </div>
      <div
        class="theme-item bdrs-sm"
        @click="goSearch('ScenicSpot', '節慶,活動')"
      >
        <img
          src="../assets/images/theme_7.png"
          alt="節慶活動"
          class="theme-img"
        />
        <h4 class="theme-text df-center fz-sm">節慶活動</h4>
      </div>
      <div
        class="theme-item bdrs-sm"
        @click="goSearch('ScenicSpot', '藝文,體驗')"
      >
        <img
          src="../assets/images/theme_8.png"
          alt="藝文體驗"
          class="theme-img"
        />
        <h4 class="theme-text df-center fz-sm">藝文體驗</h4>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref } from "vue"
import { cityLib, modeLib } from '../composables/data.js'
import { useRoute, useRouter } from 'vue-router'

export default {
  name: 'Header',
  props: {
    closeHeader: Function,
  },
  setup() {
    const mode = ref("ScenicSpot");
    const openCity = ref(false);
    const city = ref("Taiwan");
    const keyword = ref("");
    const router = useRouter();
    const setCity = (c) => { city.value = c };
    const searchMode = computed(() => {
      return modeLib[mode.value]
    })
    const cityFilter = (region) => {
      return Object.keys(cityLib).filter(item => cityLib[item].region === region);
    }
    const cityName = (city) => { return cityLib[city].name };
    console.log(mode.value, city.value, keyword.value);
    const goSearch = (searchMode = mode.value, key = keyword.value.split(' ').join()) => {
      router.replace({
        name: "Search",
        params: { mode: searchMode, city: city.value, keyword: key }
      })
    }
    return { mode, openCity, goSearch, cityFilter, cityName, city, keyword, searchMode, setCity }
  }
}
</script>