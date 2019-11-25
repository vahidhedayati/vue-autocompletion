
### Example 6 : `v-model` directive not defined `@search-value` `@search-key` used instead

```html
  <autocomplete  
        name="myObjectName"
        @key-press="updateAutoComplete"
        :selected="currentObject.myObjectName"
        @search-value="updateCurrentValue"
        @search-key="updateCurrentKey"
        :placeholder="$t('select_object')"
        key-field="id" value-field="name"
        :items="myRemoteObjectsList" 
   />
```

```javascript
<script>
import VueAutocompletion from 'vue-autocompletion'
export default {
    
    data: function () {
        return {
            myRemoteObjectsList:[],
            // after auto complete is selected id/name of currentObject should auto update from plugin 
            currentObject:{id:'xxx', name:'aaa', description:'xys', pool:[{id:'xx'},{id:'xy'}]}
        }
    },
    components: { 
        'autocomplete':VueAutocompletion 
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