## Changelog
#### v.1.1.10
- Tidy up of stuff so far stuff added in 1.1.9 not needed, fix or documentation on how to use multiple selection works - 
#### v.1.1.9
-  working but multiple auto complete isn't clearing 2nd etc.
#### v.1.1.8
- Has issues not to be used - will not auto complete
#### v.1.1.7
- clear function in input search emit or overwrite v-model now only to run if:
  overrideClearFunction is set to true default fallse
- additionalProperties array added as part of input to clean up multimple items and set multiple items in one go.
```
:additionalProperties="[{valueField:'countryName', remoteValue:'countryName', keyField:'countryCode', remoteKey:'countryCode'},
                                              {valueField:'state'},
                                              {keyField:'countryId', remoteKey:'countryCode' }]"
```
#### v.1.1.6
- clear function in input search emit or overwrite v-model 
- css style added to show x for clear options
- jquery dependency added to allow the new functionality to work  
#### v.1.1.5
- `id` `ref` tags added to autocomplete will be set to what ever you set `name` as .
- new `Event` `method-used` returned - please review example-7 
- there was an issue with pre-loading existing data the created mounted functions did not work single mounted added

#### v.1.1.4
- Props `readonly` and `disabled` defaulted to false added


#### v.1.1.3
- css style changes - mouse hover and using arrow keys to navigate selectable items show same hovering effect

#### v.1.1.2
- on return using tabs no longer attempts to submit form - `e.preventDefault()` added

#### v.1.1.1

- `VueAutocompletionLogic.js` added - centralising all the default properties for: 
  * `VueAutocompletion.vue`
  * `VueAutocompletionValid.vue`
- `VuAutocompletionValid` renamed to `VueAutocompletionValid` "e" was missing  
  
 
#### v.1.1.0
- vee-validation feature added - two different ways of calling plugin as outlined on 
**Example 1** & **Example 2 Validation**
- webpack3 upgraded to webpack4 within plugin - `webpack.config.js` updated all working 
 

#### v.1.0.10
- Official release has no validation capacity
 
#### v.1.0.9
-  list scrolling added when using tabs and keys to go down list

#### v.1.0.8
-  First working revision
