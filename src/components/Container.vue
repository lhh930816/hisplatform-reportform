<template>
  <el-container class="fm2-container">
    <el-main class="fm2-main">
      <el-container>
        <el-aside width="240px" style="border-right:1px solid #e0e0e0;">
          <div class="components-list">
            <div class="widget-cate">基础字段</div>

            <draggable
              tag="ul"
              :list="basicComponents"
              v-bind="{group:{ name:'people', pull:'clone',put:false},sort:false, ghostClass: 'ghost'}"
              @end="handleMoveEnd"
              @start="handleMoveStart"
              :move="handleMove"
            >
              <li
                class="form-edit-widget-label"
                v-for="(item, index) in basicComponents"
                :key="index"
              >
                <a>
                  <i class="icon iconfont" :class="item.icon"></i>
                  <span>{{item.name}}</span>
                </a>
              </li>
            </draggable>
          </div>
        </el-aside>
        <el-container class="center-container" direction="vertical">
          <el-header class="btn-bar" style="height: 45px;">
            <slot name="action"></slot>
            <div v-if="reportName">
              <div
                class="widget-cate"
                style="float:left; padding: 0 8px; font-size: 14px; wdith: 80%"
              >报表名称</div>
              <el-input
                placeholder="请输入报表名称"
                v-model="MC"
                maxlength="25"
                style="float:left; width: 30%"
                clearable
              ></el-input>
               <el-input
                v-model="Id"
                maxlength="25"
                style="float:left; width: 30%"
                type="hidden"
              ></el-input>
              <div
                class="widget-cate"
                style="float:left; padding: 0 8px; font-size: 14px; wdith: 80%"
              >合计列</div>
              <el-input
                placeholder="请输入合计列"
                v-model="HJL"
                maxlength="25"
                style="float:left; width: 30%"
                clearable
              ></el-input>
            </div>

            <el-button
              v-if="clearable"
              type="text"
              size="medium"
              icon="el-icon-delete"
              @click="handleClear"
            >清空</el-button>
            <el-button
              v-if="preview"
              type="text"
              size="medium"
              icon="el-icon-view"
              @click="handlePreview"
            >预览</el-button>
          </el-header>
          <el-main :class="{'widget-empty': widgetForm.list.length == 0}">
            <widget-form
              v-if="!resetJson"
              ref="widgetForm"
              :data="widgetForm"
              :select.sync="widgetFormSelect"
            ></widget-form>
          </el-main>
          <div style="border-top: 1px solid #e0e0e0; padding: 5px 0;">
            <div class="el-form-item widget-view" style="margin-bottom: 0">
              <label class="el-form-item__label" style="width: 46px;">SQL:</label>
              <div class="el-form-item__content" style="margin-left: 46px;">
                <div class="el-textarea el-input--small" style="width: 97%;">
                  <textarea
                    autocomplete="off"
                    rows="5"
                    placeholder
                    class="el-textarea__inner"
                    style="min-height: 31px; line-height: 1.2"
                    id="Sentence"
                    v-model="Sentence"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        </el-container>

        <el-aside
          class="widget-config-container"
          width="270px"
          style="border-left:1px solid #e0e0e0"
        >
          <el-container>
            <el-header height="45px">
              <div
                class="config-tab"
                :class="{active: configTab=='widget'}"
                @click="handleConfigSelect('widget')"
              >字段属性</div>
              <div
                class="config-tab"
                :class="{active: configTab=='form'}"
                @click="handleConfigSelect('form')"
              >表单属性</div>
            </el-header>
            <el-main class="config-content">
              <widget-config v-show="configTab=='widget'" :data="widgetFormSelect"></widget-config>
              <form-config v-show="configTab=='form'" :data="widgetForm.config"></form-config>
            </el-main>
          </el-container>
        </el-aside>

        <cus-dialog
          :visible="previewVisible"
          @on-close="previewVisible = false"
          ref="getDom"
          width="900px"
          form
        >
          <generate-form
            insite="true"
            v-if="previewVisible"
            :data="widgetForm"
            :value="widgetModels"
            :remote="remoteApis"
            ref="generateForm"
          >
            <template v-slot:blank="scope">
              宽度：
              <el-input v-model="scope.model.blank.width" style="width: 100px"></el-input>高度：
              <el-input v-model="scope.model.blank.height" style="width: 100px"></el-input>
            </template>
          </generate-form>

          <template slot="action">
            <el-button type="primary" @click="handleTest">确定</el-button>
            <el-button @click="handleReset">重置</el-button>
          </template>
        </cus-dialog>
      </el-container>
    </el-main>
  </el-container>
</template>

<script>
import Draggable from "vuedraggable";
import WidgetConfig from "./WidgetConfig";
import FormConfig from "./FormConfig";
import WidgetForm from "./WidgetForm";
import CusDialog from "./CusDialog";
import GenerateForm from "./GenerateForm";
import Clipboard from "clipboard";

import { basicComponents } from "../util/componentsConfig.js";
import { loadJs, loadCss } from "../util/index.js";
import request from "../util/request.js";
import generateCode from "../util/generateCode.js";

export default {
  name: "fm-making-form",
  components: {
    Draggable,
    WidgetConfig,
    FormConfig,
    WidgetForm,
    CusDialog,
    GenerateForm
  },
  props: {
    preview: {
      type: Boolean,
      default: false
    },
    generateCode: {
      type: Boolean,
      default: false
    },
    generateJson: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: false
    },
    reportName: {
      type: Boolean,
      default: false
    },
    listDatas: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  data() {
    return {
      basicComponents,
      resetJson: false,
      widgetForm: {
        list: [],
        config: {
          labelWidth: 100,
          labelPosition: "right",
          size: "small"
        }
      },
      configTab: "widget",
      widgetFormSelect: null,
      previewVisible: false,
      jsonVisible: false,
      codeVisible: false,
      remoteApis: "",
      widgetModels: {},
      blank: "",
      htmlTemplate: "",
      uploadEditor: null,
      jsonClipboard: null,
      arr: null,
      Sentence: "",
      MC: "",
      Id:"",
      HJL: "",
      formData: this.listDatas
      // checked: false
    };
  },
  created() {
    //console.log(this.formData);
  },
  mounted() {},
  methods: {
    handleConfigSelect(value) {
      this.configTab = value;
    },
    handleMoveEnd(evt) {
      // console.log("end", evt);
    },
    handleMoveStart({ oldIndex }) {
      // console.log("start", oldIndex, this.basicComponents);
    },
    handleMove() {
      return true;
    },
    handlePreview() {
      this.previewVisible = true;
    },
    handleTest() {
      this.$refs.generateForm
        .getData()
        .then(data => {
          this.widgetForm.list = data;
          this.previewVisible = false;
        })
        .catch(e => {});
    },
    handleReset() {
      this.$refs.generateForm.reset();
    },
    //清空
    handleClear() {
      this.widgetForm = {
        list: [],
        config: {
          labelWidth: 100,
          labelPosition: "right",
          size: "small",
          customClass: ""
        }
      };
      this.MC = "";
      this.Sentence = "";
      this.widgetFormSelect = {};
      this.HJL = "";
      this.Id = "";
    },
    getJSON() {
      return this.widgetForm;
    },
    getHtml() {
      return generateCode(JSON.stringify(this.widgetForm));
    },
    setJSON(json) {
      this.widgetForm = json;

      if (json.list.length > 0) {
        this.widgetFormSelect = json.list[0];
      }
    },
    handleInput(val) {
      this.blank = val;
    }
  },
  computed:{
    reportBasicInfo () {
      return this.listDatas;
    }
  },
  watch: {
    //合计列验证
    HJL() {
      this.HJL = this.HJL.replace(/[^\d\,]/g, "");
    },
    listDatas: {
      
      immediate: true, //immediate选项开启首次赋值监听
      deep: true,
      handler(newVal, oldVal) {
        if (newVal.definableFields) {
          let listData = newVal.definableFields;
          let reportBasicInfo = newVal.reportBasicInfo;
          this.Id = reportBasicInfo.Id;
          this.MC = reportBasicInfo.Name;
          this.HJL = reportBasicInfo.TotalColumn;
          this.Sentence = reportBasicInfo.SqlStatement;
          let arr = [];
          for (let j = 0; j < listData.length; j++) {
            let obj = {};
            obj.type = listData[j].FiledType;
            obj.name = listData[j].Name;
            obj.key = listData[j].Parameterkey;
            obj.model = listData[j].Code;
            obj.rules = [];
            obj.options = { defaultValue: listData[j].DefaultValue };
            if (listData[j].FiledType == "select") {
              if (listData[j].ParameterRemote) {
                obj.options.selectSql = listData[j].FiledSource;
                obj.options.options = [
                  {
                    value: "下拉框1",
                    id: ""
                  },
                  {
                    value: "下拉框2",
                    id: ""
                  },
                  {
                    value: "下拉框3",
                    id: ""
                  }
                ];
              } else {
                obj.options.options = JSON.parse(listData[j].FiledSource);
              }
              obj.options.remote = listData[j].ParameterRemote;
            }
            if (listData[j].FiledType == "date") {
              obj.options.type = listData[j].FiledType;
              obj.options.defaultValue = listData[j].DefaultValue;
            }

            arr.push(obj);
          }
          this.widgetForm.list = arr;
          this.setJSON(this.widgetForm);
        }
      },
    }
  }
};
</script>

<style lang="scss">
.widget-empty {
  background: url("../assets/form_empty.png") no-repeat;
  background-position: 50%;
}
</style>
