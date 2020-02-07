<template>
    <router-view/>
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
  created:function(){
    
    var store = global.storage;
    if(!store.login){
      this.$router.push('/Login');
      
    }else{
      this.$router.push('/HomePage');
    }

  }
});
</script>

