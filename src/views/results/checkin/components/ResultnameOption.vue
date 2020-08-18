<template>
  <div style="display:inline-block;">
    <label class="radio-label" style="padding-left:0;">考试名称: </label>
    <el-input v-model="resultname" placeholder="请输入考试名称(默认成绩)" style="width:345px; margin-left: 10px;" prefix-icon="el-icon-edit" />
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  computed: {
    resultname: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  }
}
</script>
