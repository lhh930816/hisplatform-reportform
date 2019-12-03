<template>
  <div v-if="show">
    <el-form label-position="top">
      <el-form-item label="标题" v-if="data.type!='grid'">
        <el-input v-model="data.name"></el-input>
      </el-form-item>
      <!-- <el-form-item label="宽度" v-if="Object.keys(data.options).indexOf('width')>=0">
        <el-input v-model="data.options.width"></el-input>
      </el-form-item> -->

      <!-- <el-form-item label="显示输入框" v-if="Object.keys(data.options).indexOf('showInput')>=0">
        <el-switch v-model="data.options.showInput"></el-switch>
      </el-form-item> -->
      <!-- <el-form-item label="是否多选" v-if="data.type=='select' || data.type=='imgupload'">
        <el-switch v-model="data.options.multiple" @change="handleSelectMuliple"></el-switch>
      </el-form-item>
      <el-form-item label="是否可搜索" v-if="data.type=='select'">
        <el-switch v-model="data.options.filterable"></el-switch>
      </el-form-item> -->
      <!-- <el-form-item label="是否显示标签" v-if="Object.keys(data.options).indexOf('showLabel')>=0">
        <el-switch v-model="data.options.showLabel"></el-switch>
      </el-form-item>-->
      <el-form-item label="选项" v-if="Object.keys(data.options).indexOf('options')>=0">
        <el-radio-group v-model="data.options.remote" size="mini" style="margin-bottom:10px;">
          <el-radio-button :label="false">静态数据</el-radio-button>
          <el-radio-button :label="true">远端数据</el-radio-button>
        </el-radio-group>
        <template v-if="data.options.remote">
          <div>
            <!-- <el-input size="mini" style v-model="data.options.remoteApi">
              <template slot="prepend">远端方法</template>
            </el-input> -->
            <!-- <el-input size="mini" style v-model="data.options.props.value">
              <template slot="prepend">vlaue</template>
            </el-input>
            <el-input size="mini" style v-model="data.options.props.id">
              <template slot="prepend">id</template>
            </el-input> -->
            <el-input
              type="textarea"
              :autosize="{ minRows: 4, maxRows: 6}"
              placeholder="请输入SQL"  v-model = "data.options.selectSql">
            </el-input>
              <label style="color: red;">注:SQL中对应Key和Code</label>
          </div>
        </template>
        <template v-else>
          <template v-if="data.type=='select'&&!data.options.multiple">
            <el-radio-group v-model="data.options.defaultValue">
              <draggable
                tag="ul"
                :list="data.options.options"
                v-bind="{group:{ name:'options'}, ghostClass: 'ghost',handle: '.drag-item'}"
                handle=".drag-item"
              >
                <li v-for="(item, index) in data.options.options" :key="index">
                  <el-radio :label="item.value" style="margin-right: 5px;">
                    <el-input
                      style="width:100px"
                      size="mini"
                      v-model="item.value"
                    ></el-input>
                    <el-input
                      style="width:45px;"
                      size="mini"
                      v-model="item.id"
                    ></el-input>
                    <!-- <input v-model="item.value"/> -->
                  </el-radio>
                  <i class="drag-item" style="font-size: 16px;margin: 0 5px;cursor: move;">
                    <i class="iconfont icon-icon_bars"></i>
                  </i>
                  <el-button
                    @click="handleOptionsRemove(index)"
                    circle
                    plain
                    type="danger"
                    size="mini"
                    icon="el-icon-minus"
                    style="padding: 4px;margin-left: 5px;"
                  ></el-button>
                </li>
              </draggable>
            </el-radio-group>
          </template>

          <template v-if="data.type=='select' && data.options.multiple">
            <el-checkbox-group v-model="data.options.defaultValue">
              <draggable
                tag="ul"
                :list="data.options.options"
                v-bind="{group:{ name:'options'}, ghostClass: 'ghost',handle: '.drag-item'}"
                handle=".drag-item"
              >
                <li v-for="(item, index) in data.options.options" :key="index+ '-label'">
                  <el-checkbox :label="item.value" style="margin-right: 5px;">
                    <el-input
                      :style="{'width': data.options.showLabel? '45px': '100px' }"
                      size="mini"
                      v-model="item.value"
                    ></el-input>
                    <el-input
                      style="width:45px;"
                      size="mini"
                      v-model="item.id"
                    ></el-input>
                  </el-checkbox>
                  <i class="drag-item" style="font-size: 16px;margin: 0 5px;cursor: move;">
                    <i class="iconfont icon-icon_bars"></i>
                  </i>
                  <el-button
                    @click="handleOptionsRemove(index)"
                    circle
                    plain
                    type="danger"
                    size="mini"
                    icon="el-icon-minus"
                    style="padding: 4px;margin-left: 5px;"
                  ></el-button>
                </li>
              </draggable>
            </el-checkbox-group>
          </template>
          <div style="margin-left: 22px;">
            <el-button type="text" @click="handleAddOption">添加选项</el-button>
          </div>
        </template>
      </el-form-item>

      <el-form-item
        label="内容输入"
        v-if="Object.keys(data.options).indexOf('defaultValue')>=0 && (data.type == 'textarea' || data.type == 'input')"
      >
        <el-input
          v-if="data.type=='textarea'"
          type="textarea"
          :rows="5"
          v-model="data.options.defaultValue"
        ></el-input>
        <el-input v-if="data.type=='input'" v-model="data.options.defaultValue"></el-input>
      </el-form-item>

      <template v-if="data.type == 'date'">
        <el-form-item label="默认值" v-if="data.options.type=='date'">
          <el-date-picker
            type="date"
            key="1"
            style="width: 100%;"
            v-if="!data.options.timestamp"
            v-model="data.options.defaultValue"
            is-range
            :value-format="data.options.format"
            :picker-options="data.options.defaultValue"
          ></el-date-picker>
        </el-form-item>
      </template>

      <template v-if="data.type != 'grid'">
        <el-form-item label="数据绑定Key">
          <el-input v-model="data.model"></el-input>
        </el-form-item>
        <!-- <el-form-item label="操作属性">
          <el-checkbox
            v-model="data.options.readonly"
            v-if="Object.keys(data.options).indexOf('readonly')>=0"
          >完全只读</el-checkbox>
          <el-checkbox
            v-model="data.options.disabled"
            v-if="Object.keys(data.options).indexOf('disabled')>=0"
          >禁用</el-checkbox>
          <el-checkbox
            v-model="data.options.editable"
            v-if="Object.keys(data.options).indexOf('editable')>=0"
          >文本框可输入</el-checkbox>
          <el-checkbox
            v-model="data.options.clearable"
            v-if="Object.keys(data.options).indexOf('clearable')>=0"
          >显示清除按钮</el-checkbox>
        </el-form-item> -->
        <!-- <el-form-item label="校验">
          <div>
            <el-checkbox v-model="data.options.required">必填</el-checkbox>
          </div>
          <el-select
            v-if="Object.keys(data.options).indexOf('dataType')>=0"
            v-model="data.options.dataType"
            size="mini"
          >
            <el-option value="string" label="字符串"></el-option>
            <el-option value="number" label="数字"></el-option>
            <el-option value="boolean" label="布尔值"></el-option>
            <el-option value="integer" label="整数"></el-option>
            <el-option value="float" label="浮点数"></el-option>
            <el-option value="url" label="URL地址"></el-option>
          </el-select>

          <div v-if="Object.keys(data.options).indexOf('pattern')>=0">
            <el-input
              size="mini"
              v-model.lazy="data.options.pattern"
              style=" width: 240px;"
              placeholder="填写正则表达式"
            ></el-input>
          </div>
        </el-form-item> -->
      </template>
    </el-form>
  </div>
</template>

<script>
import Draggable from "vuedraggable";

export default {
  components: {
    Draggable
  },
  props: ["data"],
  data() {
    return {
      validator: {
        type: null,
        required: null,
        pattern: null,
        range: null,
        length: null
      }
    };
  },
  computed: {
    show() {
      if (this.data && Object.keys(this.data).length > 0) {
        return true;
      }
      return false;
    }
  
  },
  methods: {
    handleOptionsRemove(index) {
      if (this.data.type === "grid") {
        this.data.columns.splice(index, 1);
      } else {
        this.data.options.options.splice(index, 1);
      }
    },
    handleAddOption() {
      if (this.data.options.showLabel) {
        this.data.options.options.push({
          value: "新选项",
          id: "新选项"
        });
      } else {
        this.data.options.options.push({
          value: "新选项",
          id: ""
        });
      }
    },
    handleAddColumn() {
      this.data.columns.push({
        span: "",
        list: []
      });
    },
    generateRule() {
      this.data.rules = [];
      Object.keys(this.validator).forEach(key => {
        if (this.validator[key]) {
          this.data.rules.push(this.validator[key]);
        }
      });
    },
    handleSelectMuliple(value) {
      if (value) {
        if (this.data.options.defaultValue) {
          this.data.options.defaultValue = [this.data.options.defaultValue];
        } else {
          this.data.options.defaultValue = [];
        }
      } else {
        if (this.data.options.defaultValue.length > 0) {
          this.data.options.defaultValue = this.data.options.defaultValue[0];
        } else {
          this.data.options.defaultValue = "";
        }
      }
    },

    validateRequired(val) {
      if (val) {
        this.validator.required = {
          required: true,
          message: `${this.data.name}必须填写`
        };
      } else {
        this.validator.required = null;
      }

      this.$nextTick(() => {
        this.generateRule();
      });
    },

    validateDataType(val) {
      if (!this.show) {
        return false;
      }

      if (val) {
        this.validator.type = {
          type: val,
          message: this.data.name + "格式不正确"
        };
      } else {
        this.validator.type = null;
      }

      this.generateRule();
    },
    valiatePattern(val) {
      if (!this.show) {
        return false;
      }

      if (val) {
        this.validator.pattern = {
          pattern: val,
          message: this.data.name + "格式不匹配"
        };
      } else {
        this.validator.pattern = null;
      }

      this.generateRule();
    }
  },
  watch: {
    // "data.options.isRange": function(val) {
    //   if (typeof val !== "undefined") {
    //     if (val) {
    //       this.data.options.defaultValue = null;
    //     } else {
    //       if (Object.keys(this.data.options).indexOf("defaultValue") >= 0)
    //         this.data.options.defaultValue = "";
    //     }
    //   }
    // },
    "data.options.required": function(val) {
      this.validateRequired(val);
    },
    "data.options.dataType": function(val) {
      this.validateDataType(val);
    },
    "data.options.pattern": function(val) {
      this.valiatePattern(val);
    },
    "data.name": function(val) {
      if (this.data.options) {
        this.validateRequired(this.data.options.required);
        this.validateDataType(this.data.options.dataType);
        this.valiatePattern(this.data.options.pattern);
      }
    }
  }
};
</script>
