<template>
  <div class="result-container">
    <div class="navigator">{{navigator}}</div>
    <div class="title">{{title}}</div>
    <div class="total">{{totalText}}</div>
    <div class="right">{{rightText}}</div>
    <div class="wrong" v-if="wrong > 0">{{wrongText}}</div>
    <div class="wrong" v-else>全部正确！</div>

    <myButton :text="continueText" :onClick="goBack"></myButton>
    <div class="space"></div>
    <myButton :openType="'share'" :text="shareText" :type="'light'"></myButton>
  </div>
</template>
<script>
import {mapMutations} from 'vuex'
import myButton from '@/components/my-button'
export default {
  data() {
    return ({
      navigator: '执兽助考神器',
      title: '完成这次训练',
      continueText: '开始下一轮答题',
      shareText: '分享给朋友',
      total: '',
      right: '',
      wrong: ''
    })
  },
  components: {
    myButton
  },
  computed: {
    totalText() {
      return `这次完成了 ${this.total} 道题`
    },
    rightText() {
      return `正确答对 ${this.right} 道题`
    },
    wrongText() {
      return `还有 ${this.wrong} 道题没有答对或完全答对`
    }
  },
  onShareAppMessage() {
    return ({
      title: '执兽助考神器',
      path: '/pages/index/index'
    })
  },
  methods: {
    ...mapMutations('question', ['removeNormal']),
    goBack() {
      this.removeNormal()
      wx.navigateBack({
        delta: 1
      })
    }
  },
  onLoad(o) {
    this.wrong = o.wrong || 5
    this.right = o.right || 15
    this.total = o.total || 20
  }
}
</script>
<style lang="scss" scoped>
@import '../../style/var.scss';

.result-container {
  box-sizing: border-box;
  padding: 50px 20px 40px;
  position: absolute;
  width: 100%;
  height: 100%;
}

.title,
.right,
.total,
.wrong {
  font-size: 18px;
  margin-bottom: 20px;
  color: $primaryColor;
}
.navigator {
  font-size: 25px;
  font-weight: bold;
  color: $lineColor;
  margin-bottom: 10px;
}
.title {
  font-size: 25px;
  font-weight: bold;
}
.wrong {
  margin-bottom: 40px;
}
.space {
  width: 100%;
  height: 10px;
}
</style>


