<template>
  <div>
    <!--:inline="true" 表单一行显示  -->
    <!-- 重置搜索框,重置会看el-form-item组件元素的prop上是否指定了字段名，指定了才会重置 -->
    <el-form ref="searchForm" :inline="true" :model="searchMap" style="margin-top:20px">
      <el-form-item prop="name">
        <el-input v-model="searchMap.name" placeholder="商品名称" style="width:200px"></el-input>
      </el-form-item>
      <el-form-item prop="code">
        <el-input v-model="searchMap.code" placeholder="商品编号" style="width:200px"></el-input>
      </el-form-item>
      <el-form-item prop="supplierName">
        <el-input
          readonly
          @click.native="dialogSupplierVisible=true"
          v-model="searchMap.supplierName"
          placeholder="选择供应商"
          style="width:200px"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="fetchData">查询</el-button>
        <el-button type="primary" @click="handleAdd">新增</el-button>
        <el-button @click="$refs['searchForm'].resetFields();">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 数据列表   
    :data绑定渲染数据-->
    <el-table :data="list" height="380" border style="width: 100%">
      <!-- type="index"获取索引值，从1开始。label显示标题，prop是数据字段名 -->
      <el-table-column type="index" label="序号"></el-table-column>
      <el-table-column prop="name" label="商品名称"></el-table-column>
      <el-table-column prop="code" label="商品编码"></el-table-column>
      <el-table-column prop="spec" label="商品规格" width="90px"></el-table-column>
      <el-table-column prop="retailPrice" label="零售价" width="100px"></el-table-column>
      <el-table-column prop="purchasePrice" label="进货价" width="100px"></el-table-column>
      <el-table-column prop="storageNum" label="库存数量" width="120px"></el-table-column>
      <el-table-column prop="supplierName" label="供应商"></el-table-column>
      <el-table-column label="操作">
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

    <!-- 弹出对话框 -->
    <el-dialog title="选择供应商" :visible.sync="dialogSupplierVisible" width="500px">
      <supplier :isDialog="true" @option-supplier="optionSupplier"></supplier>
    </el-dialog>

    <!-- 弹出新增窗口,dialogFormVisible为true时窗口会被弹出 -->
    <el-dialog title="商品编辑" :visible.sync="dialogFormVisible" width="500px">
      <el-form
        :rules="rules"
        ref="pojoFrom"
        :model="pojo"
        label-width="100px"
        label-position="right"
        style="width:400px"
      >
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="pojo.name"></el-input>
        </el-form-item>
        <el-form-item label="商品编码" prop="code">
          <el-input v-model="pojo.code"></el-input>
        </el-form-item>
        <el-form-item label="商品规格" prop="spec">
          <el-input v-model="pojo.spec"></el-input>
        </el-form-item>
        <el-form-item label="零售价" prop="retailPrice">
          <el-input v-model="pojo.retailPrice"></el-input>
        </el-form-item>
        <el-form-item label="进货价" prop="purchasePrice">
          <el-input v-model="pojo.purchasePrice"></el-input>
        </el-form-item>
        <el-form-item label="库存数量" prop="storageNum">
          <el-input v-model="pojo.storageNum"></el-input>
        </el-form-item>
        <el-form-item label="供应商" prop="supplierName">
          <el-input
            readonly
            @click.native="editOptionSupplier"
            placeholder="选择供应商"
            v-model="pojo.supplierName"
          ></el-input>
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
import goodsApi from "../../api/goods";
import Supplier from "../supplier";
export default {
  created() {
    this.fetchData();
  },
  components: {
    Supplier
  },
  data() {
    return {
      list: [],
      pageSize: 10,
      currentPage: 1,
      total: 0,
      searchMap: {
        name: "",
        code: "",
        supplierName: ""
      },
      dialogSupplierVisible: false, //弹出供应商对话框
      dialogFormVisible: false, //编辑窗口
      pojo: {
        id:null,
        name: "",
        code: "",
        spec: "",
        retailPrice: "",
        purchasePrice: "",
        storageNum: "",
        supplierName: "",
        supplierId:null
      },
      isEdit: false, //是否为编辑窗口
      rules: {
        name: [
          { required: true, message: "商品名称不能为空", trigger: "blur" }
        ],
        code: [
          { required: true, message: "商品编码不能为空", trigger: "blur" }
        ],
        retailPrice: [
          { required: true, message: "零售价不能为空", trigger: "blur" }
        ],
        purchasePrice: [
          { required: true, message: "进货价不能为空", trigger: "blur" }
        ],
      }
    };
  },
  methods: {
    fetchData() {
      goodsApi
        .search(this.currentPage, this.pageSize, this.searchMap)
        .then(response => {
          const resp = response.data;
          //   console.log(resp.data.rows, resp.data.total);
          this.list = resp.data.rows;
          this.total = resp.data.total;
        });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.fetchData();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.fetchData();
    },
    optionSupplier(currentRow) {
      // console.log("parent:",currentRow);    
      if (this.isEdit) {
        //是编辑窗口打开的供应商
        this.pojo.supplierName = currentRow.name
        this.supplierId = currentRow.id
      } else {
        //是查询区域打开的供应商
        this.searchMap.supplierName = currentRow.name;
        this.searchMap.supplierId = currentRow.id;
      }
      this.dialogSupplierVisible = false;
      this.isEdit = false
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
          goodsApi.add(this.pojo).then(response => {
            const resp = response.data;
            if (resp.flag) {
              this.fetchData()
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
    editOptionSupplier() {
      this.isEdit = true; //通过编辑窗口打开的选择供应商
      this.dialogSupplierVisible = true;
    },
    handleEdit(id) {
      //   console.log("handleEdit", id);
      this.handleAdd();
      goodsApi.getById(id).then(response => {
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
    updateData(formname) {
      console.log(this.pojo.id)
      this.$refs[formname].validate(valid => {
        if (valid) {
          goodsApi.update(this.pojo).then(response => {
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
    handleDelete(id) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          goodsApi.deleteById(id).then(response => {
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
  }
};
</script>

<style>
</style>