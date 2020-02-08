<template>
  <div class="login_container">
    <!-- 登录盒子  -->
    <div class="login_box">
      <!-- 头像 -->
      <div class="img_box">
        <img src="@/assets/tx.jpg"
             alt="">
      </div>
      <!-- 登录表单 -->
      <el-form label-width="0px"
               class="login_form"
               :model="loginForm"
               :rules="loginRules"
               ref="loginFormRef">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input prefix-icon="el-icon-user"
                    v-model="loginForm.username"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input prefix-icon="el-icon-lock"
                    v-model="loginForm.password"></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btns">
          <el-button type="primary"
                     @click="login">登录</el-button>
          <el-button type="info"
                     @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'login',

  data () {
    return {
      // 数据绑定
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      loginRules: {
        username: [
          { required: true, message: '请输入登录名称', trigger: 'blur' },
          { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {

    login () {
      //定义局部变量_this指向this
      let _this = this;
      this.$refs.loginFormRef.validate(async function (valideted, object) {
        if (!valideted) {
          return;
        }
        //发送登录请求 异步请求此处需要使用await 及外层函数需要使用async  此处不能直接使用this
        const { data: res } = await _this.$http.post("login", _this.loginForm);
        if (res.meta.status === 200) {
          _this.$message({
            message: '恭喜你，登录成功',
            type: 'success'
          });
          //保存token
          window.sessionStorage.setItem('token', res.data.token)
          //  导航至/home
          _this.$router.push("/home")
        } else {
          _this.$message.error('很遗憾，登录失败');
        }
      })
    },
    reset () {
      /// this=>当前组件对象，其中的属性$refs包含了设置的表单ref
      this.$refs.loginFormRef.resetFields()
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b5b6b;
  height: 100%;
}
.login_box {
  width: 450px;
  height: 300px;
  background: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  .img_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
}
.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
.btns {
  display: flex;
  justify-content: flex-end;
}
</style>
