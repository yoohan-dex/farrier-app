<template>
  <div>
    <div class="title">
      <img mode="widthFix" class="title" src="/static/assets/images/title.svg" alt="">
    </div>
    <div class="wrapper">
      <div class="subwrapper">
        <myButton :text="'错题集'" :type="'light'" :icon="'wrong'" :onClick="waitForFeature"></myButton>
        <myButton :text="'收藏集'" :type="'light'" :icon="'favor'" :onClick="waitForFeature"></myButton>
      </div>
      <myButton :text="'开始做题'" :onClick="gotoQuestions"></myButton>
    </div>
  </div>
</template>

<script>
import card from '@/components/card'
import myButton from '@/components/my-button'
export default {
  components: {
    card,
    myButton
  },
  onShareAppMessage() {
    return ({
      title: '执兽助考神器',
      path: '/pages/index/index'
    })
  },
  methods: {
    gotoQuestions() {
      const url = '../questions/index'
      wx.navigateTo({ url })
    },
    waitForFeature() {
      wx.showToast({
        icon: 'none',
        title: '此功能暂未开放 敬请期待'
      })
    }
  },

  created() {
    // 调用应用实例的方法获取全局数据
  }
}
</script>

<style lang="scss" scoped>
@import '../../style/var.scss';
div {
  box-sizing: border-box;
}
.title {
  width: 100%;
  background: $primaryColor;
}

.wrapper {
  width: 100%;
  padding: 30px 10px;

  .subwrapper {
    padding: 20px 0;
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
