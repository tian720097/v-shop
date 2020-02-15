<template>
  <el-container class="home-container">
    <!-- 顶部布局 -->
    <el-header>
      <div>
        <!-- 网站logo -->
        <img src="@/assets/logo.png"
             alt="电商logo"
             width="61px"
             height="56px">
        <!-- 系统名称 -->
        <span>V—Shop电商后台管理系统</span>
      </div>
      <!-- 退出按钮 -->
      <el-button type="danger"
                 plain
                 @click="quit"
                 size="mini">安全退出</el-button>
    </el-header>
    <!-- 内容布局 -->
    <el-container>
      <!-- 侧边栏布局  isCollapse改变侧边栏的宽度 -->
      <el-aside :width="isCollapse?'64px':'200px'">
        <el-radio-group v-model="isCollapse"
                        style="margin-bottom: 20px;margin-left:5px"
                        fill="#409EFF"
                        size="small">
          <el-radio-button v-show="isCollapse"
                           :label="false">
            <i class="el-icon-d-arrow-right"></i>
          </el-radio-button>
          <el-radio-button v-show="!isCollapse"
                           :label="true">
            <i class="el-icon-d-arrow-left"></i>
          </el-radio-button>
        </el-radio-group>
        <!-- default-active 默认激活 collapse是否收缩  text-color：文本颜色 collapse-transition：收缩动画 unique-opened 展开一个一级菜单-->
        <el-menu :default-active="activeItem"
                 :collapse="isCollapse"
                 text-color="#ffffff"
                 background-color="#333744"
                 :collapse-transition="false"
                 :unique-opened="true"
                 :router="true">
          <el-submenu :index="menu.path"
                      v-for="(menu) in menuList"
                      :key="menu.id">
            <!-- 一级菜单模板 -->
            <template slot="title">
              <i :class="iconsObj[menu.id]"></i>
              <span slot="title">{{menu.authName}}</span>
            </template>
            <el-menu-item :index="menu2.path"
                          v-for="(menu2) in menu.children"
                          :key="menu2.id"
                          @click="saveActiveStatus(menu2.path)">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span slot="title">{{menu2.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 主体结构 -->
      <el-main>
        <router-view>

        </router-view>
      </el-main>
    </el-container>
  </el-container>

</template>

<script>
export default {
  name: "home",
  data () {
    return {
      isCollapse: false,
      menuList: [],
      iconsObj: {
        '125': 'el-icon-user',
        '103': 'el-icon-s-tools',
        '101': 'el-icon-s-goods',
        '102': 'el-icon-s-order',
        '145': 'el-icon-s-data'
      },
      activeItem: ""
    };
  },
  async created () {
    const { data: res } = await this.$http.get("menus");
    if (res.meta.status !== 200) {
      this.$message.error(res.meta.msg);
    } else {
      this.menuList = res.data
    }
    this.activeItem = window.sessionStorage.getItem("activeItem");
  },
  methods: {
    quit () {
      window.sessionStorage.clear();
      this.$router.push("/login")
    },
    saveActiveStatus (activeItem) {
      window.sessionStorage.setItem("activeItem", activeItem);
      this.activeItem = activeItem;
    }

  }
}
</script>

<style lang="less" scoped>
// 整个页面容器
.home-container {
  height: 100%;
}
//头部
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}
//侧边栏
.el-aside {
  background-color: #333744;
  //侧边栏按钮
  .el-menu {
    border-right: none;
  }
}
//中间区域
.el-main {
  background-color: #eaedf1;
}
</style>