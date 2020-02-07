<template>
    <table class="ui celled table  selectable table fixed">
        <thead>
        <th>#</th>
        <th>Attachment Name</th>
        <th>Content Type</th>
        <th>Size (b)</th>
        </thead>
        <tbody>
            <tr v-for="(item, index) in messageAttachments" v-bind:key="item.Name" v-on:click="getAttachment(item.Attachment_id)" style="cursor:pointer">
                <td>{{ index + 1 }}</td>
                <td>{{ item.Name }}</td>
                <td>{{ item.ContentType }}</td>
                <td>{{ item.Size }}</td>
            </tr>
        </tbody>
    </table>
</template>

<script>
import { observer } from "mobx-vue";
var mime = require('mime-types')
const axios = require('axios');

export default observer({
  name: 'app',
  data() {
    return {
      store: global.storage
    };
  },
  props:{
      messageAttachments:[]
  },
  components: {
      
  },
  methods:{
      FileDownload( response , extension , file_name ){
           //Get file extension
            var ext = mime.extension(extension);

            //File Name as DateTime
            var today = new Date();
            var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
            var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            var dateTime = date+'T'+time;

            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', file_name+'_'+dateTime+'.'+ ext) //or any other extension
            document.body.appendChild( link )
            link.click()

       },

       getAttachment(Attachment_id){
            let self = this 
            var hostURL = self.store.URL;
            var password = self.store.password;
            var username = self.store.username;
            var login = self.store.login;
            var link = this.store.Port;

            var header = {
                'Access-Control-Allow-Origin':'*',
                'Access-Control-Allow-Methods':'GET,PUT,POST,DELETE',
                'Access-Control-Allow-Headers':'"Origin, X-Requested-With, Content-Type, Accept"',
                'url':hostURL,
                'username':username,
                'password':password,
                'login':login
            };

            //Get Attachments
            var messageAttachmentsURL = link + '/GetAttachment/'+Attachment_id;
            axios({
                method: 'GET',
                url: messageAttachmentsURL,
                responseType: 'text',
                headers:header
            })
            .then(response => {
                var file_extension = '';
                var file_name = '';
                for( var i = 0;i<self.messageAttachments.length;i++ ){
                    if( self.messageAttachments[i]['Attachment_id'] ==  Attachment_id){
                        file_extension = self.messageAttachments[i]['ContentType'];
                        file_name = self.messageAttachments[i]['Name'];
                    }
                }
                this.FileDownload( response , file_extension , file_name )
            })
            .catch(() => alert('error occured'))
      }
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

