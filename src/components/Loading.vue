<template>
  <div :class="`card-${loadMode}`">
      <div class="card bdrs-sm" v-for="idx in amount" :key="idx">
      <div class="card-box"></div>
      <div class="card-content">
        <h2 class="card-title"></h2>
        <p class="card-text"></p>
        <p class="card-text"></p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Loading',
  props: { loadMode: String, amount: Number },
  setup(props) {

  }
}
</script>