<template>
  <div>
    <el-form
      ref="generateForm"
      label-suffix=":"
      :size="data.config.size"
      :model="models"
      :rules="rules"
      :label-position="data.config.labelPosition"
      :label-width="data.config.labelWidth + 'px'"
    >
      <template v-for="item in data.list">
        <template>
          <genetate-form-item
            :key="item.key"
            :models.sync="models"
            :rules="rules"
            :widget="item"
            :remote="remote"
          ></genetate-form-item>
        </template>
      </template>
    </el-form>
  </div>
</template>

<script>
import GenetateFormItem from "./GenerateFormItem";
import { loadJs } from "../util/index.js";

export default {
  name: "fm-generate-form",
  components: {
    GenetateFormItem
  },
  props: ["data", "remote"],
  data() {
    return {
      models: {},
      rules: {},
      arr: []
    };
  },
  created() {
    this.generateModle(this.data.list);
  },
  mounted() {},
  methods: {
    generateModle(genList) {
      for (let i = 0; i < genList.length; i++) {
          if (this.rules[genList[i].model]) {
            this.rules[genList[i].model] = [
              ...this.rules[genList[i].model],
              
              ...genList[i].rules.map(item => {
                
                if (item.pattern) {
                  return { ...item, pattern: eval(item.pattern) };
                } else {
                  return { ...item };
                }
              })
            ];
          } else {
            this.rules[genList[i].model] = [
              ...genList[i].rules.map(item => {
                if (item.pattern) {
                  return { ...item, pattern: eval(item.pattern) };
                } else {
                  return { ...item };
                }
              })
            ];
          }
      }
    },
    getData() {
      return new Promise((resolve, reject) => {
        this.$refs.generateForm.validate(valid => {
          if (valid) {
            for (var i = 0; i < this.data.list.length; i++) {
              var model = this.data.list[i].model;
              for(var j in this.models){
                if(model == j){
                  this.data.list[i].options.defaultValue = this.models[j];
                  this.data.list[i].options[j] = this.models[j];
                }
              }
            }
            resolve(this.data.list);
          } else {
            reject(new Error("表单数据校验失败").message);
          }
        });
      });
    },
    reset() {
      this.$refs.generateForm.resetFields();
    },
    refresh() {}
  },
  watch: {
    data: {
      deep: true,
      handler(val) {
        this.generateModle(val.list);
      }
    },
    value: {
      deep: true,
      handler(val) {
       // console.log(JSON.stringify(val));
        this.models = { ...this.models, ...val };
      }
    }
  }
};
</script>

<style lang="scss">
// @import '../styles/cover.scss';
</style>
