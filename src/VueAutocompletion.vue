<template>
  <span class="autocomplete ">
    <input type="search" :name="name" :id="name" :ref="name"
           :disabled="disabled"  :readonly="readonly" @input="onChange"
           :autocomplete="name"  @mouseenter="arrowCounter=0"
           v-model="search" :placeholder="placeholder"
           @keydown.down="onArrowDown" @change="confirmValue(search)"
           @keydown.tab="onTab" @keydown.up="onArrowUp"
           @keydown.enter="onEnter" @blur="confirmBlur" @focus="confirmFocus"
           class="form-control"
           :class="[clazz,errorClazz]"
    />

    <ul id="autocomplete-results" v-show="isOpen && !readonly && !disabled"  ref="autocompleteResults" class="autocomplete-results  form-control">
      <li class="loading" v-if="isLoading">
        Loading results...
      </li>
      <li v-else v-for="(result, i) in results" :key="i"  ref="options"  @click="setMouseResult(result,i)" class="autocomplete-items"
          :class="{ 'is-active': i === arrowCounter }">
        {{result.hasOwnProperty(remotePrimaryValue) ?  result[remotePrimaryValue] : result[currentValue]  }}
      </li>
    </ul>
    <input type="hidden" name="hiddenId" v-model="hiddenId"/>
  </span>
</template>
<script>
  import VueAutocompletionLogic from "./VueAutocompletionLogic";
  export default {
    name: 'vue-autocompletion',
    props:VueAutocompletionLogic.loadProps(),
    computed:VueAutocompletionLogic.loadComputed(),
    methods:VueAutocompletionLogic.loadMethods(),
    watch: VueAutocompletionLogic.loadWatch(),
    mounted:function() {
      document.addEventListener('click', this.handleClickOutside)
      this.currentSelected=this.selected
      if (this.selected && this.selected[this.valueField] && this.selected[this.keyField] ) {
        this.search=this.selected[this.valueField]
        this.hiddenId=this.selected[this.keyField]
        this.lastSearch= this.search;
      }
    },
    destroyed: function() {
      document.removeEventListener('click', this.handleClickOutside)
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
  };
</script>
<style src="./vue-autocompletion.css"></style>