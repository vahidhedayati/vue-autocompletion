
### Example 7 : Multiple dynamic select box with add remove function : Demo of method-used 
    

```html
 <h2>If you remove all entries leaving first blank - upon entering a vehicle on first it will automatically trigger new row using <span class="label label-danger">@key-press</span></h2>
        <h3>On any other row <span class="label label-danger">@method-used</span>  to decide on what method user selected vehicle
          >   if you use tabs + enter to choose vehicle use tab to get a new row
          > if you use mouse to choose vehicle click the plus button
          - this logic is decided by 2 sets of + button depending on <span class="label label-danger">selectionMethod</span> which is updated via
          <span class="label label-danger">@method-used</span>
        </h3>
        <h4 class="label label-primary">@focus for keyboard -
          {by pressing tab on keyboard a new row is created}</h4>
        <h4  class="label label-primary">@click for mouse action
          {you now need to click the plus button }</h4>

        <h1>SelectionMethod: <span class="label label-danger">{{selectionMethod}}</span>
          <span v-if="selectionMethod==='keyboard'">
            <span class="label label-success">Now press tab to get a new row</span>
          </span>
          <span v-if="selectionMethod==='mouse'">
            <span class="label label-warning">Now click
               <font-awesome-icon icon="plus-circle" :style="{ color: 'green', cursor:'pointer'}"  />
              button below for a new row</span>
          </span>

        </h1>

        <div  v-for="(vehicle, index) in editObject.vehicles"  >

          <div    class="form-group form-row   ">
            <div v-if="index==0"  class="col-sm-4 pad-left  ">
              <!-- first entry uses addRow to adda new Row -- you need to remove others - to test first entry -->
              <auto-complete v-model="editObject.vehicles[index]"
                             :name="'vehicleName'+index"
                             validation='required'
                             @search-key="addRow"
                             @search-value="setValue(index)"
                             @key-press="updateAutoCompleteItems"
                             :validationErrors="validationErrors"
                             placeholder="select vehicle"
                             :selected="editObject.vehicles[index]"

                             :valueField="'vehicleName'+index"
                             remoteValue="vehicleName"
                             :items="vehicles"
              />



            </div>
            <div v-else  class="col-sm-4  pad-left  " >

              <!-- others use method-used and + button  -->
              <auto-complete v-model="editObject.vehicles[index]"
                             :name="'vehicleName'+index"
                             @key-press="updateAutoCompleteItems"
                             placeholder="select vehicle"
                             :selected="editObject.vehicles[index]"
                             :valueField="'vehicleName'+index"

                             @search-value="setValue(index)"
                             @method-used="methodUsed"
                             remoteValue="vehicleName"
                             :items="vehicles"
              />
            </div>

            <div class="col-sm-1  adjust-icon " v-if="index!=editObject.vehicles.length-1">
              <font-awesome-icon icon="minus-circle" :style="{ color: 'red' , cursor:'pointer'}" v-on:click="removeElement(editObject.vehicles[index])"  />
            </div>

            <div class="col-sm-1 adjust-icon inline" v-if="index==editObject.vehicles.length-1 && index < 10 &&
            editObject.vehicles[editObject.vehicles.length-1]['vehicleName'+(index)]!='' ">
              <font-awesome-icon icon="plus-circle" :style="{ color: 'green', cursor:'pointer'}"  v-if="selectionMethod=='keyboard'" @focus="addRow"/>
              <font-awesome-icon icon="plus-circle" :style="{ color: 'green', cursor:'pointer'}"  v-else @click="addRow"/>
            </div>

          </div>
          <div style="clear:both"></div>
        </div>
```

```javascript
<script>
    import {VueAutocompletionValid} from 'vue-autocompletion'
    import VueFieldSelect from 'vue-field-select'
    import {VueFieldSelectValid} from 'vue-field-select'
    export default {
        name: 'Welcome',
        $_veeValidate: {
            validator: 'new'
        },
        created:function() {
            //Add a blank entry to get a new row - assuming it has data if not assigned either 1 or multiple blanks
            this.editObject.vehicles.push({id:'',vehicleName:''})
            //Assign a new name which holds the actual value of vehicleName so vehicleName0 vehicleName1 and so on
            //unique names per entry
            this.editObject.vehicles.forEach(function(vehicle,index) {
                vehicle['vehicleName'+index]=vehicle.vehicleName
            })

        },
        data () {
            return {

                selectionMethod:'',

                validationErrors:[],

                editObject:{id:'',name:'', vehicles:[{id:'01',vehicleName:'vehicle 00'},{id:'01', vehicleName:'vehicle 01'}]},

                vehicles:[{id:'01',vehicleName:'vehicle 00'},{id:'02', vehicleName:'vehicle 01'},
                    {id:'03', vehicleName:'vehicle 02'},{id:'04', vehicleName:'vehicle 03'},{id:'04', vehicleName:'vehicle 04'},
                    {id:'05', vehicleName:'vehicle 05'},{id:'06', vehicleName:'vehicle 06'},
                    {id:'07', vehicleName:'vehicle 07'},{id:'08', vehicleName:'vehicle 08'},{id:'09', vehicleName:'vehicle 09'},
                    {id:'10', vehicleName:'vehicle 10'},
                ],


            }
        },
        components: {
            'auto-complete':VueAutocompletionValid,
        },
        methods: {
            setValue:function(index) {
                var f = this.editObject.vehicles[index]
                f.vehicleName=f['vehicleName'+index]
            },
            methodUsed: function (value) {
                this.selectionMethod=value
            },
            updateAutoCompleteItems: function (searchValue) {
                // this.vehicles=[{id:'a',vehicleName:'alpha car'},{id:'a0', name:'zyz vehic 01'},{id:'a1', name:'abc vehicle aa02'},{id:'a2', name:'vehicle03'},{id:'a3', name:'vehicle03'}]

            },

            addRow: function() {
                var j = this.editObject.vehicles.length
                this.editObject.vehicles.push({
                    id:  ''
                });
                var a = this.editObject.vehicles[j]
                a['vehicleName'+j]=''
            },
            /**
             * need to move the items naming convention with item removal if item name1 was removed what was name2
             * now needs to become name1 for iteration of auto completes to work correctly
             * @param c
             */
            removeElement: function(c) {
                var ix=this.editObject.vehicles.findIndex(f=> f.id===c.id)
                var fl=this.editObject.vehicles.length

                this.editObject.vehicles=this.editObject.vehicles.filter(function(value, index, arr){
                    return value.id !=c.id;
                });
                this.editObject.vehicles.forEach(function (f,index) {
                    if (index>=ix) {
                        f['vehicleName'+index]=(f.vehicleName?f.vehicleName:'')
                        delete f['vehicleName'+(index+1)]
                    }
                })
            },
        },

    }
</script>

```