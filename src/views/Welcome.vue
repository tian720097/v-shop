<template>
  <div>
    <el-carousel :interval="5000"
                 arrow="always">
      <el-carousel-item v-for="(image,index) in imgs"
                        :key="index">

        <el-image :src="image"></el-image>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
export default {
  data () {
    return {
      imgs: [
        require('@/assets/imgs/1.jpg'),
        require('@/assets/imgs/2.jpg'),
        require('@/assets/imgs/3.jpg')
      ]
    }
  }
}
</script>

<style>
</style>