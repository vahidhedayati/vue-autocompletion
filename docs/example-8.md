
### Example 6 : `v-model` directive not defined `@search-value` `@search-key` used instead



#### 4. Vue Auto completion update many items :additionalProperties with objectName

v-model will always model from where it is currently can't really step backwards in object model.
So therefore if objectName is given it must be hanging off the current v-model object name

When you click X every sub compontent in additionalProperties is also cleared
```

<vue-autocompletion-valid  v-model="currentEdit5"
    @key-press="updateAutoCompleteItems"
    name="vehicleName"
    validation='required|max:50'
    :validationErrors="validationErrors"
     @search-key="componentKey++"
    placeholder="aaa"
    :overrideClearFunction="true"
    :selected="currentEdit5"
    key-field="id" value-field="vehicleName" remote-value="name"
    :additionalProperties="[{keyField:'chassis', remoteKey:'chassisNumber'},
  {objectName:'country', keyField:'id', remoteKey:'countryId', valueField:'name', remoteValue:'countryName'},
   {keyField:'colour'}, {keyField:'steering'}]"
    :items="vehicles3" />


Current Vehicle currentEdit5 is {{currentEdit5}}
<br><br>
```

#### 4.1 Vue Auto completion update many items :additionalProperties with objectName as seconday auto complete

v-model will always model from where it is currently can't really step backwards in object model.
So therefore if objectName is given it must be hanging off the current v-model object name

When you click X every sub compontent in additionalProperties is also cleared
```
<vue-autocompletion-valid
    :key="componentKey" 
    v-model="currentEdit5.country"
    @key-press="updateAutoCompleteItems"
    name="name"
    validation='required|max:50'
    :validationErrors="validationErrors"
    placeholder="aaa"
    :overrideClearFunction="true"
    :selected="currentEdit5.country"
    :items="vehicles3" />

Current Vehicle currentEdit5.country is {{currentEdit5.country}}
<br><br>

```

#### 5. Vue Auto completion update many items :additionalProperties with no objectName (flat}
When you click X every sub compontent in additionalProperties is also cleared
```
          <vue-autocompletion-valid v-model="currentEdit6"
                                    @key-press="updateAutoCompleteItems"
                                    name="vehicleName"
                                    validation='required|max:50'
                                    :validationErrors="validationErrors"
                                    placeholder="aaa"
                                    :overrideClearFunction="true"
                                    :selected="currentEdit6"
                                    key-field="id" value-field="vehicleName" remote-value="name"
                                    :additionalProperties="[{keyField:'chassis', remoteKey:'chassisNumber'},
                                  {keyField:'countryId', valueField:'countryName'},
                                   {keyField:'colour'}]"
                                    :items="vehicles3" />

          Current Vehicle currentEdit6 is {{currentEdit6}}
          <br><br>
```       

```javascript
<script>
   import {VueAutocompletionValid} from 'vue-autocompletion'
export default {
    
    data: function () {
        return {
            componentKey:0,
            myRemoteObjectsList:[],
            vehicles3:[ {id:'a',name:'vehicle 01', colour:'red', chassisNumber:'x1', steering:'Power', countryId:'1', countryName:'France'},
               {id:'a0', name:'zyz vehicle 01',colour:'blue', chassisNumber:'x2', steering:'Manual', countryId:'2', countryName:'Italy'},
               {id:'a1', name:'abc vehicle 02',colour:'green', chassisNumber:'x3', steering:'Power Steering', countryId:'3', countryName:'Denmark'},
               {id:'a2', name:'vehicle 03',colour:'orange', chassisNumber:'x4', steering:'Manual', countryId:'4', countryName:'Poland'},
               {id:'a3', name:'vehicle 03',colour:'black', chassisNumber:'x5', steering:'Power Steering', countryId:'4', countryName:'Germany'}],
           
           currentEdit5: {id:'a',  vehicleName:'vehicle 01',country:{id:'1', name:'France'}, colour:'red', chassisNumber:'x1', steering:'Power',  someOtherProperty:''},
           currentEdit6: {id:'a',  vehicleName:'vehicle 01',colour:'red', chassisNumber:'x1', steering:'Power', countryId:'1', countryName:'France', someOtherProperty:''},

        }
    },
    components: { 
       VueAutocompletionValid,
    },
    methods: {
        updateAutoComplete: function (searchValue) {
            if (searchValue.length>=3) {
                var variables = $.param({search:searchValue});
                variables+="&max=40&offset=0";
                MyService.fetch('/objectListing/search?'+params)
               .then((res) => {
                   if (res && res.data) {
                       this.myRemoteObjectsList = res.data;
                       // Should return json array something like this
                       // [
                       //  {id:'something1', name:'something1', description:'some description 1'}, 
                       //  {id:'something2', name:'something2',description:'some description 1'}, 
                       //  {id:'something3', name:'something3',description:'some description 1'} 
                       // ]
                   }
               });
            }
        },

        updateCurrentValue:function(value) {
          /*
          * This example object sits locally and v-model will work - sometimes object comes from parents of this
          * you can emit this back to parent page if required
          */ 

          this.currentObject.name=value
        },
        updateCurrentKey:function(value) {
/*
          * This example object sits locally and v-model will work - sometimes object comes from parents of this
          * you can emit this back to parent page if required
          */
          this.currentObject.id=value
        }
    }
}
</script>
```