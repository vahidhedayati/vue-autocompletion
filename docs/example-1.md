### Example 1: Basic 
Where the remote key / value pair match the object locally to be set. 
In this example the plugin itself will update on parent page 
`currentObject:{id:'selectedId',name:'selectedName',...}` after user selects something
```html
  <autocomplete  
        v-model="currentObject"
        name="myObjectName"
        @key-press="updateAutoComplete"
        :selected="currentObject"
        :placeholder="$t('select_object')"
        key-field="id" value-field="name"
        :items="myRemoteObjectsList" />
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
                       //  {id:'something1', name:'something1'}, 
                       //  {id:'something2', name:'something2'}, 
                       //  {id:'something3', name:'something3'} 
                       // ]
                   }
               });
            }
        }
    }
}
</script>