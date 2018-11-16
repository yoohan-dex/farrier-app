<template>
  <div :class="['result-panel', {down: !up, show}]">
    <div class="indicator" @click="handleUp(!up)">
      <image v-if="!up" class="indicator-image" src="/static/assets/icons/icon-up.svg"></image>
      <image v-else class="indicator-image" src="/static/assets/icons/icon-down.svg"></image>
    </div>
    <div class="title">
      {{titleText}}
    </div>
    <div class="answers">
      <myButton :text="result.rightAnswerText" :active="true" :type="'answer'"></myButton>
      <myButton v-if="!right" :text="result.selectedAnswerText" :alert="true" :active="true" :type="'answer'"></myButton>
    </div>
    <scroll-view scroll-y class="analysis">
      {{result.analysis}}
    </scroll-view>
    <div class="wrapper">
      <myButton :text="nextText" :onClick="gotoNext"></myButton>
      <div class="subwrapper" v-if="result.completed">
        <myButton :text="sub1" :type="'light'" :icon="'wrong'" :onClick="waitForFeature"></myButton>
        <myButton :text="sub2" :type="'light'" :icon="'favor'" :onClick="waitForFeature"></myButton>
      </div>
    </div>
  </div>
</template>
<script>
import myButton from '@/components/my-button'
export default {
  /**
   * right boolean
   * analysis string
   * show boolean
   * next function
   * up boolean
   * selectedAnswerText string
   * rightAnswer string
   * final boolean
   * handleUp function
   * completed boolean
   */

  /** {
       *  questionId: number
       *  type: number
       *  selectedAnswerId: number
       *  selectedAnswerText: string
       *  rightAnswerId: number
       *  rightAnswerText: string
       *  analysis: string | undefined
       * }
   */
  props: ['result', 'show', 'next', 'up', 'final', 'handleUp', 'goResult'],
  components: {
    myButton
  },
  data() {
    return {
      sub1: '不再出现',
      sub2: '收藏'
    }
  },
  computed: {
    nextText() {
      if (this.final) {
        return '完成这次训练'
      }
      return this.result.completed ? '下一题' : '下一小题'
    },
    titleText() {
      return this.right ? '正确' : '错误'
    },
    right() {
      const { selectedAnswerId, rightAnswerId } = this.result
      const right = selectedAnswerId === rightAnswerId
      return right
    }
  },
  updated() {
  },
  methods: {
    /**
     * down and wait for 0.3s to disappear
     * call the props.next function
     */
    waitForFeature() {
      wx.showToast({
        icon: 'none',
        title: '此功能暂未开放 敬请期待'
      })
    },
    gotoNext() {
      if (this.up) {
        this.handleUp()
      }
      if (this.final) {
        this.goResult()
      } else {
        setTimeout(() => {
          this.next()
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../style/var.scss';
.result-panel {
  display: none;

  box-sizing: border-box;
  position: fixed;
  width: 94%;
  left: 3%;
  bottom: 15px;
  border-radius: 10px;
  background: white;
  color: $lineColor;

  transition: 0.4s ease;
  transform: translateY(0px);
  z-index: 100;
  border: 3px solid $lineColor;
}

.show {
  display: block;
}
.indicator {
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;

  .indicator-image {
    width: 30px;
    height: 30px;
  }
}

.title {
  width: 100%;
  font-size: 30px;
  font-weight: bold;
  color: $lineColor;
  padding-left: 30px;
  margin-bottom: 10px;
}

.analysis {
  box-sizing: border-box;
  width: 100%;
  height: 150px;
  padding: 20px;
  padding-bottom: 0;
  font-size: 16px;
  color: $lineColor;
}

.down {
  transform: translateY(calc(100% - 35px));
}
.wrapper {
  width: 100%;
  padding: 30px 10px;
  box-sizing: border-box;

  .subwrapper {
    padding: 20px 0;
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
  }
}
</style>

