<template>
  <div :class="`card-${recMode}`" v-if="loading === 1">
    <router-link class="card"
      v-for="item in result"
      :key="item[`${recMode}ID`]"
      :to="`/detail/${item[recMode + 'ID']}`">
      <div class="card-box">
        <img 
          :src="item.Picture.PictureUrl1"
          :alt="item.Picture.PictureDescription1"
          class="card-img">
      </div>
      <div class="card-content">
        <h2 class="card-title" v-text="item[`${recMode}Name`]"></h2>
        <p class="card-text" v-if="item.Date">
          <span v-text="' ' + item.Date"></span>
        </p>
        <p class="card-text" v-if="!item.Date && item.StartTime">
          <span v-text="' ' + item.StartTime"></span>
          <span v-text="' ' + item.EndTime"></span>
        </p>
        <p class="card-text" v-if="item.OpenTime">
          <span v-text="item.OpenTime"></span>
        </p>
        <p class="card-text" v-if="item.TicketInfo">
          <span v-text="item.TicketInfo"></span>
        </p>
        <p class="card-text" v-if="item.Address">
          <span v-text="item.Address"></span>
        </p>
        <p class="card-text" v-if="item.Class || item.Class1 || item.Class2 || item.Class3">
          <span class="card-tag" v-text="item.Class" v-if="item.Class"></span>
          <span class="card-tag" v-text="item.Class1" v-if="item.Class1"></span>
          <span class="card-tag" v-text="item.Class2" v-if="item.Class2"></span>
          <span class="card-tag" v-text="item.Class3" v-if="item.Class3"></span>
        </p>
      </div>
    </router-link>
  </div>
  <div v-if="loading === 0">
    Loading
  </div>
  <div v-if="loading === -1">
    Error
  </div>
</template>
<script>
import { dataFilter, getData, handleTime, getNearInfo } from '../composables/modules.js'
import { ref } from 'vue'

export default {
  name: "Recommend",
  props: {
    recMode: String,
    amount: String,
    lat: Number,
    lon: Number,
    page: Number
  },
  setup(props) {
    const loading = ref(0);
    const result = ref(null);
    const loadData = () => {
      const load = props.lat
      ? getNearInfo(props.recMode, props.lat, props.lon, props.page)
      : getData(props.recMode, 'Taiwan', 1);

      load.then((res) => {
        return dataFilter(res, props.amount);
      }).then((res) => {
        return handleTime(res);
      }).then((res) => {
        result.value = res;
        loading.value = 1;
      }).catch((err) => {
        loading.value = -1;
      })
    }
    loadData();
    return { loading, result }
  }
}
</script>