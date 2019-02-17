<template>
    <div id="title">
        <el-row>
            <el-button>默认按钮</el-button>
            <el-button type="primary">主要按钮</el-button>
            <el-button type="success">成功按钮</el-button>
            <el-button type="info">信息按钮</el-button>
            <el-button type="warning">警告按钮</el-button>
            <el-button type="danger">危险按钮</el-button>
        </el-row>
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
