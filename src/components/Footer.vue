<template>
    <div>
        <div class="ui fixed inverted menu" style="top:auto;bottom:0px !important;">
            <div class="ui container">
                <a href="https://mdpgroup.com" class="header item right aligned">
                    Created with <p style="color:red;">&#10084;</p> by MdpGroup
                </a>
            </div>
        </div>
    </div>
</template>

<script>
import { observer } from "mobx-vue";
import Menu from './Menu'

export default observer({
  name: 'app',
  data() {
    return {
      store: global.storage
    };
  },
  components: {
   Menu
  },
  created:function(){
    
  }
});
</script>

<style>
body {
    background-color: #DADADA;
  }
  body > .grid {
    height: 100%;
  }
  .image {
    margin-top: -100px;
  }
  .column {
    max-width: 450px;
  }
  .marginup{
      margin-top: 10%;
  }

  .ui.menu .item img.logo {
      margin-right: 1.5em;
  }
  .main.container {
      margin-top: 7em;
  }
  .wireframe {
      margin-top: 2em;
  }
  .ui.footer.segment {
      margin: 5em 0em 0em;
      padding: 5em 0em;
  }
  .ui.header>.image+.content, .ui.header>img+.content {
      padding-left: .75rem;
      vertical-align: -webkit-baseline-middle;
  }

</style>

