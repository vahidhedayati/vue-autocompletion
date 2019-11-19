<template>
  <span class="autocomplete ">
    <input type="search" :name="name" @input="onChange" v-validate="validation" :autocomplete="name"
           v-model="search" :placeholder="placeholder" @keydown.down="onArrowDown" @change="confirmValue(search)"
           @keydown.tab="onTab" @keydown.up="onArrowUp" @keydown.enter="onEnter" @blur="confirmBlur" @focus="confirmFocus"
           class="form-control"
           :class="[clazz,errorClazz]"
    />
    <div v-show="errors.has(name)" class="col-sm-12 alert alert-danger">{{ errors.first(name)}}</div>
    <ul id="autocomplete-results" v-show="isOpen" class="autocomplete-results  form-control">
      <li class="loading" v-if="isLoading">
        Loading results...
      </li>
      <li v-else v-for="(result, i) in results" :key="i" @click="setResult(result)" class="autocomplete-items"
          :class="{ 'is-active': i === arrowCounter }">
        <div v-if="result.hasOwnProperty(remotePrimaryValue)">
        {{ result[remotePrimaryValue] }}
        </div>
        <div v-else>
          {{ result[currentValue] }}
        </div>
      </li>
    </ul>
    <input type="hidden" v-validate="validation && validation.toString().includes('required') ? 'required' : ''"  name="hiddenId" v-model="hiddenId"/>
  </span>
</template>
<script>
  export default {
    name: 'vue-autocompletion',
    inject: ["$validator"],
    props: {
      keyField: {
        type: String,
        default: 'id'
      },
      valueField: {
        type: String,
        default: 'name'
      },
      remoteKey: {
        type: String,
        default: ''
      },
      remoteValue: {
        type: String,
        default: ''
      },
      remotePrimaryValue: {
        type: String,
        default:'',
      },
      remoteValueSelect: {
        type: String,
        default:''
      },
      clazz: {
        type: String,
        default:""
      },
      returnPromise:{
        type: Boolean,
        required: false,
        default: false
      },
      validationErrors: { type:Array,
        default: function () { return [] }
      },
      placeholder:{
        type: String,
        default: 'name'
      },
      validation: {
        type: String,
        default:""
      },
      selected: {
        type: Object,
        default: {}
      },
      name: {
        type: String,
        default:'search'
      },
      searchLength:{
        type: Number,
        required: false,
        default: 3
      },
      items: {
        type: Array,
        required: false,
        default: () => [],
      },
      isAsync: {
        type: Boolean,
        required: false,
        default: false,
      },
    },
    computed: {
      primaryValue() {
        if (this.remotePrimaryValue) {
          return this.remotePrimaryValue
        } else {
          return (this.remoteValue ? this.remoteValue : this.valueField)
        }
      },
      currentValue() {
        return (this.remoteValue ? this.remoteValue : this.valueField)
      },
      currentKey() {
        return (this.remoteKey ? this.remoteKey : this.keyField)
      },
      errorClazz() {
        return ((this.errors.has(this.name)|| this.validationErrors.includes(this.name)) ? 'is-invalid' : '')
      }

    },

    data() {
      return {
        isOpen: false,
        results: [],
        search: '',
        found:'',
        hiddenId:'',
        isLoading: false,
        resultSet:false,
        arrowCounter: 0,
        lastSearch:'',
        searchChanged:false,
        currentSelected:''
      };
    },
    methods: {
      onChange() {
        this.searchChanged=true
        if (this.currentSelected[this.valueField]!='' || this.currentSelected[this.keyField]!=''){
          var aa = this.selected
          aa[this.valueField] =''
          aa[this.keyField] = ''
          this.currentSelected=aa

          this.$emit('input', aa)
        }
        if (this.search.length>=this.searchLength) {
          this.$emit('key-press', this.search);
          if (this.isAsync) {
            this.isLoading = true;
          } else {
            this.filterResults();
            this.isOpen = true;
          }
        }
      },
      filterResults() {
        this.results = this.items.filter((item) => {
          if (this.remotePrimaryValue && item.hasOwnProperty(this.remotePrimaryValue)){
            return item[this.remotePrimaryValue].toLowerCase().indexOf(this.search.toLowerCase()) > -1;
          } else {
            return item[this.currentValue].toLowerCase().indexOf(this.search.toLowerCase()) > -1;
          }

        });
      },
      setResult(result) {
        this.resultSet=true
        if (this.returnPromise) {
          this.$emit('return-promise', result)
          var key =this.currentValue
          if (this.remotePrimaryValue) {
            key = result.hasOwnProperty(this.remotePrimaryValue) ? this.remotePrimaryValue : this.currentValue
          }
          if (this.remoteValueSelect && result.hasOwnProperty(this.remoteValueSelect)) {
            key = this.remoteValueSelect
          }
          this.found = result[key];
          if (this.found.length > 0) {
            this.search = this.found;
            this.hiddenId = result[this.currentKey];
          }
          this.isOpen = false;
        } else {
          var key =this.currentValue
          if (this.remotePrimaryValue) {
            key = result.hasOwnProperty(this.remotePrimaryValue) ? this.remotePrimaryValue :this.currentValue
          }
          if (this.remoteValueSelect && result.hasOwnProperty(this.remoteValueSelect)) {
            key = this.remoteValueSelect
          }
          this.found = result[key];
          if (this.found.length > 0) {
            this.search = this.found;
            this.hiddenId = result[this.currentKey];

            var aa = this.selected
            aa[this.valueField] = this.search
            aa[this.keyField] = this.hiddenId
            this.$emit('input', aa)

            this.$emit('search-value', this.search);
            this.$emit('search-key', this.hiddenId);
            this.isOpen = false;
          } else {
            var aa = this.selected
            aa[this.valueField] =''
            aa[this.keyField] = ''
            this.$emit('input', aa)

            this.$emit('search-value', '');
            this.$emit('search-key', '');
            this.isOpen = false;
          }
        }

      },
      confirmFocus(evt) {
        this.resultSet=false
      },
      /*
      * race condition - need to ensure user selected auto complete
      * appears to work and is triggered when open auto complete closes so as expected
      */
      confirmBlur(evt) {
        setTimeout(function () {
          if (this.found!=this.search && this.searchChanged) {
            this.search=''
            this.hiddenId = ''
          }
        }.bind(this), 180)
      },

      confirmValue(evt) {
        const processSearch=true
        setTimeout(function () {
          if (!this.resultSet) {
            for (var i = 0; i <  this.results.length; i++) {
              if ((this.results[i]).hasOwnProperty(this.remotePrimaryValue)){
                if ((this.results[i])[this.remotePrimaryValue].toLowerCase()===this.search.toLowerCase()) {
                  this.isOpen = false;
                  this.processSearch=false
                  this.setResult(this.results[i])
                }
              } else {
                if ((this.results[i])[this.currentValue].toLowerCase()===this.search.toLowerCase()) {
                  this.isOpen = false;
                  this.processSearch=false
                  this.setResult(this.results[i])
                }
              }

            }
            if (this.processSearch && (this.found.length===0||this.found.length>0 && this.search != this.result )) {
              this.search=''
              this.found=''
            }
          }
        }.bind(this), 180)
      },

      onTab(evt) {
        if (this.isOpen) {
          if (this.results.length > 0) {
            var ix = 0;
            if (this.arrowCounter > -1) {
              ix = this.arrowCounter; // pick arrow selection otherwise first item
            }
            this.setResult(this.results[ix]);
          }
          this.isOpen = false;
          this.processSearch = false;
          this.arrowCounter = -1;
        }
      },
      isFull: function() {
        return this.found.length>0
      },
      onArrowDown(evt) {
        if (this.arrowCounter < this.results.length) {
          this.arrowCounter = this.arrowCounter + 1;
        }
      },
      onArrowUp() {
        if (this.arrowCounter > 0) {
          this.arrowCounter = this.arrowCounter -1;
        }
      },
      onEnter() {
        this.setResult(this.results[this.arrowCounter]);
        this.isOpen = false;
        this.arrowCounter = -1;
      },
      handleClickOutside(evt) {
        if (!this.$el.contains(evt.target)) {
          this.isOpen = false;
          this.arrowCounter = -1;
        }
      }
    },
    watch: {
      selected: function (val, oldValue) {
        if (val[this.valueField]!=oldValue[this.valueField]) {
          this.search=val[this.valueField]
          this.hiddenId=val[this.keyField]
          this.lastSearch= this.search;
        }
      },
      items: function (val, oldValue) {
        if (val.length !== oldValue.length) {
          this.results = val;
          this.isLoading = false;
        }
      }
    },
    created () {
      this.currentSelected=this.selected
      if (this.selected && this.selected[this.valueField] && this.selected[this.keyField] ) {
        this.search=this.selected[this.valueField]
        this.hiddenId=this.selected[this.keyField]
        this.lastSearch= this.search;
      }
    },
    mounted() {
      document.addEventListener('click', this.handleClickOutside)
      if (this.selected && this.selected[this.valueField] && this.selected[this.keyField]) {
        this.search=this.selected[this.valueField]
        this.hiddenId=this.selected[this.keyField]
        this.lastSearch= this.search;
      }
    },
    destroyed() {
      document.removeEventListener('click', this.handleClickOutside)
    }
  };
</script>
<style>
  .autocomplete {
    position: relative;

  }
  .autocomplete-results {
    padding: 0;
    margin: 0;
    border: 1px solid #eeeeee;
    height: 120px !important;
    overflow: auto;
    width: 100%;
    position: relative;
    display: inline-block;
    z-index:2001;
  }
  .autocomplete-result {
    list-style: none;
    text-align: left;
    padding: 4px 2px;
    cursor: pointer;
  }
  .autocomplete-result.is-active,
  .autocomplete-result:hover {
    background-color: #4AAE9B;
    color: white;
  }

  .autocomplete-items {
    border-bottom: none;
    border-top: none;
    z-index: 99;
    top: 100%;
    left: 0;
    list-style: none;
    text-align: left;
    right: 0;
  }
  .autocomplete-items div {
    padding-left: 10px;
    cursor: pointer;
  }
  .autocomplete-items div:hover {
    background-color: #4AAE9B;
    color: white;
  }
  .autocomplete-active {
    background-color: DodgerBlue !important;
    color: #ffffff;
  }
  .is-active {
    font-weight: bold;
  }
</style>
