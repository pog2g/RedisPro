<template>
    <div id="title">
        <div>应用程序标题栏</div>
    </div>
</template>

<script>
  export default {
    name: 'BrowserWindowTitle'
  }
</script>

<style scoped>
    #title {
        position: absolute;
        width: 100%;
        height: 50px;
        padding-left: 20px;
        padding-right: 20px;
        padding-top: 20px;
        background-color: #e3e4e5;
        box-shadow: 0 1px 0 #cfcfcf;
        -webkit-app-region: drag;
    }
</style>
