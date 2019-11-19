# Vue Autocompletion
[![npm (scoped)](https://img.shields.io/npm/v/@vahidh/vue-autocompletion.svg?style=flat-square)](https://www.npmjs.com/package/@vahidh/vue-autocompletion)
[![npm](https://img.shields.io/npm/dm/@vahidh/vue-autocompletion.svg?style=flat-square)](https://www.npmjs.com/package/@vahidh/vue-autocompletion)
[![MIT](https://img.shields.io/github/license/vahidhedayati/vue-autocompletion.svg?style=flat-square)](https://opensource.org/licenses/MIT)


## Installation via NPM

## First
Install via NPM 
```
npm i @vahidh/vue-autocompletion --save-dev
```
or
```
npm i @vahidh/vue-autocompletion --save
```
## Second
Require in your project:
```
var VueAutocompletion = require('vue-autocompletion');
```
or ES6 syntax:
```js
import VueAutocompletion from 'vue-autocompletion'
```

# Third
You can register the component globally:
```
Vue.component('autocomplete', VueAutocompletion);
```
Or locally in a single Vue component:
```
 components: { 'autocomplete':VueAutocompletion },
```

#### All Available Props

Prop | Type | Default | Description
--- | --- | --- | ---
keyField | String | id | id for the hidden input / your expected object key i.e. id:xxx
valueField | String | name | the value that is set for your expected object value  i.e. name:xxx
remoteKey | String | *keyField | the value that is set for your expected object key  i.e. {id:xxx}
remoteValue| String | *valueField | the value that is set for your expected object value  i.e. {name:xxx}
remotePrimaryValue| String | - | if defined it will look for this as highest choice in search from remote. Difficult to explain but remote data may be dynamic and sometimes may include cityName other times countryName so remoteKey would be preferred in this instance cityName if not found then it will fall back to remoteValue which be countryName as other choice
remoteValueSelect| String | - | the actual value to select if remoteValue is shown as selectable item {what appears after selection} is also set as expected object value 
clazz| String | - | css classes to load if additional css styling needed
returnPromise| Boolean | false | return entire object - this is for more complex objects that have many other things you need to do with returned data
validationErrors| Array | [] | returns any vee-validate validation issues back to caller 
placeholder| String | name | the value that is set for a blank auto complete box
validation| String | - | the validation types required i.e. 'required|xx'
selected| Object | {} | The actual selected object when user chooses one of drop down - emited back to parent call overwriting parent key/value fields
name| String | - |The name of select field must match object name that is being saved for validation to work or valueField name
searchLength|Number| 3| Amount of characters before triggering dropdown
items | Array | [] | parent's array of selectable objects - can be fixed or db driven - key presses by user trigger list to update
isAsync| Boolean | false | unused feature came with original guide 



#### Events
Event | Description
--- | ---
@key-press | Fired when the input text changes 
@search-value| Not requied but if set allows you to manipulate locally from set selected value field
@search-key| Not requied but if set allows you to manipulate locally from set selected key field
@return-promise| Not requied but if set won't manipulate parent object instead return the full object from remote selection back to you, this contains the entire object selected. It may have many other values you need to update page with.

## Usage

### Most basic Example
Where the remote key / value pair match the object locally to be set. 
In this example the plugin itself will update on parent page `currentObject:{id:'selectedId',name:'selectedName',...}` after user selects something
```html
  <autocomplete  
        v-model="currentObject"
        name="myObjectName"
        @key-press="updateAutoComplete"
        :selected="currentObject.myObjectName"
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
```


### Example 2: Remote object sometimes has additional data which should be selected 


 
Remote lookup may or may not return an additional field:
 remote data would look like 
```javascript
   [
     {id:'something1', name:'something1'}, 
     {id:'something2', name:'something2'}, 
     {id:'something3', name:'something3'} 
    ]

```
 

```html
  <autocomplete
    v-model="currentObject.myObject"
    name="myObjectName" 
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
```


```html


    :returnPromise="true"
    @return-promise="returnPromise"


```
## Data

## Changelog

#### v.1.0.2
- Full documentation added
#### v.1.0.1
- Minor changes
#### v.1.0.0
- Initial release


##Credits
### [Filipa Lacerda](https://alligator.io/vuejs/vue-autocomplete-component/)
This code orginated from this posting, I tried to find github source of this, but then found it reused everywhere.
I had a look at some of the existing auto complete plugins and at the time building from scratch felt most suited to 
dynamics of it's requirements.
Original did most bust needed additional logic to make it work even more dynamically extensively.
One of the main issues I found when testing existing auto completes was when an invalid entry is entered the entry 
persists on input area and there are 2 specific setTimeouts within the js file to try capture real outcome after a 
race condition.
 
