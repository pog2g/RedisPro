<template>
    <div id="app">
        <Mytitle/>
        <!-- <router-view></router-view> -->
        <router-view/>
    </div>
</template>

<script>
  import Mytitle from './components/MyTitle'

  export default {
    name: 'app',
    components: {
      Mytitle
    }
  }
</script>

<style>
    html, body, div {
        margin: 0;
        padding: 0;
    }
</style>
