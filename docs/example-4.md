
### Example 4: Remote object sends 2 values one to search or show in search box and one to actually select

This will show the `showValue` as it does auto complete when user selects the value set will be `actualValue` 
both in the search box of auto complete and remote object capturing the `value field`
   
```javascript
   [
     {crazyId:'something1',actualValue:'aaa1', showValue:'something1'}, 
     {crazyId:'something2',actualValue:'aaa2', showValue:'something2'}, 
     {crazyId:'something3', actualValue:'aaa2',showValue:'something3'} 
    ]
```

```html
  <autocomplete
    v-model="currentObject.myObject"
    name="mySavedName" 
    clazz="some-css-class1 some-css-class-2"
    :placeholder="$t('select_something')"

    :validationErrors="validationErrors"
    :validation="'required'"

    :items="myRemoteList" 
    @key-press="updateItems"
    :selected="currentObject.myObject"

    remote-key="crazyId" 
    remote-value="actualValue" 
    remote-value-select="showValue"

    key-field="mySavedId" 
    value-field="mySavedName"
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
            currentObject:{
                            id:'someId', 
                            myObject:{
                                mySavedId:'xxx', 
                                mySavedName:'aaa'
                            }, 
                            description:'xys'
                          }
        }
    },
    components: { 
        'autocomplete':VueAutocompletion 
    },
    methods: {
        updateItems: function (searchValue) {
            if (searchValue.length>=3) {
                var variables = $.param({search:searchValue});
                variables+="&max=40&offset=0";
                MyService.fetch('/objectListing/search?'+params)
               .then((res) => {
                   if (res && res.data) {
                       this.myRemoteObjectsList = res.data;
                       // Should return json array something like this
                       /**
                          [
                          {crazyId:'something1',actualValue:'aaa1', showValue:'something1'},
                          {crazyId:'something2',actualValue:'aaa2', showValue:'something2'},
                          {crazyId:'something3', actualValue:'aaa2',showValue:'something3'}
                          ]
                       */
                   }
               });
            }
        }
    }
}
</script>
```
