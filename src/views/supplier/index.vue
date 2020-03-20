<template>
  <div>
    <!--:inline="true" 表单一行显示  -->
    <!-- 重置搜索框,重置会看el-form-item组件元素的prop上是否指定了字段名，指定了才会重置 -->
    <el-form ref="searchForm" :inline="true" :model="searchMap" style="margin-top:20px">
      <el-form-item prop="name">
        <el-input v-model="searchMap.name" placeholder="供应商名称" style="width:200px"></el-input>
      </el-form-item>
      <el-form-item prop="linkman" v-if="!isDialog">
        <el-input v-model="searchMap.linkman" placeholder="联系人" style="width:200px"></el-input>
      </el-form-item>
      <el-form-item prop="mobile" v-if="!isDialog">
        <el-input v-model="searchMap.mobile" placeholder="联系电话" style="width:200px"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="fetchData">查询</el-button>
        <el-button type="primary" @click="handleAdd" v-if="!isDialog">新增</el-button>
        <el-button @click="resetFrom('searchForm')" v-if="!isDialog">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 数据列表   
    :data绑定渲染数据,highlight-current-row激活单选行, 
    @current-change当点击某一行后，会触发clickCurrentChange函数,该函数有两个参数currentRow和oldCurrentRow-->
    <el-table :data="list" height="380" border style="width: 100%" 
    :highlight-current-row="isDialog" @current-change="clickCurrentChange">
      <!-- type="index"获取索引值，从1开始。label显示标题，prop是数据字段名 -->
      <el-table-column type="index" label="序号"></el-table-column>
      <el-table-column prop="name" label="供应商名称"></el-table-column>
      <el-table-column prop="linkman" label="联系人"></el-table-column>
      <el-table-column prop="mobile" label="联系电话" v-if="!isDialog"></el-table-column>
      <el-table-column prop="remark" label="备注" width="300" v-if="!isDialog"></el-table-column>
      <el-table-column label="操作" v-if="!isDialog">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit( scope.row.id)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete( scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <!-- :layout="!isDialog?'total, sizes, prev, pager, next': 'jumper:prev, pager, next'"  -->
    <el-pagination
      :layout="!isDialog?'total, sizes, prev, pager, next':'prev, pager, next'"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pageSize"
      :total="total"
    ></el-pagination>

    <!-- 弹出新增窗口,dialogFormVisible为true时窗口会被弹出 -->
    <el-dialog title="供应商编辑" v-if="!isDialog" :visible.sync="dialogFormVisible" width="500px">
      <el-form
        :rules="rules"
        ref="pojoFrom"
        :model="pojo"
        label-width="100px"
        label-position="right"
        style="width:400px"
      >
        <el-form-item label="供应商名称" prop="name">
          <el-input v-model="pojo.name"></el-input>
        </el-form-item>
        <el-form-item label="联系人" prop="linkman">
          <el-input v-model="pojo.linkman"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="mobile">
          <el-input v-model="pojo.mobile"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="pojo.remark" type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <!-- 有 -->
        <!-- <el-button type="primary" @click="addData('pojoFrom')">确 定</el-button> -->
        <el-button
          type="primary"
          @click="pojo.id===null?addData('pojoFrom'):updateData('pojoFrom')"
        >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import supplierApi from "../../api/supplier";
export default {
  props: {
    //接受父组件传递过来的数据
    //如果为true为弹框，false就是列表
    isDialog: Boolean
  },
  created() {
    this.fetchData();
  },
  data() {
    return {
      list: [],
      pageSize: 10,
      currentPage: 1,
      total: 0,
      searchMap: {
        name: "",
        linkman: "",
        mobile: ""
      },
      dialogFormVisible: false,
      pojo: {
        id: null,
        name: "",
        linkman: "",
        mobile: "",
        remark: ""
      },
      rules: {
        name: [{ required: true, message: "供应商名称不能为空", trigger: "blur" }],
        linkman: [{ required: true, message: "联系人姓名不能为空", trigger: "blur" }]
      },
    };
  },
  methods: {
    fetchData() {
      supplierApi
        .search(this.currentPage, this.pageSize, this.searchMap)
        .then(response => {
          const resp = response.data;
          this.list = resp.data.rows;
          this.total = resp.data.total;
          //   console.log(resp.data.rows);
          //   console.log(this.total);
        });
    },
    handleEdit(id) {
      //   console.log("handleEdit", id);
      this.handleAdd();
      supplierApi.getById(id).then(response => {
        const resp = response.data;
        if (resp.flag) {
          //   console.log(resp.data);
          this.pojo = resp.data;
        } else {
          this.$message({
            message: resp.message,
            type: "warning"
          });
        }
      });
    },
    handleDelete(id) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          supplierApi.deleteById(id).then(response => {
            const resp = response.data;
            if (resp.flag) {
              //删除成功，刷新列表数据
              this.fetchData();
              this.$message({
                type: "success",
                message: resp.message
              });
            } else {
              this.$message({
                type: "error",
                message: resp.message
              });
            }
          });
        })
        .catch(() => {
          // this.$message({
          //   type: "info",
          //   message: "已取消删除"
          // });
        });
    },
    //当每页显示条数改变后被触发，val是最新的每页显示条数
    handleSizeChange(val) {
      this.pageSize = val;
      this.fetchData();
      //   console.log(`每页 ${val} 条`);
    },
    //当页码改变后被触发，val是最新的页码
    handleCurrentChange(val) {
      this.currentPage = val;
      this.fetchData();
      //   console.log(`当前页: ${val}`);
    },
    //重置搜索框,重置会看el-form-item组件元素的prop上是否指定了字段名，指定了才会重置
    resetFrom(formName) {
      this.$refs[formName].resetFields();
    },
    //弹出新增窗口
    handleAdd() {
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["pojoFrom"].resetFields();
      });
    },
    addData(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          //   console.log("提交表单");
          supplierApi.add(this.pojo).then(response => {
            const resp = response.data;
            if (resp.flag) {
              this.fetchData();
              this.dialogFormVisible = false;
            } else {
              this.$message({
                message: resp.message,
                type: "warning"
              });
            }
          });
        } else {
          return false;
        }
      });
    },
    updateData(formname) {
      this.$refs[formname].validate(valid => {
        if (valid) {
          supplierApi.updata(this.pojo).then(response => {
            const resp = response.data;
            if (resp.flag) {
              this.fetchData();
              this.dialogFormVisible = false;
            } else {
              this.$message({
                message: resp.message,
                type: "warning"
              });
            }
          });
        }
      });
    },

    //当点击某一行后，会调用这个函数
    clickCurrentChange(val){
      // this.currentRow = val;
      //自定义事件向父组件传递数据，然后再在父组件中处理传过去的数据
      this.$emit('option-supplier',val)
    }
  }
};
</script>

<style>
</style>