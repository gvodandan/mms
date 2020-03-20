<template>
  <div>
    <!--:inline="true" 表单一行显示  -->
    <!-- 重置搜索框,重置会看el-form-item组件元素的prop上是否指定了字段名，指定了才会重置 -->
    <el-form ref="searchForm" :inline="true" :model="searchMap" style="margin-top:20px">
      <el-form-item prop="username">
        <el-input v-model="searchMap.username" placeholder="账号" style="width:200px"></el-input>
      </el-form-item>
      <el-form-item prop="name">
        <el-input v-model="searchMap.name" placeholder="姓名" style="width:200px"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="fetchData">查询</el-button>
        <el-button type="primary" @click="handleAdd">新增</el-button>
        <el-button @click="resetFrom('searchForm')">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 数据列表   
    :data绑定渲染数据-->
    <el-table :data="list" height="380" border style="width: 100%">
      <!-- type="index"获取索引值，从1开始。label显示标题，prop是数据字段名 -->
      <el-table-column type="index" label="序号"></el-table-column>
      <el-table-column prop="username" label="账号" width="100"></el-table-column>
      <el-table-column prop="name" label="姓名" width="100"></el-table-column>
      <el-table-column prop="age" label="年龄" width="100"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column prop="salary" label="薪酬"></el-table-column>
      <el-table-column prop="entryDate" label="入职时间"></el-table-column>
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit( scope.row.id)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete( scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>

    <!-- 弹出新增窗口,dialogFormVisible为true时窗口会被弹出 -->
    <el-dialog  title="员工编辑" :visible.sync="dialogFormVisible" width="500px">
      <el-form
        :rules="rules"
        ref="pojoFrom"
        :model="pojo"
        label-width="100px"
        label-position="right"
        style="width:400px"
      >
        <el-form-item label="账号" prop="username">
          <el-input v-model="pojo.username"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="pojo.name"></el-input>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input v-model="pojo.age"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="pojo.mobile"></el-input>
        </el-form-item>
        <el-form-item label="薪酬" prop="salary">
          <el-input v-model="pojo.salary"></el-input>
        </el-form-item>
        <el-form-item label="入职时间" prop="entryDate">
          <!-- value-format是指定绑定值的格式 -->
          <el-date-picker
            value-format="yyyy-MM-dd"
            v-model="pojo.entryDate"
            type="date"
            placeholder="入职时间"
          ></el-date-picker>
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
import staffApi from "../../api/staff";

export default {
  created() {
    this.fetchData();
  },
  data() {
    return {
      list: [],
      total: 0, //总记录数
      currentPage: 1, //当前页码
      pageSize: 10, //每页显示多少条数据
      searchMap: {
        //条件查询绑定的条件值
        username:'',
        name:''
      },
      dialogFormVisible: false, //控制新增对话框
      pojo: {
        //新增对象提交的数据
        id: null,
        username: "",
        name: "",
        age: "",
        mobile: "",
        salary: "",
        entryDate: "",
      },
      rules: {
        username: [{ required: true, message: "账号不能为空", trigger: "blur" }],
        name: [{ required: true, message: "姓名不能为空", trigger: "blur" }],
      }
    };
  },
  methods: {
    //重置搜索框,重置会看el-form-item组件元素的prop上是否指定了字段名，指定了才会重置
    resetFrom(formName) {
      this.$refs[formName].resetFields();
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
    fetchData() {
      //staffApi.getlist().then(response => {
      staffApi.search(this.currentPage, this.pageSize, this.searchMap).then(response => {
          const resp = response.data;
          this.list = resp.data.rows;
          this.total = resp.data.total;
          //   console.log(resp.data);
        });
    },
    addData(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          //
          staffApi.add(this.pojo).then(response => {
            const resp = response.data;
            if (resp.flag) {
              //新增成功,刷新列表数据
              this.$message({
                  message:"新增成功，初始密码为123456",
                  type:"warning"
              })
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
    //弹出新增窗口
    handleAdd() {
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["pojoFrom"].resetFields();
      });
    },
    handleEdit(id) {
      // console.log("编辑", id);
      this.handleAdd();
      staffApi.getById(id).then(response => {
        const resp = response.data;
        if (resp.flag) {
          this.pojo = resp.data;
        }
      });
    },
    updateData(formName) {
      // console.log("updateData", formName);
      this.$refs[formName].validate(valid => {
        if (valid) {
          //提交更新表单
          staffApi.updateById(this.pojo).then(response => {
            const resp = response.data;
            if (resp.flag) {
              //更新成功，刷新列表
              this.fetchData();
              this.dialogFormVisible = false;
              // console.log(this.pojo);
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
    //删除员工
    handleDelete(id) {
      // console.log("删除", id);
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          staffApi.deleteById(id).then(response => {
            const resp = response.data;
            if (resp.flag) {
              //删除成功，刷新列表数据
              this.fetchData();
              this.$message({
                type: "success",
                message: resp.message
              });
            }else{
              this.$message({
                type:  "error",
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
    }
  },
};
</script>

<style>
</style>