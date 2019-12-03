<template>
  <el-form-item :label="widget.name" :prop="widget.model">
    <template v-if="widget.type == 'input'">
      <el-input
        v-if="widget.options.dataType == 'number' || widget.options.dataType == 'integer' || widget.options.dataType == 'float'"
        :type="widget.options.dataType"
        v-model.number="dataModel"
        :placeholder="widget.options.placeholder"
        :style="{width: widget.options.width}"
        :disabled="widget.options.disabled"
      ></el-input>
      <el-input
        v-else
        :type="widget.options.dataType"
        v-model="dataModel"
        :disabled="widget.options.disabled"
        :placeholder="widget.options.placeholder"
        :style="{width: widget.options.width}"
      ></el-input>
    </template>

    <template v-if="widget.type == 'textarea'">
      <el-input
        type="textarea"
        :rows="5"
        v-model="dataModel"
        :disabled="widget.options.disabled"
        :placeholder="widget.options.placeholder"
        :style="{width: widget.options.width}"
      ></el-input>
    </template>

    <template v-if="widget.options.type=='date'">
      <el-date-picker
        v-model="dataModel"
        :type="widget.options.type"
        :is-range="widget.options.timestamp"
        :placeholder="widget.options.placeholder"
        :start-placeholder="widget.options.startPlaceholder"
        :end-placeholder="widget.options.endPlaceholder"
        :readonly="widget.options.readonly"
        :disabled="widget.options.disabled"
        :editable="widget.options.editable"
        :clearable="widget.options.clearable"
        :value-format="widget.options.timestamp ? 'timestamp' : widget.options.format"
        :format="widget.options.format"
        :default-value="widget.options.defaultValue"
        :style="{width: widget.options.width}"
      ></el-date-picker>
    </template>

    <template v-if="widget.type == 'select'">
      <el-select
        v-model="dataModel"
        :disabled="widget.options.disabled"
        :multiple="widget.options.multiple"
        :clearable="widget.options.clearable"
        :placeholder="widget.options.placeholder"
        :style="{width: widget.options.width}"
        :filterable="widget.options.filterable"
      >
        <el-option
          v-for="item in (widget.options.remote ? widget.options.remoteOptions : widget.options.options)"
          :key="item.index"
          :value="item.value"
          :id="widget.options.showLabel || widget.options.remote?item.id:item.value"
        ></el-option>
      </el-select>
    </template>
  </el-form-item>
</template>

<script>
export default {
  props: ["widget", "models", "rules", "remote"],
  data() {
    return {
      dataModel: this.models[this.widget.model]
    };
  },
  created() {
    if (
      this.widget.options.remote &&
      this.remote[this.widget.options.remoteApi]
    ) {
      this.remote[this.widget.options.remoteApi](data => {
        this.widget.options.remoteOptions = data.map(item => {
          return {
            value: item[this.widget.options.props.value],
            id: item[this.widget.options.props.id]
          };
        });
      });
    }
  },
  methods: {},
  watch: {
    dataModel: {
      deep: true,
      handler(val) {
        this.models[this.widget.model] = val;
        this.$emit("update:models", {
          ...this.models,
          [this.widget.model]: val
        });
      }
    },
    models: {
      deep: true,
      handler(val) {
        this.dataModel = val[this.widget.model];
      }
    }
  }
};
</script>
