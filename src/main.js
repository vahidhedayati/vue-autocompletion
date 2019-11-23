import VueAutocompletion from './VueAutocompletion.vue'
import VueAutocompletionValid from './VueAutocompletionValid.vue'
window.VueAutocompletion = VueAutocompletion;
window.VueAutocompletionValid = VueAutocompletionValid;
/*export default {
    install:function(Vue) {
        Vue.component(VueAutocompletion);
        Vue.component(VuAutocompletionValid);
    }
};
*/
export default VueAutocompletion;
export { VueAutocompletion, VueAutocompletionValid };