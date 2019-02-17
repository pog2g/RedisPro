<template>
    <div id="title">
        <el-row>
            <div style="float: left;">
                <el-button>新建链接</el-button>
                <el-button type="primary">监控</el-button>
                <el-button type="success">信息</el-button>
                <el-button type="info">配置</el-button>
            </div>
            <div style="float: right;">
                <el-button type="primary" icon="el-icon-arrow-left"></el-button>
                <el-button type="primary"><i class="el-icon-arrow-right el-icon--right"></i></el-button>
            </div>
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
        height: 70px;
        padding-left: 20px;
        padding-right: 20px;
        padding-top: 20px;
        background-color: #e3e4e5;
        box-shadow: 0 1px 0 #cfcfcf;
        -webkit-app-region: drag;
    }
</style>
