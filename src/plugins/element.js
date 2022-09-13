import Vue from 'vue'
// message弹框提示组件
import { Button,Form ,FormItem,Input,Message} from 'element-ui'

Vue.use(Button).use(Form).use(FormItem).use(Input)
Vue.prototype.$message=Message

