<template>
    <div>
        <div class="ui fixed menu">
            <div class="ui container">
                <a href="#" class="header item">
                    <img class="logo" src="../assets/images/logo.png">
                    Super Attachment Getter
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


