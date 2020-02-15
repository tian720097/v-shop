<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <!-- 
            v-model 绑定查询条件
            clearable 是否显示清空按钮
            @clear 在点击由 clearable 属性生成的清空按钮时触发
            @change仅在输入框失去焦点或用户按下回车时触发
           -->
          <el-input placeholder="请输入内容"
                    size="small"
                    v-model="queryParams.query"
                    clearable
                    @clear="getUserList"
                    @change="getUserList">
            <el-button slot="append"
                       icon="el-icon-search"
                       @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="success"
                     size="small"
                     @click="userFormVisible = true">添加用户</el-button>
        </el-col>
      </el-row>

      <template>
        <el-table :data="userList"
                  stripe
                  style="width: 100%">
          <el-table-column prop="username"
                           label="姓名"
                           width="180">
          </el-table-column>
          <el-table-column prop="email"
                           label="邮箱"
                           width="180">
          </el-table-column>
          <el-table-column prop="mobile"
                           label="电话">
          </el-table-column>
          <el-table-column prop="role_name"
                           label="角色">
          </el-table-column>
          <el-table-column label="状态">
            <!-- 作用域插槽  -->
            <template slot-scope="scope">
              <el-switch v-model="scope.row.mg_state"
                         active-color="#13ce66"
                         inactive-color="#ff4949"
                         @change="stateChange(scope.row.id,scope.row.mg_state)">
              </el-switch>
            </template>

          </el-table-column>
          <el-table-column label="操作"
                           width="180px">
            <template slot-scope="scope">
              <!-- 修改操作 -->
              <el-button type="primary"
                         icon="el-icon-edit"
                         size="mini"
                         @click="showUpdateForm(scope.row.id)"></el-button>
              <!-- 删除操作 -->
              <el-button type="danger"
                         icon="el-icon-delete"
                         size="mini"
                         @click="deleteUser(scope.row.id)"></el-button>
              <!-- 设置按钮 -->
              <el-button type="warning"
                         icon="el-icon-setting"
                         size="mini"></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
                       :current-page="queryParams.pagenum"
                       :page-sizes="[1, 2, 4, 6]"
                       :page-size="queryParams.pagesize"
                       layout="total, sizes, prev, pager, next, jumper"
                       :total="total">
        </el-pagination>
      </template>
    </el-card>
    <!-- 添加用户对话框 -->
    <el-dialog title="用户信息编辑"
               :visible.sync="userFormVisible"
               @close="closeUserForm">
      <el-form :model="userForm"
               :rules="userFormRules"
               ref="userFormRef">
        <el-form-item label="用户名"
                      :label-width="formLabelWidth"
                      prop="username">
          <el-input v-model="userForm.username"
                    autocomplete="off"
                    ref="usernameRef"
                    :disabled="usernameIsEdit "
                    placeholder="请输入您的用户名"
                    prefix-icon="el-icon-user"></el-input>
        </el-form-item>
        <el-form-item label="密码"
                      :label-width="formLabelWidth"
                      v-show="isShowPassword"
                      prop="password">
          <el-input v-model="userForm.password"
                    v-show="isShowPassword"
                    type="password"
                    autocomplete="off"
                    placeholder="请输入您的密码"
                    prefix-icon="el-icon-key"></el-input>
        </el-form-item>
        <el-form-item label="邮箱"
                      :label-width="formLabelWidth"
                      prop="email">
          <el-input v-model="userForm.email"
                    autocomplete="off"
                    type="email"
                    placeholder="请输入您的邮箱"
                    prefix-icon="el-icon-message"></el-input>
        </el-form-item>
        <el-form-item label="电话"
                      :label-width="formLabelWidth"
                      prop="mobile">
          <el-input v-model="userForm.mobile"
                    autocomplete="off"
                    type="tel"
                    placeholder="请输入您的电话"
                    prefix-icon="el-icon-mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="userFormVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="submitUserForm(userForm.id)">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {

    //自定义邮箱和手机号码的验证规则
    //验证邮箱的规则
    var checkEmail = (rule, value, callback) => {
      const regEmail = /^\w+@\w+(\.\w+)+$/
      if (regEmail.test(value)) {
        return callback()
      }
      //返回一个错误提示
      callback(new Error('请输入合法的邮箱'))
    };
    //验证手机号码的规则
    var checkMobile = (rule, value, callback) => {
      const regMobile = /^1[34578]\d{9}$/
      if (regMobile.test(value)) {
        return callback()
      }
      //返回一个错误提示
      callback(new Error('请输入合法的手机号码'))
    };
    return {
      //获取查询用户信息的参数
      queryParams: {
        // 查询的条件
        query: "",
        pagenum: 1,//当前页码
        pagesize: 2//每页显示记录数
      },
      //保存请求回来的用户列表数据
      userList: [],
      total: 0,
      //是否显示添加用户弹出窗
      userFormVisible: false,
      //绑定表单数据
      userForm: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      //用户名是否可编辑
      usernameIsEdit: false,
      //密码框是否显示
      isShowPassword: true,
      formLabelWidth: '120px',
      // 添加表单的验证规则对象
      userFormRules: {
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '用户名在3~10个字符之间',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '用户名在6~15个字符之间',
            trigger: 'blur'
          }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, message: '邮箱格式不正确，请重新输入', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: checkMobile, message: '手机号码不正确，请重新输入', trigger: 'blur' }
        ]
      }
    }

  },
  created () {
    this.getUserList();
  },
  methods: {
    submitUserForm (id) {
      //id不为空 则是修改信息
      if (id != null) {
        //修改时 只是修改了邮箱和电话两个字段 此时只需要校验修改的字段，因此此处使用validateField验证部分字段
        this.$refs.userFormRef.validateField(["email", "mobile"], async errorMsg => {
          if (errorMsg) {
            this.$message.error("请检查输入的用户信息是否完整");
            return;
          } else {
            //发送修改请求 携带修改项数据
            const { data: res } = await this.$http.put(`users/${id}`, {
              email: this.userForm.email,
              mobile: this.userForm.mobile,
            });
            if (res.meta.status !== 200) {
              this.$message.error("修改用户信息失败")
              return;
            } else {
              this.$message.success("用户信息修改成功")
              this.userFormVisible = false;
              this.$refs.userFormRef.resetFields();
              //修改成功之后 重新回去数据列表
              this.getUserList();
            }
          }
        })
      } else {//id为空 则是新增数据
        this.$refs.userFormRef.validate(async (vaild) => {
          if (!vaild) {
            this.$message.error("请检查输入的用户信息是否完整")
          } {
            const { data: res } = await this.$http.post("users", this.userForm);
            if (res.meta.status !== 201) {
              this.$message.error("保存用户信息失败")
            } else {
              this.$message.success("用户信息保存成功")
              this.userFormVisible = false;
              this.$refs.userFormRef.resetFields();
              this.getUserList();
            }
          }
        })
      }
    },
    closeUserForm () {
      this.$refs.userFormRef.resetFields();
    },
    async getUserList () {
      const { data: res } = await this.$http.get("users", { params: this.queryParams });
      if (res.meta.status != 200) {
        this.$message.error("查询用户列表失败");
      } else {
        this.userList = res.data.users;
        this.total = res.data.total;
      }
    },
    handleSizeChange (pageSize) {
      //pagesize改变时触发，当pagesize发生改变的时候，我们应该
      //以最新的pagesize来请求数据并展示数据
      this.queryParams.pagesize = pageSize;
      //重新按照pagesize发送请求，请求最新的数据
      this.getUserList();
    },
    handleCurrentChange (currentPage) {
      //页码发生改变时触发当currentPage发生改变的时候，我们应该
      //以最新的currentPage页码来请求数据并展示数据
      this.queryParams.pagenum = currentPage;
      //重新按照currentPage发送请求，请求最新的数据
      this.getUserList();
    },
    async stateChange (id, state) {
      const { data: res } = await this.$http.put(`users/${id}/state/${state}`)
      if (res.meta.status !== 200) {
        this.$message.error("修改状态失败");
      }
    },
    // 显示编辑对话框
    async showUpdateForm (id) {
      //根据ID查询当前需要编辑的用户的数据
      const { data: res } = await this.$http.get(`users/${id}`);
      if (res.meta.status !== 200) {
        this.$message.error("获取用户信息失败");
      } else {
        //获取用户数据之后 将数据绑定到表单 
        this.userForm = res.data;
        //用户名不可编辑
        this.usernameIsEdit = true;
        //密码框不显示
        this.isShowPassword = false;
        //显示用户表单对话框
        this.userFormVisible = true;
      }
    },
    //删除用户
    deleteUser (id) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {//确定 则发送删除请求
        const { data: res } = await this.$http.delete(`users/${id}`);
        if (res.meta.status === 200) {
          this.$message.success("删除用户成功");
        } else {
          this.$message.error("删除用户失败");
        }
        this.getUserList();//重新获取数据
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });

      });
    }
  }
}
</script>

<style>
</style>