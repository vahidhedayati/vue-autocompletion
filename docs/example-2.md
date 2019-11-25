Please refer to [demo project](https://github.com/vahidhedayati/vue-autocompletion-test), there are 2 classes loaded `Welcome` and `Welcome2`.
The project has `"vee-validate": "^2.2.13"` enabled in `package.json`. Has also been tested on a project not running `vee-validate`
 to ensure it works on a plain vuejs project.

In `src/main.js` Following has been added 
```javascript
import VeeValidate from 'vee-validate';
Vue.use(VeeValidate, { inject: false });
```    

Finally in `Welcome.vue`:
```html
Auto Complete Should appear next to this
          <vue-autocompletion-valid v-model="vehicle"
            @key-press="updateAutoCompleteItems"
            name="vehicleName"
            validation='required|max:50'
            :validationErrors="validationErrors"
            placeholder="aaa"
            :selected="vehicle"
            key-field="id" value-field="vehicleName"
            :items="vehicles" />

        </p>
        Current Vehicle is {{vehicle}}
<script> 
import {VueAutocompletionValid} from 'vue-autocompletion'
export default {
    name: 'Welcome',
    $_veeValidate: {
        validator: 'new'
    },
    data () {
        return {
            msg: 'Welcome',
            serverInfo: null,
            validationErrors:[],
            showLinks: false,
            vehicle:{id:'',name:''},
            serverURL: process.env.SERVER_URL,
            vehicles:[{id:'a',vehicleName:'vehicle 01'},{id:'a0', vehicleName:'zyz vehice 01'},
                {id:'a1', vehicleName:'abc vehicle 02'},{id:'a2', vehicleName:'vehicle 03'},{id:'a3', vehicleName:'vehicle 03'},
                {id:'a4', vehicleName:'abc vehicle 04'},{id:'a5', vehicleName:'vehicle 05'},{id:'a6', vehicleName:'vehicle 06'},
                {id:'a7', vehicleName:'abc vehicle 07'},{id:'a8', vehicleName:'vehicle 08'},{id:'a9', vehicleName:'vehicle 09'}
            ]
        }
    },
    components: {
        VueAutocompletionValid
    },
    methods: {
        updateAutoCompleteItems: function (searchValue) {
           // this.vehicles=[{id:'a',vehicleName:'alpha car'},{id:'a0', name:'zyz vehic 01'},{id:'a1', name:'abc vehicle aa02'},{id:'a2', name:'vehicle03'},{id:'a3', name:'vehicle03'}]
        },
    },
    created: function () {
    }
}
</script>

```
