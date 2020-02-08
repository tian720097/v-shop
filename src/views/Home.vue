<template>
  <el-button type="danger"
             plain
             @click="quit">安全退出</el-button>
</template>

<script>
export default {
  name: "home",
  methods: {
    quit () {
      window.sessionStorage.clear();
      this.$router.push("/login")
    }
  }
}
</script>

<style>
</style>