<template>
    <div>
        <Menu />
        <div class="vld-parent">
            <loading :active.sync="isLoading" 
            :can-cancel="true" 
            :on-cancel="onCancel"
            :is-full-page="fullPage"></loading>
            
        </div>
        <div class="ui main text container">
            <div class="column integration">
                <div class="ui top attached tab segment active">
                    <div class="ui top attached tabular menu">
                       <a class="item active">Integration with Message Logs</a>
                       <a class="item right aligned">
                        <div class="item center aligned">
                            <sui-button circular content="Refresh" color="red" icon="refresh" v-on:click="refreshMessageLogs()"/>
                        </div>
                        <sui-dropdown placeholder="Log Date" selection :options="options" v-model="logDate"/>
                        
                       </a>
                    </div>
                    <table class="ui celled selectable table fixed">
                        <thead>
                            <th>#</th>
                            <th>Name</th>
                            <th>Type</th>
                            <th>Log End</th>
                        </thead> 
                        <tbody>
                            <tr v-for="(item, index) in integrationCon" v-bind:key="item.Name" v-on:click="sortData(item.Name)" style="cursor:pointer">
                                <td>{{ index + 1 }}</td>
                                <td>{{ item.Name }}</td>
                                <td>{{ item.Type }}</td>
                                <td>{{ item.LogEnd }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="column" style="float: right;min-height: 500px;">
                <div class="ui top attached tabular menu">
                    <a class="item right aligned" data-tab="forth" :class="{ active: forthTab }" @click="switchTabs('forth')">Run Steps</a>
                    <a class="item" :class="{ active: thirdTab }" @click="switchTabs('third')" data-tab="third">Error Logs</a>
                    <a class="item" :class="{ active: secondTab }" @click="switchTabs('second')" data-tab="second">Custom Headers</a>
                    <a class="item" :class="{ active: firstTab }" @click="switchTabs('first')" data-tab="first">Attachments</a>
                </div>
                <div class="ui bottom attached tab segment" :class="{ active: forthTab }" data-tab="Error">
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
                </div>
                <div class="ui bottom attached tab segment" :class="{ active: firstTab }"  data-tab="first">
                    <MessageAttachment v-bind:messageAttachments=messageAttachments />
                </div>
                <div class="ui bottom attached tab segment" :class="{ active: secondTab }" data-tab="second">
                    <CustomHeadervue v-bind:customHeaders=customHeaders />
                </div>
                 <div class="ui bottom attached tab segment" :class="{ active: thirdTab }" data-tab="third">
                    <table class="ui celled table  selectable table fixed">
                        <thead>
                        <th>Error</th>
                        </thead>
                        <tbody>
                            <tr v-for="(item) in errorLogInfo" v-bind:key="item.Error" style="cursor:pointer">
                                <td>{{ item['Error'] }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>


            <div class="column" style="margin: 10px 0px 80px 0px;max-height:500px;overflow:auto;">
                 <div class="ui bottom attached tab segment active">
                    <table class="ui celled table  selectable table fixed">
                        <thead>
                        <th>#</th>
                        <th>Name</th>
                        <th>Log Start</th>
                        <th>Log End</th>
                        <th>Status</th>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index) in messageLogs" v-bind:class="[item.Status == 'COMPLETED' ? 'Success' : 'Failed']" v-bind:key="item.Name" v-on:click="getDetails(item.Guid , item.Status)" style="cursor:pointer">
                                <td>{{ index + 1 }}</td>
                                <td>{{ item.Name }}</td>
                                <td>{{ item.LogStart }}</td>
                                <td>{{ item.LogEnd }}</td>
                                <td>{{ item.Status }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            
        </div>

        <!--Footer-->
        <Footer />
        <!--Footer-->

    </div>

   
</template>

<script>
import { observer } from "mobx-vue";
import Menu from './Menu'
import Footer from './Footer'
import MessageAttachment from './MessageAttachment'
import CustomHeadervue from './CustomHeader'
const axios = require('axios');
import swal from 'sweetalert';
import IntegrationContents from '../data/IntegrationContents';
import MessageProcessingLog from '../data/MessageProcessingLog';
import Attachment from '../data/Attachments';
import CustomHeader from '../data/CustomHeader';     
import RunStep from '../data/RunStep';   
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';

//var decode = require('urldecode')
//var moment = require("moment");

export default observer({
  name: 'app',
  data() {
    return {
      store:global.storage,
      integrationdata:global.storage,  
      firstTab:'true',
      secondTab:false,
      thirdTab:false,
      forthTab:false,
      integrationCon:[],
      return_data:[],
      return_data_first:[],
      messageLogs:[],
      messageAttachments:[],
      customHeaders:[],
      runSteps:[],
      errorLogInfo:[],
      isLoading: false,
      fullPage: true,
      options: [{
        text: '1 hour',
        value: 1,
      }, {
        text: '1 day',
        value: 2,
      }, {
        text: '1 week',
        value: 3,
      }, {
        text: '1 month',
        value: 4,
      }
      ],
      logDate:1
    };
  },
  components: {
   Menu,
   Footer,
   MessageAttachment,
   CustomHeadervue,
   Loading
  },
  watch: 
  { 
    logDate: function() 
    { 
        let self = this
        //Delete Current tables
        self.return_data_first = []
        self.integrationCon = []
        self.return_data = []
        self.messageLogs = []
        self.messageAttachments = []
        self.customHeaders = []
        self.runSteps = []
        self.errorLogInfo = []
        var DateFilter = ''

        var d = new Date();  // Gets the current time
        var now = Math.floor(d.getTime()/1000); 
        var datenow = new Date(now * 1000 ); 
        var formatted_date_now = '';
        var datelast = '';

        //We will get all data according to the date
        if( this.logDate == 1 ){
            var last = Math.floor(d.getTime()/1000) - 3600;
            datelast = new Date( last * 1000 );
            formatted_date_now = datenow.getFullYear() + "-" + this.appendLeadingZeroes(datenow.getMonth() + 1) + "-" + this.appendLeadingZeroes(datenow.getDate()) + "T" + this.appendLeadingZeroes(datenow.getHours()) + ":" + this.appendLeadingZeroes(datenow.getMinutes()) + ":" + this.appendLeadingZeroes(datenow.getSeconds())
            var formatted_date_lasthour = datelast.getFullYear() + "-" + this.appendLeadingZeroes(datelast.getMonth() + 1) + "-" + this.appendLeadingZeroes(datelast.getDate()) + "T" + this.appendLeadingZeroes(datelast.getHours()) + ":" + this.appendLeadingZeroes(datelast.getMinutes()) + ":" + this.appendLeadingZeroes(datelast.getSeconds())
            
            //We'll get the date
            DateFilter = "$filter=LogEnd gt datetime'"+formatted_date_lasthour+"' and LogEnd le datetime'"+formatted_date_now+"'";
        }else if( this.logDate == 2 ){
            var lastday = Math.floor(d.getTime()/1000) - 86400;
            datelast = new Date( lastday * 1000 );
            formatted_date_now = datenow.getFullYear() + "-" + this.appendLeadingZeroes(datenow.getMonth() + 1) + "-" + this.appendLeadingZeroes(datenow.getDate()) + "T" + this.appendLeadingZeroes(datenow.getHours()) + ":" + this.appendLeadingZeroes(datenow.getMinutes()) + ":" + this.appendLeadingZeroes(datenow.getSeconds())
            var formatted_date_lastday = datelast.getFullYear() + "-" + this.appendLeadingZeroes(datelast.getMonth() + 1) + "-" + this.appendLeadingZeroes(datelast.getDate()) + "T" + this.appendLeadingZeroes(datelast.getHours()) + ":" + this.appendLeadingZeroes(datelast.getMinutes()) + ":" + this.appendLeadingZeroes(datelast.getSeconds())
            
            //We'll get the date
            DateFilter = "$filter=LogEnd gt datetime'"+formatted_date_lastday+"' and LogEnd le datetime'"+formatted_date_now+"'";
        }else if( this.logDate == 3 ){
            var lastweek = Math.floor(d.getTime()/1000) - 604800;
            datelast = new Date( lastweek * 1000 );
            formatted_date_now = datenow.getFullYear() + "-" + this.appendLeadingZeroes(datenow.getMonth() + 1) + "-" + this.appendLeadingZeroes(datenow.getDate()) + "T" + this.appendLeadingZeroes(datenow.getHours()) + ":" + this.appendLeadingZeroes(datenow.getMinutes()) + ":" + this.appendLeadingZeroes(datenow.getSeconds())
            var formatted_date_lastweek = datelast.getFullYear() + "-" + this.appendLeadingZeroes(datelast.getMonth() + 1) + "-" + this.appendLeadingZeroes(datelast.getDate()) + "T" + this.appendLeadingZeroes(datelast.getHours()) + ":" + this.appendLeadingZeroes(datelast.getMinutes()) + ":" + this.appendLeadingZeroes(datelast.getSeconds())
            
            //We'll get the date
            DateFilter = "$filter=LogEnd gt datetime'"+formatted_date_lastweek+"' and LogEnd le datetime'"+formatted_date_now+"'";
        }else if( this.logDate == 4 ){
            var lastmonth = Math.floor(d.getTime()/1000) - 2629743;
            datelast = new Date( lastmonth * 1000 );
            formatted_date_now = datenow.getFullYear() + "-" + this.appendLeadingZeroes(datenow.getMonth() + 1) + "-" + this.appendLeadingZeroes(datenow.getDate()) + "T" + this.appendLeadingZeroes(datenow.getHours()) + ":" + this.appendLeadingZeroes(datenow.getMinutes()) + ":" + this.appendLeadingZeroes(datenow.getSeconds())
            var formatted_date_lastmonth = datelast.getFullYear() + "-" + this.appendLeadingZeroes(datelast.getMonth() + 1) + "-" + this.appendLeadingZeroes(datelast.getDate()) + "T" + this.appendLeadingZeroes(datelast.getHours()) + ":" + this.appendLeadingZeroes(datelast.getMinutes()) + ":" + this.appendLeadingZeroes(datelast.getSeconds())
            
            //We'll get the date
            DateFilter = "$filter=LogEnd gt datetime'"+formatted_date_lastmonth+"' and LogEnd le datetime'"+formatted_date_now+"'";
        }

        self.getDataRecursively( 0 , DateFilter );
        

    }
  },
  methods:{
    refreshMessageLogs:function(){
        let self = this
        //Delete Current tables
        self.return_data_first = []
        self.integrationCon = []
        self.return_data = []
        self.messageLogs = []
        self.messageAttachments = []
        self.customHeaders = []
        self.runSteps = []
        self.errorLogInfo = []
        var DateFilter = ''

        var d = new Date();  // Gets the current time
        var now = Math.floor(d.getTime()/1000); 
        var datenow = new Date(now * 1000 ); 
        var formatted_date_now = '';
        var datelast = '';

        //We will get all data according to the date
        if( this.logDate == 1 ){
            var last = Math.floor(d.getTime()/1000) - 3600;
            datelast = new Date( last * 1000 );
            formatted_date_now = datenow.getFullYear() + "-" + this.appendLeadingZeroes(datenow.getMonth() + 1) + "-" + this.appendLeadingZeroes(datenow.getDate()) + "T" + this.appendLeadingZeroes(datenow.getHours()) + ":" + this.appendLeadingZeroes(datenow.getMinutes()) + ":" + this.appendLeadingZeroes(datenow.getSeconds())
            var formatted_date_lasthour = datelast.getFullYear() + "-" + this.appendLeadingZeroes(datelast.getMonth() + 1) + "-" + this.appendLeadingZeroes(datelast.getDate()) + "T" + this.appendLeadingZeroes(datelast.getHours()) + ":" + this.appendLeadingZeroes(datelast.getMinutes()) + ":" + this.appendLeadingZeroes(datelast.getSeconds())
            
            //We'll get the date
            DateFilter = "$filter=LogEnd gt datetime'"+formatted_date_lasthour+"' and LogEnd le datetime'"+formatted_date_now+"'";
        }else if( this.logDate == 2 ){
            var lastday = Math.floor(d.getTime()/1000) - 86400;
            datelast = new Date( lastday * 1000 );
            formatted_date_now = datenow.getFullYear() + "-" + this.appendLeadingZeroes(datenow.getMonth() + 1) + "-" + this.appendLeadingZeroes(datenow.getDate()) + "T" + this.appendLeadingZeroes(datenow.getHours()) + ":" + this.appendLeadingZeroes(datenow.getMinutes()) + ":" + this.appendLeadingZeroes(datenow.getSeconds())
            var formatted_date_lastday = datelast.getFullYear() + "-" + this.appendLeadingZeroes(datelast.getMonth() + 1) + "-" + this.appendLeadingZeroes(datelast.getDate()) + "T" + this.appendLeadingZeroes(datelast.getHours()) + ":" + this.appendLeadingZeroes(datelast.getMinutes()) + ":" + this.appendLeadingZeroes(datelast.getSeconds())
            
            //We'll get the date
            DateFilter = "$filter=LogEnd gt datetime'"+formatted_date_lastday+"' and LogEnd le datetime'"+formatted_date_now+"'";
        }else if( this.logDate == 3 ){
            var lastweek = Math.floor(d.getTime()/1000) - 604800;
            datelast = new Date( lastweek * 1000 );
            formatted_date_now = datenow.getFullYear() + "-" + this.appendLeadingZeroes(datenow.getMonth() + 1) + "-" + this.appendLeadingZeroes(datenow.getDate()) + "T" + this.appendLeadingZeroes(datenow.getHours()) + ":" + this.appendLeadingZeroes(datenow.getMinutes()) + ":" + this.appendLeadingZeroes(datenow.getSeconds())
            var formatted_date_lastweek = datelast.getFullYear() + "-" + this.appendLeadingZeroes(datelast.getMonth() + 1) + "-" + this.appendLeadingZeroes(datelast.getDate()) + "T" + this.appendLeadingZeroes(datelast.getHours()) + ":" + this.appendLeadingZeroes(datelast.getMinutes()) + ":" + this.appendLeadingZeroes(datelast.getSeconds())
            
            //We'll get the date
            DateFilter = "$filter=LogEnd gt datetime'"+formatted_date_lastweek+"' and LogEnd le datetime'"+formatted_date_now+"'";
        }else if( this.logDate == 4 ){
            var lastmonth = Math.floor(d.getTime()/1000) - 2629743;
            datelast = new Date( lastmonth * 1000 );
            formatted_date_now = datenow.getFullYear() + "-" + this.appendLeadingZeroes(datenow.getMonth() + 1) + "-" + this.appendLeadingZeroes(datenow.getDate()) + "T" + this.appendLeadingZeroes(datenow.getHours()) + ":" + this.appendLeadingZeroes(datenow.getMinutes()) + ":" + this.appendLeadingZeroes(datenow.getSeconds())
            var formatted_date_lastmonth = datelast.getFullYear() + "-" + this.appendLeadingZeroes(datelast.getMonth() + 1) + "-" + this.appendLeadingZeroes(datelast.getDate()) + "T" + this.appendLeadingZeroes(datelast.getHours()) + ":" + this.appendLeadingZeroes(datelast.getMinutes()) + ":" + this.appendLeadingZeroes(datelast.getSeconds())
            
            //We'll get the date
            DateFilter = "$filter=LogEnd gt datetime'"+formatted_date_lastmonth+"' and LogEnd le datetime'"+formatted_date_now+"'";
        }

        self.getDataRecursively( 0 , DateFilter );
    },
    getDataRecursively:function( skip , Datefilter ){
        let self = this 
        self.isLoading = true
        var hostURL = this.store.URL;
        var password = this.store.password;
        var username = this.store.username;
        var login = this.store.login;
        var link = this.store.Port;
        
        var DataURL1 = '';
        if( skip == 0 )
            DataURL1 = 'MessageProcessingLogs?'+ Datefilter +'&$orderby=LogEnd desc';
        else 
            DataURL1 = 'MessageProcessingLogs?$skip=' + skip + '&' + Datefilter + "&$orderby=LogEnd desc";

        var header = {
            'Access-Control-Allow-Origin':'*',
            'Access-Control-Allow-Methods':'GET,PUT,POST,DELETE',
            'Access-Control-Allow-Headers':'"Origin, X-Requested-With, Content-Type, Accept"',
            'url':hostURL,
            'url_info':DataURL1,
            'username':username,
            'password':password,
            'login':login
        };

        var messageProcessingLog = link + '/GetMessageProcessingLogs';
        axios({
            method: 'GET',
            url: messageProcessingLog,
            responseType: 'json',
            headers:header
        })
        .then(function (response) {
            if( response.data.feed.entry ){
                //Her bir entry'i parse edelim.
                var xml_entry = response.data.feed.entry;
                var flag = 0;
                self.return_data = xml_entry;
                for( var i = 0;i<xml_entry.length;i++ ){
                    var entry_element = xml_entry[i].content[0];
                    var temps = new IntegrationContents();
                    temps.Name = entry_element['m:properties'][0]['d:IntegrationArtifact'][0]['d:Name'][0];
                    temps.Type = entry_element['m:properties'][0]['d:IntegrationArtifact'][0]['d:Type'][0];
                    temps.LogEnd = entry_element['m:properties'][0]['d:LogEnd'][0];
                    
                    flag = 0;
                    //Check if unique or not
                    for( var j = 0;j< self.integrationCon.length; j++ ){
                        var integrationName = String(self.integrationCon[j].Name);
                        var temp_name = String(temps.Name);
                        
                        if( integrationName.trim() == temp_name.trim() ){
                            flag = 1;
                            break;
                        }
                    }
                    if(flag == 0){
                        self.integrationCon.push( temps );    
                    }

                    var test_data = new MessageProcessingLog();
                    test_data.Name = entry_element['m:properties'][0]['d:IntegrationArtifact'][0]['d:Name'][0];
                    test_data.Type = entry_element['m:properties'][0]['d:IntegrationArtifact'][0]['d:Type'][0];
                    test_data.LogStart = entry_element['m:properties'][0]['d:LogStart'][0];
                    test_data.LogEnd = entry_element['m:properties'][0]['d:LogEnd'][0];
                    test_data.Status = entry_element['m:properties'][0]['d:Status'][0];
                    test_data.Guid = entry_element['m:properties'][0]['d:MessageGuid'][0];
                    
                    self.return_data_first.push( test_data );

                }

                skip += 1000;
                if( response.data.feed.link[1] ){
                    if( response.data.feed.link[1]['$'] ){
                        if( response.data.feed.link[1]['$']['rel'] == 'next' ){
                            self.getDataRecursively( skip , Datefilter);
                        }
                    }
                }
                
                
            }
            self.isLoading = false
        })
        .catch(function (error) {
            self.isLoading = false
            swal({
                title: "UnSuccessfull",
                text: error.data,
                icon: "error",
                dangerMode: false
            });

        });

    },
    appendLeadingZeroes:function(n){
        if(n <= 9){
            return "0" + n;
        }
        return n
    },
    switchTabs:function(tab){
          if (tab === 'first') {
                this.firstTab = true;
                this.secondTab = false;
                this.thirdTab = false;
                this.forthTab = false;
          } else if(tab === 'second') {
                this.firstTab = false;
                this.secondTab = true;
                this.thirdTab = false;
                this.forthTab = false;
          }else if(tab === 'third') {
                this.firstTab = false;
                this.secondTab = false;
                this.thirdTab = true;
                this.forthTab = false;
          }else{
                this.firstTab = false;
                this.secondTab = false;
                this.thirdTab = false;
                this.forthTab = true;
          }
      },
    sortData:function(Name){
        let self = this
        self.messageLogs = [];
        
        //alert(Name)
        for( var i = 0;i<self.return_data_first.length;i++ ){
            var entry_element = self.return_data_first[i];
            var entry_element_name = String(entry_element['Name']);
            
            if( Name ==  entry_element_name){
                //alert( entry_element['Name'] )
                var temps = new MessageProcessingLog();
                temps.Name = entry_element['Name'];
                temps.Type = entry_element['Type'];
                temps.LogStart = entry_element['LogStart'];
                temps.LogEnd = entry_element['LogEnd'];
                temps.Status = entry_element['Status'];
                temps.Guid = entry_element['Guid'];
                self.messageLogs.push(temps);
            }
        }

      },
    getDetails:function(Guid , Status){
        let self = this 
        self.isLoading = true;
        self.messageAttachments = []
        self.customHeaders = []
        self.runSteps = []
        self.errorLogInfo = []

        var hostURL = self.store.URL;
        var password = self.store.password;
        var username = self.store.username;
        var login = self.store.login;
        var link = self.store.Port;
        
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
        var messageProcessingAttachments = link + '/MessageAttachment/'+Guid;
        axios({
            method: 'GET',
            url: messageProcessingAttachments,
            responseType: 'json',
            headers:header
        })
        .then(function (response) {
            
            if( response.data.feed.entry ){
                var xml_entry = response.data.feed.entry;
                for(var i = 0;i<xml_entry.length;i++){
                   var entry_element = xml_entry[i];

                   var temps2 = new Attachment();
                   temps2.Name = entry_element['m:properties'][0]['d:Name'][0];
                   temps2.Size = entry_element['m:properties'][0]['d:PayloadSize'][0];
                   temps2.ContentType = entry_element['m:properties'][0]['d:ContentType'][0];
                   temps2.Attachment_id = entry_element['m:properties'][0]['d:Id'][0];

                   self.messageAttachments.push( temps2 );
                }
            }

        })
        .catch(function (error) {
            swal({
                title: "UnSuccessfull",
                text: error.data,
                icon: "error",
                dangerMode: false
            });
        });

        //Get Custom Headers
        var messageProcessingCustomHeaders = link + '/CustomHeaders/'+Guid;
        axios({
            method: 'GET',
            url: messageProcessingCustomHeaders,
            responseType: 'json',
            headers:header
        })
        .then(function (response) {
            if( response.data.feed.entry ){
                var xml_entry = response.data.feed.entry;
                for(var i = 0;i<xml_entry.length;i++){
                   var entry_element = xml_entry[i];
                   var temps = new CustomHeader();
                   temps.Name = entry_element['content'][0]['m:properties'][0]['d:Name'][0];
                   temps.Text = entry_element['content'][0]['m:properties'][0]['d:Value'][0];

                   self.customHeaders.push( temps );
                }
                
            }

        })
        .catch(function (error) {
            swal({
                title: "UnSuccessfull",
                text: error.data,
                icon: "error",
                dangerMode: false
            });
        });

        //Getting Run Steps
        var messageRunSteps = link + '/MessageRuns/'+Guid;
        axios({
            method: 'GET',
            url: messageRunSteps,
            responseType: 'json',
            headers:header
        })
        .then(function (response) {
            if( response.data.feed.entry[0]['content'][0]['m:properties'] ){
                var xml_entry = response.data.feed.entry;
                var Id = xml_entry[0]['content'][0]['m:properties'][0]['d:Id'][0];
                var messageRunAllSteps = link + '/RunSteps/'+Id;
                axios({
                    method: 'GET',
                    url: messageRunAllSteps,
                    responseType: 'json',
                    headers:header
                })
                .then(function (response) {
                    
                    if( response.data.feed.entry ){
                        var xml_entry = response.data.feed.entry;
                        for(var i = 0;i<xml_entry.length;i++){
                            var entry_element = xml_entry[i];
                            var temps = new RunStep();
                            temps.ChildCount = entry_element['content'][0]['m:properties'][0]['d:ChildCount'][0];
                            temps.StepStop = entry_element['content'][0]['m:properties'][0]['d:StepStop'][0];
                            temps.Activity = entry_element['content'][0]['m:properties'][0]['d:Activity'][0];
                            temps.Error = entry_element['content'][0]['m:properties'][0]['d:Error'][0];
                            temps.Status = entry_element['content'][0]['m:properties'][0]['d:Status'][0];

                            self.runSteps.push( temps );
                        }
                    }

                })
                .catch(function (error) {
                    swal({
                        title: "UnSuccessfull",
                        text: error.data,
                        icon: "error",
                        dangerMode: false
                    });
                });
               
            }
            
        })
        .catch(function (error) {
            swal({
                title: "UnSuccessfull",
                text: error.data,
                icon: "error",
                dangerMode: false
            });
        });


        //Get Error Log
        if( Status == 'FAILED' ){
            var messageErrorLog = link + '/MessageErrorLog/'+Guid;
            axios({
                method: 'GET',
                url: messageErrorLog,
                responseType: 'json',
                headers:header
            })
            .then(function (response) {
                if( response.data.entry.content ){
                    var Id = Guid;
                    var messageErrorLogId = link + '/ErrorLogValue/'+Id;
                    axios({
                        method: 'GET',
                        url: messageErrorLogId,
                        responseType: 'text',
                        headers:header
                    })
                    .then(function (response) {
                        if( response.data ){
                            self.errorLogInfo.push({'Error':response.data});
                        }
                    })
                    .catch(function ( error ) {
                        swal({
                            title: "UnSuccessfull2",
                            text: error.data,
                            icon: "error",
                            dangerMode: false
                        });
                    });
                    
                }

            })
            .catch(function (error) {
                swal({
                    title: "UnSuccessfull11",
                    text: error.data,
                    icon: "error",
                    dangerMode: false
                });
            });
        }
        self.isLoading = false;
      }
  },
  created:function(){

    var d = new Date();  // Gets the current time
    var now = Math.floor(d.getTime()/1000); 
    var datenow = new Date(now * 1000 ); 
    var last = Math.floor(d.getTime()/1000) - 3600;
    var datelast = new Date( last * 1000 );
    var formatted_date_now = datenow.getFullYear() + "-" + this.appendLeadingZeroes(datenow.getMonth() + 1) + "-" + this.appendLeadingZeroes(datenow.getDate()) + "T" + this.appendLeadingZeroes(datenow.getHours()) + ":" + this.appendLeadingZeroes(datenow.getMinutes()) + ":" + this.appendLeadingZeroes(datenow.getSeconds())
    var formatted_date_lasthour = datelast.getFullYear() + "-" + this.appendLeadingZeroes(datelast.getMonth() + 1) + "-" + this.appendLeadingZeroes(datelast.getDate()) + "T" + this.appendLeadingZeroes(datelast.getHours()) + ":" + this.appendLeadingZeroes(datelast.getMinutes()) + ":" + this.appendLeadingZeroes(datelast.getSeconds())
    
    //We'll get the date for 1 hour
    var Datefilter = "$filter=LogEnd gt datetime'"+formatted_date_lasthour+"' and LogEnd le datetime'"+formatted_date_now+"'";
    this.getDataRecursively( 0 , Datefilter);
    

  }
});
</script>

<style>
    .deneme{
        background-color: black !important;
        min-height: 100px;
        min-width: 50px;
        padding:5px;
    }

     h2 {
        margin: 2em 0em;
    }
    .clear{
        float:none;
        display: block;
        min-width: 100%;
        min-height: 50px;
        background-color:maroon;


    }
    .mainbody{
        float:none;
        display: block;
        min-width: 100%;
        min-height: 50px;
    }
    .column{
        min-width: 50%;
    }
    .ui.text.container {
        font-family: Lato,'Helvetica Neue',Arial,Helvetica,sans-serif;
        line-height: 1.5;
        min-width: 90% !important;
    }
    .column
    {
        float: left;
        padding:5px;
    }
    .integration{
        min-height: 100px;
    }
    .Failed{
        color:red;
    }

    .ui.table td {
        padding: .8em .8em;
        text-align: inherit;
        font-size: .94em;
    }

    .ui.celled.table tr td, .ui.celled.table tr th {
        border-left: 1px solid rgba(34,36,38,.1);
        font-size: .94em;
    }
</style>



