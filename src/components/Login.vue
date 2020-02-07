<template>
<div>
   <Menu />
   
   <div class="ui middle aligned center aligned grid">
    <div class="column marginup" style="min-width:36%;">
        <h2 class="ui teal image header">
        <img src="../assets/images/logo.png" class="image">
        <div class="content">
            Super Attachment Getter 
        </div>
        </h2>
        <form class="ui large form" v-on:submit.prevent ="submitLogin">
        <div class="ui stacked segment">
            <div class="field">
                <div class="ui left icon input">
                    <i class="paper plane icon"></i>
                    <input type="text" name="Url" placeholder="URL Info" v-model="Url">
                </div>
            </div>
            <div class="field">
                <div class="ui left icon input">
                    <i class="user icon"></i>
                    <input type="text" name="username" placeholder="Username" v-model="Username">
                </div>
            </div>
            <div class="field">
                <div class="ui left icon input">
                    <i class="lock icon"></i>
                    <input type="password" name="password" placeholder="Password" v-model="Password">
                </div>
            </div>
            <button type="submit" class="ui fluid large teal submit button" v-bind:disabled="formIsValid" id="login_buton">Login</button>
        </div>

        <div class="ui error message"></div>

        </form>
    </div>
    </div>

   
</div>
</template>

<script>
import { observer } from "mobx-vue";
import swal from 'sweetalert';
import Menu from './Menu'

export default observer({
  name: 'app',
  data() {
    return {
      Url:'',
      Username:'',
      Password:''
    };
  },
  components: {
      Menu
  },
  created:function(){
    
  },
  computed:{
        formIsValid: function(){
          if(this.Url && this.Username && this.Password){
            return false;
          }else{
            return true;
          }
        }
  },
  methods:{
     
      submitLogin: function(){
        var store = global.storage;

        store.URL = this.Url
        store.username = this.Username
        store.password = this.Password
        store.login = true
        swal({
            title: "Successfull",
            text: "You will be redirecting to your CPI World!!",
            icon: "success",
            dangerMode: false,
        });
          
        this.$router.push('/HomePage')
      }
  }
});
</script>


