import VueAutocompletion from './VueAutocompletion.vue'
import VuAutocompletionValid from './VuAutocompletionValid.vue'
window.VueAutocompletion = VueAutocompletion;
window.VuAutocompletionValid = VuAutocompletionValid;
/*export default {
    install:function(Vue) {
        Vue.component(VueAutocompletion);
        Vue.component(VuAutocompletionValid);
    }
};
*/
export default VueAutocompletion;
export { VueAutocompletion, VuAutocompletionValid };