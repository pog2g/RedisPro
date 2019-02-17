<template>
    <div id="app">
        <browser-window-title/>
        <div>
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
  import BrowserWindowTitle from './components/BrowserWindowTitle'

  export default {
    name: 'app',
    components: {
      BrowserWindowTitle
    }
  }
</script>

<style>
    html, body, div {
        margin: 0;
        padding: 0;
    }
</style>
