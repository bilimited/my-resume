<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, onUpdated, reactive, ref, watch } from 'vue';
import ComponentExample from './ComponentsExample.vue';
import useMouse from './ComposablesExample';

const myvar = ref(0);
const mybool = ref(true)
const mystate = reactive({
  count: 0
}) // reactive:使对象本身具有响应性
// count是一个普通的number。 但仍然可以触发更新

const mytext = ref("Data is Empty.")

const my_calc_var = computed(() => {
  return myvar.value + 1
})// computed()接受一个getter。可以通过my_calc_var.value访问计算结果
//当myvar改变时，my_calc_var的绑定也都会自动更新

const my_calc_var_2 = computed({
  get() {
    return myvar.value + 100
  },
  set(v) {
    myvar.value = v
  }
})// 可写计算属性


const a_line_of_html = `<div style="color:red"> What do you say? </div>`
const a_line_of_style = `color:green`
const arg_of_v_bind = "style"
const objectAttrs = {
  id: "this is id",
  style: "color: pink"
}
const a_list = [
  "A", "B", "C", "D"
]

const a_function = () => {
  //<script>中，myvar = {... value=0}; <template>中，myvar = 0.
  myvar.value++
}

const update_my_var = async () => {
  myvar.value++ // 状态修改时，DOM会自动更新，但更新不是同步的
  myvar.value++ // 此时DOM还没有更新
  console.log(myvar.value) // 2
  await nextTick() // 要等待 DOM 更新完成后再执行额外的代码，可以使用 nextTick() 全局 API：
  console.log(myvar.value) // 2

  myvar.value++ //现在DOM更新了

  // 该函数能正确执行（myvar.value+=3）
}

onMounted(() => {
  console.log("Component is mounted!")
})

onUpdated(() => {
  console.log("Component is updated!");
})

onUnmounted(() => {

})

// 侦听器：当值变化时触发函数。  侦听器返回一个函数，用于取消侦听器
watch(myvar, (val, oldval) => {
  console.log(`My var changed! new:${val} old:${oldval}`);
})

// 组合式函数的使用
const {x,y} = useMouse()

</script>

<template>
  <div>

    <RouterLink to="/routerExample/hahaha">Go to routerExample</RouterLink>

    <!-- Mustache语法，即双大括号 -->
    <span>{{ myvar }}</span>

    <!--指令 以v-开头 在引号里写js,js的值替换引号内容-->
    <div>

      <div>
        <!-- v-html指令：在网站上渲染任意Html -->
        <span v-html="a_line_of_html"></span>
        <!-- v-bind:XXX js的值替换XXX的内容-->
        <span v-bind:style="a_line_of_style">Green Word</span>
        <!-- v-bind的简写 -->
        <span :style="a_line_of_style">Another Green Word</span>
        <!-- 绑定内联样式 -->
        <span :style="{ color: 'red', fontSize: 'large' }"> Big Red Word </span>
        <!-- 打包多个v-bind -->
        <span v-bind="objectAttrs">Pink Word, and Id = "this is id"</span>
        <!-- v-bind 的动态参数(中括号里写js)(表达式的值应该是一个字符串，null为显式移除绑定) -->
        <span v-bind:[arg_of_v_bind]="a_line_of_style">Still Green Word</span>
        <span :[arg_of_v_bind]="a_line_of_style">Still Green Word</span>
      </div>

      <div>
        <!-- v-on:监听DOM事件 -->
        <a v-on:click="a_function"> do a function </a>
        <!-- 上一个的缩写 -->
        <a @click="myvar++"> do a function </a>
        <!-- 点击事件最多被触发一次 -->
        <a @click.once="myvar++">Only can do once</a>
        <!-- 只允许用右键触发 -->
        <a @click.right="myvar++"> Click me use right!!</a>

        <!-- 按键修饰符 -->
        <!-- .exact 允许精确控制触发事件所需的系统修饰符的组合(如果没有+enter之类杂七杂八的，不需要) -->
        <input @keydown.enter.exact="console.log('Enter is Down.')"
          @keydown.alt.enter="console.log('Alt+Enter is Down!!')" />
      </div>

      <div>
        <!-- 条件渲染 -->
        <a v-if="mybool" @click="mybool = false">mybool = true</a>
        <a v-else @click="mybool = true">mybool = false</a>
        <!-- template是一个不可见的包装器元素。最后渲染结果不好包含这个元素。 -->
        <template v-if="mybool">
          <h1> MYBOOL = TRUE </h1>
        </template>
        <!-- v-show的开关仅会切换元素的display属性，不会删除元素 -->
        <h2 v-show="mybool"> v-show = true </h2>

        <!-- 列表渲染 -->
        <!-- ESLine:列表必须有key。 -->
        <li v-for="(item, index) in a_list" :key="index">
          {{ index }} : "{{ item }}"
        </li>
        <li v-for="(item, key, index) in objectAttrs" :key="key">
          {{ index }}-{{ key }} : "{{ item }}"
        </li>
        <li v-for="n in 5" :key="n">
          {{ n }}
        </li>


      </div>

      <!-- 表单输入绑定 -->
      <div>
        Data: {{ mytext }}
        <br>
        <!-- 更改时 会实时改变v-model的内容 -->
        <input v-model="mytext">
        <br>

        <input type="checkbox" id="checkbox" v-model="mybool">
        <label for="checkbox">单一复选框绑定bool类型</label><br>

        <!-- see more: https://cn.vuejs.org/guide/essentials/forms.html -->
        <a href="https://cn.vuejs.org/guide/essentials/forms.html">See more about form</a>

      </div>
    </div>

    <div>
      <a @click="update_my_var"> update my var for 3 times </a>
      <a @click="mystate.count++">{{ mystate.count }}</a>
      <p>{{ my_calc_var }},{{ my_calc_var_2 }}</p>
    </div>

    <ComponentExample my-prop="this is a prop" v-on:myevent="console.log('A Event was emit.')">
      This is Content.
    </ComponentExample>
    <ComponentExample :my-prop="mytext" @myevent="console.log(`B event was emit.`)">
      This is Content.
    </ComponentExample>

    <div>
      x:{{ x }},y:{{ y }}
    </div>

  </div>

</template>

<style lang="css" scoped></style>
