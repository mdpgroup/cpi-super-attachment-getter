<template>
    <table class="ui celled table  selectable table fixed">
        <thead>
        <th>#</th>
        <th>Header Name</th>
        <th>Header Information</th>
        </thead>
        <tbody>
            <tr v-for="(item, index) in customHeaders" v-bind:key="item.Name" style="cursor:pointer">
            <td>{{ index + 1 }}</td>
            <td>{{ item.Name }}</td>
            <td>{{ item.Text }}</td>
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
      customHeaders:[]
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

