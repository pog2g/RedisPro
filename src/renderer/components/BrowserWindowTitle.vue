<template>
    <div id="title">
        <div style="float: left;">
            <Button style="margin-right: 20px">
                <Icon type="md-add"/>
                新建链接
            </Button>
            <Button style="margin-right: 20px" type="success">监控</Button>
            <Button style="margin-right: 20px" type="info">信息</Button>
            <Button type="warning">配置</Button>
        </div>
        <div style="float: right;">
            <ButtonGroup :size="buttonSize">
                <Button :size="buttonSize" type="primary">
                    <Icon type="ios-arrow-back"/>
                </Button>
                <Button :size="buttonSize" type="primary">
                    <Icon type="ios-arrow-forward"/>
                </Button>
            </ButtonGroup>
        </div>
    </div>
</template>

<script>
  export default {
    name: 'BrowserWindowTitle'
  }
</script>

<style scoped>
    #title {
        background: radial-gradient(
                ellipse at top left,
                rgba(255, 255, 255, 1) 40%,
                rgba(229, 229, 229, .9) 100%
        );
        position: absolute;
        width: 100%;
        height: 70px;
        padding-left: 20px;
        padding-right: 20px;
        padding-top: 20px;
        box-shadow: 0 1px 0 #cfcfcf;
        -webkit-app-region: drag;
    }
</style>
