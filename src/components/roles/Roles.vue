<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-table :data="roleList"
                border
                style="width: 100%">
        <!-- 如果设置了 expand 则显示为一个可展开的按钮 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row v-for="(child1,index1) in scope.row.children"
                    :class="['childBottom',index1==0?'childTop':'']"
                    :key="index1">
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag size="mini"
                        closable
                        @close="removeRightById(scope.row,child1.id)">
                  {{child1.authName}}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二三级权限 -->
              <el-col :span="19">
                <el-row v-for="(child2 ,index2) in child1.children"
                        :key="index2"
                        :class="[index2==0?'':'childTop']">
                  <!-- 渲染二级权限 -->
                  <el-col :span="5">
                    <el-tag size="mini"
                            type="success"
                            closable
                            @close="removeRightById(scope.row,child2.id)">
                      {{child2.authName}}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="19">
                    <!-- 渲染三级权限 -->
                    <el-tag size="mini"
                            type="warning"
                            v-for="(child3 ,index3) in child2.children"
                            :key="index3"
                            closable
                            @close="removeRightById(scope.row,child3.id)">
                      {{child3.authName}}
                    </el-tag>

                  </el-col>
                </el-row>

              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"
                         label="#"
                         width="100">
        </el-table-column>
        <el-table-column prop="roleName"
                         label="角色名称"
                         width="220">
        </el-table-column>
        <el-table-column prop="roleDesc"
                         label="角色描述"
                         width="220">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary"
                       icon="el-icon-search"
                       size="mini">编辑</el-button>
            <el-button type="danger"
                       icon="el-icon-delete"
                       size="mini">删除</el-button>
            <el-button type="warning"
                       icon="el-icon-setting"
                       size="mini"
                       @click="showSetRightDialog(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分配权限对话框 -->
    <el-dialog title="权限分配"
               :visible.sync="dialogVisible"
               width="30%"
               @close="closeBeforeClearTree">
      <el-tree :data="rightTree"
               show-checkbox
               node-key="id"
               :default-expanded-all="true"
               :default-checked-keys="defKeys"
               :props="defaultProps"
               ref="rightTreeRef">
      </el-tree>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="saveAllRight">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      //  角色列表数据
      roleList: [],
      //权限树数据
      rightTree: [],
      //控制分配权限对话框的显示
      dialogVisible: false,
      //树形控件的属性绑定对象
      defaultProps: {
        //设置通过children属性展示子节点信息
        children: 'children',
        //通过label设置树形节点文本展示authName
        label: 'authName'
      },
      //设置树形控件中默认选中的内容
      defKeys: [],
      //保存正在操作的角色id
      roleId: ""
    }
  },
  created () {
    this.getRoleList();
  },
  methods: {
    async getRoleList () {
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200) {
        this.$message.error("获取角色列表失败");
        return;
      } else {
        console.log(res.data);
        this.roleList = res.data;
      }
    },
    async removeRightById (role, rightId) {
      //弹窗提示用户是否要删除
      const confirmResult = await this.$confirm('请问是否要删除该权限', '删除提示', {
        confirmButtonText: '确认删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`);
        if (res.meta.status != 200) {
          this.$message.error("删除角色权限失败");
          return
        } else {
          //无需再重新加载所有权限
          //只需要对现有的角色权限进行更新即可
          role.children = res.data
          // this.getRoleList();
        }
      }).catch(() => {
        this.$message.info("删除角色权限操作已取消");
      })
    },
    async showSetRightDialog (role) {
      //将role.id保存起来以供保存权限时使用
      this.roleId = role.id;
      this.dialogVisible = true;
      const { data: res } = await this.$http.get("rights/tree");
      if (res.meta.status !== 200) {
        this.$message.error("权限树获取失败");
        return;
      } else {
        this.rightTree = res.data;
        //调用getLeafKeys进行递归，将三级权限添加到数组中
        this.getLeafKeys(role, this.defKeys)
      }

    },
    getLeafKeys (node, arr) {
      //该函数会获取到当前角色的所有三级权限id并添加到defKeys中
      //如果当前节点不包含children属性，则表示node为三级权限
      if (!node.children) {
        return arr.push(node.id)
      }
      //递归调用
      node.children.forEach(item => this.getLeafKeys(item, arr))
    },
    //关闭对话框前 清空树的默认选中节点
    closeBeforeClearTree () {
      this.defKeys = []
    },
    async saveAllRight () {
      // 对象中的扩展运算符(...)用于取出参数对象中的所有可遍历属性，拷贝到当前对象之中 合并得到的两个数组
      const keys = [
        ...this.$refs.rightTreeRef.getCheckedKeys(),
        ...this.$refs.rightTreeRef.getHalfCheckedKeys()
      ]
      // 以逗号分割 将数组转化为字符串
      //以 `,` 分割的权限 ID 列表（获取所有被选中、叶子节点的key和半选中节点的key, 包括 1，2，3级节点）
      const idStr = keys.join(",");
      //发送请求修改角色权限 
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: idStr });
      console.log(res)
      if (res.meta.status !== 200) {
        this.$message.error("角色权限修改失败");
        return;
      }
      this.$message.success("角色权限修改成功");
      //重新获取角色列表
      this.getRoleList();
      // 关闭权限对话框
      this.dialogVisible = false;
    }
  }
}
</script>

<style lang="less" scoped>
.childBottom {
  border-bottom: 1px solid #eee;
}
.childTop {
  border-top: 1px solid #eee;
}
.el-tag {
  margin: 7px;
}
.el-row {
  display: flex;
  align-items: center;
}
</style>>
</style>