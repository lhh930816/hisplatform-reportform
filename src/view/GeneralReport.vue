<template>
  <div class="report">
    <div class="content-body">
      <div class="portlet-body">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="名称">
            <el-input placeholder="请输入名称" v-model="formInline.name" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="Query" icon="el-icon-search">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="dialogFormVisible = true" icon="el-icon-plus">新增</el-button>
          </el-form-item>
        </el-form>
        <div class="table-content">
          <el-table
            id="GeneralReportTable"
            :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)"
            border
            stripe
            :default-sort = "{prop: 'CreateTime', order: 'descending'}"
          >
            <el-table-column label="操作" align="center" width="100px">
              <template slot-scope="scope">
                <el-button
                  class="edit"
                  type="primary"
                  size="mini"
                  @click="edit(scope.$index,scope.row)"
                >
                  <i class="el-icon-edit-outline"></i>
                </el-button>
                <el-button
                  class="del"
                  type="danger"
                  size="mini"
                  @click="del(scope.$index,scope.row)"
                >
                  <i class="el-icon-delete"></i>
                </el-button>
              </template>
            </el-table-column>
            <el-table-column label="Id" align="center" prop="Id" ></el-table-column>
            <el-table-column label="名称" align="center" prop="Name" ></el-table-column>
            <el-table-column label="时间" align="center" prop="CreateTime" sortable>
              <template slot-scope="scope">
                <span>{{ scope.row.CreateTime | formatDate('yyyy-MM-dd') }}</span>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-size="pagesize"
            layout="total, prev, pager, next, jumper"
            :total="tableData.length"
            style="float: right; padding-top: 15px;"
          ></el-pagination>
        </div>
      </div>
    </div>
    <el-dialog title="新增报表" :visible.sync="dialogFormVisible" :close-on-click-modal="false" @close="clear">
      <fm-making-form ref="makingForm" reportName preview clearable :listDatas="listData">
        <template slot="action"></template>
      </fm-making-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="clear">取 消</el-button>
        <el-button type="primary" @click="savaForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { formatDate } from "../util/moment";
export default {
  data() {
    return {
      formInline: {
        name: ""
      },
      form: {
        name: "",
        region: ""
      },
      dialogFormVisible: false,
      formLabelWidth: "120px",
      data: [],
      obj: {},
      tableData: [],
      currentPage: 1,
      pagesize: 10,
      listData: {}
    };
  },
  created() {
    this.Query();
  },
  methods: {
    // 初始页currentPage、初始每页数据数pagesize
    handleSizeChange: function(size) {
      this.pagesize = size;
    },
    handleCurrentChange: function(currentPage) {
      this.currentPage = currentPage;
    },
    clear (){
      this.$refs.makingForm.handleClear();
      this.dialogFormVisible = false;
    },
    //报表查询
    Query() {
      let input = {};
      input.Keyword = this.formInline.name;
      input.pageSize = this.pagesize;
      input.pageIndex = this.currentPage;

      this.$post(`${this.baseURL}/api/Report/list`, input)
      .then(data => {
        if(data.Success){
          let result = data.Result.reportBasicInfo;
          this.tableData = result;
        }
      })
    },
    //保存
    savaForm() {
      this.data = this.$refs.makingForm.$data.widgetForm.list;
      let val = this.$refs.makingForm.Sentence;
      let reportNames = this.$refs.makingForm.MC;
      let totalColumn = this.$refs.makingForm.HJL;
      let Id = this.$refs.makingForm.Id;
      let formData = [];
      this.obj.ParameterSource = val;
      this.obj.ParameterName = reportNames;
      this.obj.ParameterType = "SQL";
      this.obj.Id = Id;
      if (totalColumn == "") {
        this.obj.TotalColumn = totalColumn;
      } else {
        let column = totalColumn.split(",");
        this.obj.TotalColumn = JSON.stringify(column);
      }
      if (reportNames == "") {
        this.$message({
          message: "请填写报表名称",
          type: "warning"
        });
        return;
      }
      if (this.data.length == 0) {
        this.$message({
          message: "请添加信息",
          type: "warning"
        });
        return;
      }
      for (let i = 0; i < this.data.length; i++) {
        let defaultValue = this.data[i].options.defaultValue;
        let objs = {};
        objs.ParameterName = this.data[i].name;
        objs.ParameterType = this.data[i].type;
        objs.ParameterCode = this.data[i].model;
        objs.Parameterkey = this.data[i].key;
        if (this.data[i].type == "select") {
          if (this.data[i].options.remote) {
            objs.DefaultValue = "";
            objs.ParameterApi = "API";
            objs.ParameterSource = this.data[i].options.selectSql;
          } else {
            objs.ParameterSource = JSON.stringify(this.data[i].options.options);
            let source = JSON.parse(objs.ParameterSource);
            if (defaultValue == "") {
              objs.DefaultValue = defaultValue;
            } else {
              for (let j = 0; j < source.length; j++) {
                if (defaultValue == source[j].value) {
                  objs.DefaultValue = source[j].id;
                }
              }
            }
          }
          objs.ParameterRemote = this.data[i].options.remote;
        } else {
          objs.DefaultValue = defaultValue;
        }
        formData.push(objs);
      }
      formData.push(this.obj);
      this.$post(`${this.baseURL}/api/Report/save`, formData)
      .then (data =>{
        if (data.Success) {
          if(Id =="") {
              this.$message({
              message: "保存成功",
              type: "success",
              duration: 1000
            });
            } else {
               this.$message({
              message: "编辑成功",
              type: "success",
              duration: 1000
            });
          }
        }
        this.$refs.makingForm.handleClear();
        this.dialogFormVisible = false;
        this.Query();
      });
    },
    //删除
    del($index, row) {
      this.$confirm("确定要删除?", "提示", {
        confirmButtonText: "确定",
        concelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$post(`${this.baseURL}/api/Report/delete`, { Ids: [row.Id] })
          .then(data => {
            if (data.Success) {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.Query();
            }
          });
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          }); 
        });
    },
    //编辑
    edit(index, row) {
      let data = {};
      let _this = this
      data.reportId = row.Id;
      this.$get(`${this.baseURL}/api/Report/detail`, data)
      .then(data => {
        if (data.Success) {
          this.dialogFormVisible = true;
          let list = {};
          list.definableFields = data.definableFields;
          list.reportBasicInfo = data.reportBasicInfo;
          _this.listData = list;
        } else {
           this.$message.error(data.Message);
        }
      })
    }
  },
  filters: {
    formatDate(time) {
      var date = new Date(time);
      return formatDate(date, "yyyy-MM-dd");
    }
  }
};
</script>
<style lang="scss" >
.report {
  .content-body {
    padding: 20px;
    .portlet-body {
      .demo-form-inline {
        float: left;
        margin-bottom: 20px;
        .el-form-item {
          margin-bottom: 0;
          height: 26px;
          .el-form-item__label {
            height: 26px;
            line-height: 26px;
          }
          .el-form-item__content {
            line-height: 25px;
            .el-input__inner {
              height: 26px;
              line-height: 26px;
            }
            .el-input__icon {
              line-height: 26px;
            }
            button {
              padding: 5px 10px;
            }
          }
        }
      }
      .table-content {
        #GeneralReportTable {
          .has-gutter {
            tr {
              color: #555;
              th {
                padding: 4px 0;
              }
            }
          }
          .cell .el-button {
            padding: 5px 10px;
            float: left;
          }
          .el-table__empty-block {
            min-height: 35px;
            .el-table__empty-text {
              line-height: 35px;
              color: #555;
            }
          }
        }
      }
    }
  }
  .el-dialog {
    margin-top: 2vh !important;
    width: 70%;
    .el-dialog__body {
      padding: 10px 20px;
      height: 500px;
    }
  }
  .el-footer {
    display: none;
  }
  .el-dialog__footer {
    padding: 0px 20px 10px 20px;
  }
}
</style>
