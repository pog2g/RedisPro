<template>
    <div id="wrapper">
        <main>
            <div class="demo-split">
                <Split v-model="split1">
                    <div slot="left" class="demo-split-pane">
                        Left Pane
                    </div>
                    <Divider type="vertical"/>
                    <div slot="right" class="demo-split-pane">
                        Right Pane
                    </div>
                </Split>
            </div>
        </main>
    </div>
</template>

<script>
  export default {
    name: 'main-page',
    data () {
      return {
        split1: 0.3
      }
    }
  }
</script>

<style>
    @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

    * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
    }

    body {
        font-family: 'Source Sans Pro', sans-serif;
    }

    #wrapper {
        background: radial-gradient(
                ellipse at top left,
                rgba(255, 255, 255, 1) 40%,
                rgba(229, 229, 229, .9) 100%
        );
        height: 100vh;
        padding: 70px 0 0 0;
        width: 100vw;
    }

    main {
        display: flex;
        justify-content: space-between;
    }

    main > div {
        flex-basis: 50%;
    }

    .demo-split {
        height: 93vh;
        border: 1px solid #dcdee2;
    }

    .demo-split-pane {
        padding: 1px;
    }
</style>
