<template>
  <div class="detail" v-if="loading === 1">
    <div class="detail-title">
      <div class="d-flex align-items-center">
        <button class="detail-btn" @click.prevent="hasHistory() ? $router.go(-1) : $router.push('/')">
          <i class="fas fa-chevron-left"></i>
        </button>
        <h1 class="detail-title">{{ result[mode + 'Name']}}</h1>
      </div>
      <div>
        <button class="detail-btn" onclick="window.print()"><i class="fas fa-print"></i></button>
      </div>
    </div>
    <div class="banner">
      <img class="banner-img" :src="result.Picture.PictureUrl1" :alt="result.Picture.PictureDescription1">
    </div>
    <h2 class="detail-info-title">
      <i class="fas fa-info"></i>
      {{ getMode(route.params.id, false) + '資訊'}}
    </h2>
    <div class="detail-info">
      <p v-if="result.Date">
        <span> 活動日期：</span>
        <span>{{ result.Date }}</span>
      </p>
      <p v-if="!result.Date && result.StartTime">
        <span> 活動期間：</span>
        <span v-text="result.StartTime + ' ~ '"></span>
        <span v-text="result.EndTime"></span>
      </p>
      <p v-if="result.OpenTime">
        <span> 開放時段：</span>
        <span v-text="result.OpenTime"></span>
      </p>
      <p v-if="result.TicketInfo">
        <span> 門票費用：</span>
        <span v-text="result.TicketInfo"></span>
      </p>
      <p v-if="result.Address">
        <i class="ico-location-pin"></i>
        <span v-text="` ${getMode(route.params.id, false)}地點：`"></span>
        <span v-text="`${result.Location} `" v-if="result.Location"></span>
        <span v-text="result.Address"></span>
      </p>
      <p v-if="result.Phone">
        <i class="ico-ui-touch-phone"></i>
        <span> 聯絡電話：</span>
        <a :href="`tel:${result.Phone}`" v-text="result.Phone"></a>
      </p>
      <p v-if="result.WebsiteUrl">
        <i class="ico-earth"></i>
        <span> 官方網站：</span>
        <a :href="result.WebsiteUrl" target="_blank">點我前往</a>
      </p>
      <p v-if="result.Organizer">
        <i class="ico-people"></i>
        <span> 主辦單位：</span>
        <span v-text="result.Organizer"></span>
      </p>
      <p v-if="result.Cycle">
        <i class="ico-ui-text-chat"></i>
        <span> 備註說明：</span>
        <span v-text="result.Cycle"></span>
      </p>
      <p v-if="result.Class || result.Class1 || result.Class2 || result.Class3">
        <span v-text="`${getMode(route.params.id, false)}標籤：`"></span>
        <!-- <router-link 
          class="detail-tag"
          v-if="result.Class"
          v-text="result.Class">
        </router-link>
        <router-link 
          class="detail-tag"
          v-if="result.Class1"
          v-text="result.Class1">
        </router-link>
        <router-link 
          class="detail-tag"
          v-if="result.Class2"
          v-text="result.Class2">
        </router-link>
        <router-link 
          class="detail-tag"
          v-if="result.Class3"
          v-text="result.Class3">
        </router-link> -->
      </p>

    </div>
    <h2 class="detail-info-title">
      <i class="fas fa-comment"></i>
      <span v-text="getMode(route.params.id, false) + '介紹'"></span>
    </h2>
    <p class="detail-pre" v-text="result.Description || result.DescriptionDetail"></p>
    <h2 class="fz-md c-main detail-info-title"><i class="fas fa-car"></i> 交通方式</h2>
    <pre class="detail-pre" v-text="result.TravelInfo"></pre>
    <pre class="detail-pre" v-text="result.ParkingInfo"></pre>
    <div>
      <iframe 
        width="100%"
        height="250"
        loading="lazy"
        v-if="mode == 'Activity'"
        :src="`https://maps.google.com/maps?q=${result.Position.PositionLat},${result.Position.PositionLon}&hl=zh-TW&z=16&amp;output=embed`" ></iframe>
      <iframe 
        width="100%"
        height="250"
        loading="lazy"
        v-else
        :src="`https://maps.google.com/maps?q=${result[mode + 'Name']}+${result[mode + 'Name'].split('').join('+')}&hl=zh-TW&z=16&amp;output=embed`">
      </iframe>
    </div>
    <div class="space"></div>
    <div class="d-flex justify-content-between align-items-center">
      <h2 class="detail-info-title">
        <i class="fas fa-location-arrow"></i>
        <span>查看鄰近的景點</span>
      </h2>
      <router-link
        :to="`/ScenicSpot/${result.Position.PositionLat}/${result.Position.PositionLon}`"
        class="detail-more"
      >
        More
      </router-link>
    </div>
    <Recommend
      recMode="ScenicSpot"
      :lat="result.Position.PositionLat"
      :lon="result.Position.PositionLon"
      :page="parseInt(1)"
      amount="3"
    />
    <div class="d-flex justify-content-between align-items-center">
      <h2 class="detail-info-title">
        <i class="fas fa-flag"></i>
        <span>查看鄰近的活動</span>
      </h2>
      <router-link
        :to="`/ScenicSpot/${result.Position.PositionLat}/${result.Position.PositionLon}`"
        class="detail-more"
      >
        More
      </router-link>
    </div>
    <Recommend
      recMode="Activity"
      :lat="result.Position.PositionLat"
      :lon="result.Position.PositionLon"
      :page="parseInt(1)"
      amount="3"
    />
    <div class="d-flex justify-content-between align-items-center">
      <h2 class="detail-info-title">
        <i class="fas fa-utensils"></i>
        <span>查看鄰近的餐飲</span>
      </h2>
      <router-link
        :to="`/ScenicSpot/${result.Position.PositionLat}/${result.Position.PositionLon}`"
        class="detail-more"
      >
        More
      </router-link>
    </div>
    <Recommend
      recMode="Restaurant"
      :lat="result.Position.PositionLat"
      :lon="result.Position.PositionLon"
      :page="parseInt(1)"
      amount="3"
    />
    <div class="d-flex justify-content-between align-items-center">
      <h2 class="detail-info-title">
        <i class="fas fa-hotel"></i>
        <span>查看鄰近的旅宿</span>
      </h2>
      <router-link
        :to="`/ScenicSpot/${result.Position.PositionLat}/${result.Position.PositionLon}`"
        class="detail-more"
      >
        More
      </router-link>
    </div>
    <Recommend
      recMode="Hotel"
      :lat="result.Position.PositionLat"
      :lon="result.Position.PositionLon"
      :page="parseInt(1)"
      amount="3"
    />
  </div>
  <div v-if="loading <= 0">
    Loading
  </div>
</template>

<script>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getDetail, getMode } from '../composables/modules.js'
import Recommend from '../components/Recommend.vue'
export default {
  name: 'Detail',
  components: { Recommend },
  props: {
    mode: String,
    setMode: Function,
  },
  setup(props) {
    const route = useRoute();
    const router = useRouter();
    const loading = ref(0);
    const result = ref(null);
    const hasHistory = () => window.history.length > 2;
    const loadData = () => {
      if(!route.params.id) {
        router.replace({ name: 'Home'});
      }
      getDetail(route.params.id).then(res => {
        console.log(res);
        result.value = res;
        props.setMode(getMode(route.params.id, true));
        loading.value = 1;
      }).catch(item => {
        loading.value = -1;
      });
    }
    onMounted(() => {
      loadData();
    });
    return { loading, result, hasHistory, getMode, route };
  }
}
</script>

<style lang="scss" scoped>
  .detail {
    padding: 2rem;
    p {
      padding-bottom: .5rem;
      font-size: 1.05rem;
    }
    &-pre {
      padding: 0 1rem;
      line-height: 1.5rem;
    }
    &-info {
      padding: 1rem;
      border-radius: .5rem;
      background: #ffeeee;
    }
    &-title{
      font-size: 2rem;
      font-weight: bold;
      padding-bottom: 0.2rem;
    }
    &-info-title {
      margin: 1.5rem 0;
      font-size: 1.3rem;
      font-weight: bold;
    }
    &-more {
      text-decoration: none;
      color: black;
    }
  }
  .banner {
    position: relative;
    width: 100%;
    height: 300px;
    margin: 1.5rem 0;
    overflow: hidden;
    border-radius: 1rem;
    &-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center center;
    }
  }
</style>