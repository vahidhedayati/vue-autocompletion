### Example 3: Remote object sometimes has additional data which should be selected 


 
Remote lookup may or may not return an additional field:

Remote data may come back as this - 
when data has `appearsSomething` this becomes `remote-primary-value` and is selected on screen and set on your objet
When data has none the `fallbackValue` which is `remote-value` is set on your screen and set as your object
```javascript
   [
     {myRemoteId:'something1',fallbackValue:'aaa1'},
     {myRemoteId:'something2',fallbackValue:'aaa2', appearsSomeTimes:'something2'},  
     {myRemoteId:'something3',fallbackValue:'aaa3'}, 
     {myRemoteId:'something4',fallbackValue:'aaa4', appearsSomeTimes:'something4'}, 
     {myRemoteId:'something5', fallbackValue:'aaa5',appearsSomeTimes:'something5'}, 
     {myRemoteId:'something6', fallbackValue:'aaa7'} 
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

    remote-key="myRemoteId" 
    remote-value="fallbackValue" 
    remote-primary-value="appearsSomeTimes"

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
                             {myRemoteId:'something1',fallbackValue:'aaa1'},
                             {myRemoteId:'something2',fallbackValue:'aaa2', appearsSomeTimes:'something2'},  
                             {myRemoteId:'something3',fallbackValue:'aaa3'}, 
                             {myRemoteId:'something4',fallbackValue:'aaa4', appearsSomeTimes:'something4'}, 
                             {myRemoteId:'something5', fallbackValue:'aaa5',appearsSomeTimes:'something5'}, 
                             {myRemoteId:'something6', fallbackValue:'aaa7'} 
                         ]
                         *
                         */
                       
                   }
               });
            }
        }
    }
}
</script>
```