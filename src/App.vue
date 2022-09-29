<template>
  <div class="container">
    <header class="head" :class="{'show': headerShow }">
      <Header :closeHeader="closeHeader"></Header>
    </header>
    <div class="box">
      <div class="nav">
        <button class="nav-btn show" @click.prevent="headerShow = true">
          <i class="fas fa-bars"></i>
        </button>
        <router-link to="/" class="header-logo"></router-link>
        <button class="nav-btn">
          <i class="fas fa-bars"></i>
        </button>
      </div>
      <router-view
        :mode="mode"
        :setMode="setMode"
        :key="$route.fullPath">
      </router-view>
    </div>
  </div>
  
</template>

<script>
import Header from "./components/Header.vue";
import { ref, provide } from 'vue'
import { watch } from "@vue/runtime-core";

export default {
  name: "App",
  components: {
    Header,
  },
  setup() {
    const headerShow = ref(true);
    const closeHeader = () => { headerShow.value = false; };
    const mode = ref('ScenicSpot');
    // provide('headerShow', headerShow.value);
    const setMode = (m) => {
      mode.value = m;
    }
    watch(
      () => mode.value,
      () => {
        const root = (val) => {
          document.documentElement.style.setProperty("--c-main", val);
        };
        if (mode.value === "ScenicSpot") root("#3fb195");
        if (mode.value === "Restaurant") root("#ff9999");
        if (mode.value === "Hotel") root("#A79BFD");
        if (mode.value === "Activity") root("#feb155");
      }
    )
    return { headerShow, closeHeader, mode, setMode }
  }
}
</script>

<style lang="scss" scoped>
@import "./assets/scss/components/_variables.scss";

  .container {
    display: flex;
    width: 100%;
    margin: auto;
    box-sizing: border-box;
    align-items: flex-start;
    @media screen and (max-width: 1024px) {
      flex-wrap: wrap;
    }
  }

  .head {
    position: sticky;
    top: 0;
    left: 0;
    width: 350px;
    height: 100vh;
    padding: 1.5rem;
    background-color: white;
    overflow: scroll;
    box-sizing: border-box;
    @media screen and (max-width: 1024px) {
      position: fixed;
      z-index: 10;
      transform: translateX(-150%);
      transition: transform .5s;
    }
    @media screen and (max-width: 767px) {
      width: 100vw;
    }
    &.show {
      @media screen and (max-width: 1024px) {
        transform: translateX(0%);
      }
    }
  }

  .box {
    flex: 1;
    box-sizing: border-box;
    .nav {
      position: sticky;
      top: 0;
      display: none;
      align-items: center;
      background-color: white;
      z-index: 5;
      @media screen and (max-width: 1024px) {
        display: flex;
      }
      &-btn {
        margin: 0 1rem;
        font-size: 1.8rem;
        border: none;
        color: $c_main;
        outline: none;
        border-radius: .5rem;
        opacity: 0;
        background-color: rgb(233, 233, 233);
        &.show {
          opacity: 1;
        }
      }
    }
  }
</style>
