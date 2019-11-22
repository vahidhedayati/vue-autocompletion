<template>
  <span class="autocomplete ">
    <input type="search" :name="name" @input="onChange"  :autocomplete="name"
           v-model="search" :placeholder="placeholder" @keydown.down="onArrowDown" @change="confirmValue(search)"
           @keydown.tab="onTab" @keydown.up="onArrowUp" @keydown.enter="onEnter" @blur="confirmBlur" @focus="confirmFocus"
           class="form-control"
           :class="[clazz,errorClazz]"
    />

    <ul id="autocomplete-results" v-show="isOpen"  ref="autocompleteResults" class="autocomplete-results  form-control">
      <li class="loading" v-if="isLoading">
        Loading results...
      </li>
      <li v-else v-for="(result, i) in results" :key="i"  ref="options"  @click="setResult(result,i)" class="autocomplete-items"
          :class="{ 'is-active': i === arrowCounter }">
        <div v-if="result.hasOwnProperty(remotePrimaryValue)">
        {{ result[remotePrimaryValue] }}
        </div>
        <div v-else>
          {{ result[currentValue] }}
        </div>
      </li>
    </ul>
    <input type="hidden" name="hiddenId" v-model="hiddenId"/>
  </span>
</template>
<script>
    export default {
      name: 'vue-autocompletion',
        props:{
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
            default: function() { return []}
          },
          placeholder:{
            type: String,
            default: 'name'
          },

          selected: {
            type: Object,
            required: true,
            default:  function() { return {}}
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
            default:  function() { return []}
          },
          isAsync: {
            type: Boolean,
            required: false,
            default: false
          }
        },
        computed: {
            primaryValue:function() {
                if (this.remotePrimaryValue) {
                    return this.remotePrimaryValue
                } else {
                    return (this.remoteValue ? this.remoteValue : this.valueField)
                }
            },
            currentValue:function() {
                return (this.remoteValue ? this.remoteValue : this.valueField)
            },
            currentKey:function() {
                return (this.remoteKey ? this.remoteKey : this.keyField)
            },
            errorClazz:function() {
                return (this.validationErrors.includes(this.name)) ? 'is-invalid' : ''
            }

        },

        data:function() {
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
            onChange:function() {
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
            filterResults:function() {
                var rpv = this.remotePrimaryValue
                var sch=this.search
                var cv=this.currentValue
                this.results =
                    this.items.filter(function(item) {
                        if (item && rpv!=undefined && item.hasOwnProperty(rpv)){
                            return item[rpv].toLowerCase().indexOf(sch.toLowerCase()) > -1;
                        } else {
                            return item[cv] && sch && item[cv].toLowerCase().indexOf(sch.toLowerCase()) > -1;
                        }

                    });
            },
            setResult:function(result,i) {
                this.arrowCounter = i;
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
            confirmFocus:function(evt) {
                this.resultSet=false
            },
            /*
            * race condition - need to ensure user selected auto complete
            * appears to work and is triggered when open auto complete closes so as expected
            */
            confirmBlur:function(evt) {
                setTimeout(function () {
                    if (this.found!=this.search && this.searchChanged) {
                        this.search=''
                        this.hiddenId = ''
                    }
                }.bind(this), 180)
            },

            confirmValue:function(evt) {
                var processSearch=true
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

            onTab:function(evt) {
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
            onArrowDown:function (evt) {
                if (this.arrowCounter < this.results.length-1) {
                    this.arrowCounter = this.arrowCounter + 1;
                    this.fixScrolling();
                }
            },
            onArrowUp:function () {
                if (this.arrowCounter > 0) {
                    this.arrowCounter = this.arrowCounter - 1;
                    this.fixScrolling()
                }
            },
            fixScrolling:function (){
                const liH = this.$refs.options[this.arrowCounter].clientHeight;
                this.$refs.autocompleteResults.scrollTop = liH * this.arrowCounter;
            },
            onEnter: function() {
                this.setResult(this.results[this.arrowCounter]);
                this.isOpen = false;
                this.arrowCounter = -1;
            },
            handleClickOutside: function(evt) {
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
        created: function () {
            this.currentSelected=this.selected
            if (this.selected && this.selected[this.valueField] && this.selected[this.keyField] ) {
                this.search=this.selected[this.valueField]
                this.hiddenId=this.selected[this.keyField]
                this.lastSearch= this.search;
            }
        },
        mounted: function() {
            document.addEventListener('click', this.handleClickOutside)
            if (this.selected && this.selected[this.valueField] && this.selected[this.keyField]) {
                this.search=this.selected[this.valueField]
                this.hiddenId=this.selected[this.keyField]
                this.lastSearch= this.search;
            }
        },
        destroyed: function() {
            document.removeEventListener('click', this.handleClickOutside)
        }
    };
</script>
<style src="./vue-autocompletion.css"></style>