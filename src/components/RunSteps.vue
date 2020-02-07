<template>
    <table class="ui celled table selectable fixed">
        <thead>
        <th>Child Count</th>
        <th>Activity</th>
        <th>Error</th>
        <th>Status</th>
    </thead>
    <tbody>
        <tr v-for="(item) in runSteps" v-bind:key="item.Name" style="cursor:pointer">
            <td>{{ item.ChildCount }}</td>
            <td>{{ item.Activity }}</td>
            <td>{{ item.Error }}</td>
            <td>{{ item.Status }}</td>
        </tr>
    </tbody>
    </table>
</template>

<script>
import { observer } from "mobx-vue";

export default observer({
  name: 'app',
  data() {
    return {
      store: global.storage
    };
  },
  props:{
      runSteps:[]
  },
  components: {
      
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

