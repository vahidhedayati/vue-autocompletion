# Vue Autocompletion
[![npm (scoped)](https://img.shields.io/npm/v/vue-autocompletion.svg?style=flat-square)](https://www.npmjs.com/package/vue-autocompletion)
[![npm](https://img.shields.io/npm/dm/vue-autocompletion.svg?style=flat-square)](https://www.npmjs.com/package/vue-autocompletion)
[![MIT](https://img.shields.io/github/license/vahidhedayati/vue-autocompletion.svg?style=flat-square)](https://opensource.org/licenses/MIT)

## Installation via NPM

## First
Install via NPM 
```
npm i vue-autocompletion --save-dev
```
or
```
npm i  vue-autocompletion --save
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

#### All Available Props for vue-autocompletion

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
placeholder| String | name | the value that is set for a blank auto complete box
selected| Object | {} | The actual selected object when user chooses one of drop down - emited back to parent call overwriting parent key/value fields
name| String | - |The name of select field must match object name that is being saved for validation to work or valueField name
searchLength|Number| 3| Amount of characters before triggering dropdown
items | Array | [] | parent's array of selectable objects - can be fixed or db driven - key presses by user trigger list to update
isAsync| Boolean | false | unused feature came with original guide 
disabled | Boolean | false | set to true to disable selectable area
readonly | Boolean | false | set to true to make area non selectable and readonly
overrideClearFunction| Boolean | false | set to true to override html 5 x that appears in input and use plugins version. This may be needed depending on vue object modelling.
additionalProperties | Array | [] |A list of additional objects to set or clear in one go refer to example 8 `[{valueField:'countryName', remoteValue:'countryName', keyField:'countryCode', remoteKey:'countryCode'}, {objectName:'subObject', keyField:'countryId', remoteKey:'countryCode' }, {valueField:'state'}, {keyField:'countryId', remoteKey:'countryCode' }, ]` 
setTimeOut| Boolean | false | enable setTimeOut not needed for validation call - non validation may be needed
timeOutPeriod|Number| 300|Time out in  milliseconds default should be sufficient  
#### All Available Props for vue-autocompletion-valid (above + below)
Prop | Type | Default | Description
--- | --- | --- | ---
validationErrors| Array | [] | returns any vee-validate validation issues back to caller
validation| String | - | the validation types required i.e. 'required|xx'

#### Events
Event | Description
--- | ---
@key-press | Fired when the input text changes 
@search-value| if `v-model` directive declared then not required but if set allows you to manipulate locally from set selected value field
@search-key| if `v-model` directive declared then not required  but if set allows you to manipulate locally from set selected key field
@return-promise| Not required but if set won't manipulate parent object instead return the full object from remote selection back to you, this contains the entire object selected. It may have many other values you need to update page with.
@method-used|returns a string of mouse or keyboard if they selected auto complete with mouse or keyboard if they used tab up down arrows and enter 

## Usage

##### [Working Demo project (needs to be downloaded run)](https://github.com/vahidhedayati/vue-autocompletion-test)

----

#### [YouTube demo video 1 covers vue-field-select & vue-auto-completion](https://www.youtube.com/watch?v=8gjKhyUlEro&list=PLfZr1vB6p8XKqh3YLgauaqsad-pV6Qsxw)

#### [YouTube Part 2: Covering additionalProperties, multiple auto completes relating to one another ](https://www.youtube.com/watch?v=9EE3PDcPnEA&list=PLfZr1vB6p8XKqh3YLgauaqsad-pV6Qsxw&index=2)

----

##### [Example 1: Basic](https://github.com/vahidhedayati/vue-autocompletion/tree/master/docs/example-1.md) 

##### [Example 2: `vue-autocompletion-valid`: Validation using `vee-validate`](https://github.com/vahidhedayati/vue-autocompletion/tree/master/docs/example-2.md) 

##### [Example 3: Remote object sometimes has additional data which should be selected](https://github.com/vahidhedayati/vue-autocompletion/tree/master/docs/example-3.md) 

##### [Example 4: Remote object sends 2 values one to search or show in search box and one to actually select](https://github.com/vahidhedayati/vue-autocompletion/tree/master/docs/example-4.md)

##### [Example 5: Return promise and deal with selected item manually](https://github.com/vahidhedayati/vue-autocompletion/tree/master/docs/example-5.md)

##### [Example 6: `v-model` directive not defined `@search-value` `@search-key` used instead](https://github.com/vahidhedayati/vue-autocompletion/tree/master/docs/example-6.md)

##### [Example 7: Multiple dynamic select box with add remove function : Demo of method-used](https://github.com/vahidhedayati/vue-autocompletion/tree/master/docs/example-7.md)

##### [Example 8: additionalProperties and auto complete one to auto complete another](https://github.com/vahidhedayati/vue-autocompletion/tree/master/docs/example-8.md)

#### [Changelog](https://github.com/vahidhedayati/vue-autocompletion/tree/master/docs/change-log.md)


## Credits
### [Filipa Lacerda](https://alligator.io/vuejs/vue-autocomplete-component/)
This code originated from above posting, I tried to find the github source for this project but ended up finding it reused everywhere.
I had a look at some of the existing auto complete plugins and at the time building from scratch felt most suited to 
dynamics of it's requirements.
Original version by Filipa did most but I needed additional logic to make it work even more dynamically extensively.
There is a new prop called `setTimeOut` which can be set `true or false`, by default validation call is true, for non validation call,
timeout is not needed but has been left as a feature if an issue is hit whilst clearing or picking options.
This relates to vee-validation which has it's own delay method, timeout used instead 
this is really to try capture real outcome after a race condition.
 
