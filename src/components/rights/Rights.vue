<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-table :data="rigthtList"
                border
                style="width: 100%">
        <el-table-column type="index">

        </el-table-column>
        <el-table-column prop="authName"
                         label="权限名称"
                         width="280">
        </el-table-column>
        <el-table-column prop="path"
                         label="路径"
                         width="280">
        </el-table-column>
        <el-table-column prop="level"
                         label="权限等级">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level === '0' "
                    effect="dark">一级</el-tag>
            <el-tag v-else-if="scope.row.level === '1' "
                    type="success"
                    effect="dark">二级</el-tag>
            <el-tag v-else
                    type="danger"
                    effect="dark">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      rigthtList: []
    }
  },
  async created () {
    this.getRithtsList();
  },
  methods: {
    async getRithtsList () {
      const { data: res } = await this.$http.get("rights/list");
      console.log(res)
      if (res.meta.status !== 200) {
        this.$message.error("获取列表失败");
        return;
      }
      this.rigthtList = res.data;

    }
  }

}
</script>

<style>
</style>