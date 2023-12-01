import { defineComponent, PropType } from "vue";

export const destylerTabProps = {
  internalLeftPadded:{
    type: Boolean as PropType<boolean>,
  },
  internalAddable:{
    type: Boolean as PropType<boolean>,
  },
  internalCreatedByPane:{
    type: Boolean as PropType<boolean>,
  }
}

const destylerTab = defineComponent({
  name:'DestylerTab',
  props: destylerTabProps,
  setup(props){

  },
  render(){

  }
})

export {
  destylerTab
}
