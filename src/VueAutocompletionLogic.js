/**
 * Vahid Hedayati 23/11/2019
 *
 * VueAutocompletionLogic centralises all the default properties for:
 *
 * - VueAutocompletion.vue
 * - VueAutocompletionValid.vue
 * ----
 * This now means any future updates for both can be done in this one
 * centralised place. Reducing duplicate changes need in both.
 */
export default {
    loadProps(loadValidation) {
        var p = {
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

                default: '',
            },
            remoteValueSelect: {
                type: String,
                default: ''
            },
            clazz: {
                type: String,
                default: ""
            },
            returnPromise: {
                type: Boolean,
                required: false,
                default: false
            },
            validationErrors: {
                type: Array,
                default: function () {
                    return []
                }
            },
            placeholder: {
                type: String,
                default: 'name'
            },

            selected: {
                type: Object,
                required: true,
                default: function () {
                    return {}
                }
            },
            name: {
                type: String,
                default: 'search'
            },
            searchLength: {
                type: Number,
                required: false,
                default: 3
            },
            items: {
                type: Array,
                required: false,
                default: function () {
                    return []
                }
            },
            isAsync: {
                type: Boolean,
                required: false,
                default: false
            },
            disabled: {
                type: Boolean,
                required: false,
                default: false
            },
            readonly: {
                type: Boolean,
                required: false,
                default: false
            },
        }
        if (loadValidation!=undefined && loadValidation===true) {
            p['validation']= {type: String, required: false, default:""}
            p['validationErrors']={ type:Array, default: function() { return []}}
        }
        return p;
    },
    loadComputed(loadValidation) {
        var p = {
            primaryValue: function () {
                if (this.remotePrimaryValue) {
                    return this.remotePrimaryValue
                } else {
                    return (this.remoteValue ? this.remoteValue : this.valueField)
                }
            },
            currentValue: function () {
                return (this.remoteValue ? this.remoteValue : this.valueField)
            },
            currentKey: function () {
                return (this.remoteKey ? this.remoteKey : this.keyField)
            }
        }
        if (loadValidation!=undefined && loadValidation===true) {
            p['errorClazz'] = function () {
                return ((this.errors && this.errors.has(this.name) || this.validationErrors.includes(this.name)) ? 'is-invalid' : '')
            }
        } else {
            p['errorClazz']= function () {
                return (this.validationErrors.includes(this.name)) ? 'is-invalid' : ''
            }
        }
        return p
    },
    loadMethods() {
        var p = {
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
            setMouseResult:function(result,i) {
                this.$emit('method-used', 'mouse')
                this.setResult(result,i)
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
            onEnter: function(e) {
                this.$emit('method-used', 'keyboard')
                //don't attempt to submit form
                e.preventDefault();
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
        };
        return p;
    },
    loadWatch() {
        return {
            selected: function (val, oldValue) {
                if (val[this.valueField] != oldValue[this.valueField]) {
                    this.search = val[this.valueField]
                    this.hiddenId = val[this.keyField]
                    this.lastSearch = this.search;
                }
            },
            items: function (val, oldValue) {
                if (val.length !== oldValue.length) {
                    this.results = val;
                    this.isLoading = false;
                }
            }
        }
    }
}


