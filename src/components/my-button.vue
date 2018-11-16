<template>
  <div :class="['my-button', 'answer-padding']">
    <button :open-type="openType" @click="onNativeClick" :class="['button-default-size', {'button-light-size': type === 'light'}]">
      <div :class="['content', {'content-light': type === 'light', 'content-center': type !== 'answer'}]">
        <img v-if="icon === 'favor'" class="icon" src="/static/assets/icons/favor.svg" alt="">
        <img v-if="icon === 'wrong'" class="icon" src="/static/assets/icons/wrong.svg" alt="">
        <div v-if="type === 'answer'" :class="['answer-label', { 'answer': type === 'answer','answer-active': active}]">
          {{['A', 'B', 'C', 'D', 'E', 'F', 'G'][answer]}}
        </div>
        <div v-if="text" :class="['text', {'light': type === 'light', 'answer': type === 'answer', 'answer-active': active}]">{{text}}</div>
      </div>
    </button>
    <div v-if="!noShadow || active" :class="['shadow-block','button-default-size', {'shadow-light-block': type === 'light' && type !== 'answer', 'button-light-size': type === 'light', 'shadow-block-ani': hovering, 'shadow-alert-block': alert}]"></div>
  </div>
</template>
<script>
export default {
  /**
   * text
   * type?: default, light, answer
   * icon?: favor wrong
   * noShadow?: boolean
   */
  props: ['text', 'type', 'icon', 'size', 'onClick', 'noShadow', 'answer', 'active', 'questionIdx', 'alert', 'openType'],
  data() {
    return {
      hovering: false
    }
  },
  mounted() {
  },
  methods: {
    onNativeClick() {
      if (!this.hovering && !this.active) {
        this.hovering = true
        setTimeout(() => {
          this.hovering = false
        }, 300)
      }
      this.onClick && this.onClick(this.answer, this.questionIdx)
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../style/var.scss';
* {
  box-sizing: border-box;
}
.my-button {
  position: relative;
  width: 100%;
  button {
    width: calc(100% - 15px);
    border: 3px solid $lineColor;
    background: transparent;
    padding-bottom: 2px;
    z-index: 2;
    display: flex;
    align-items: center;
  }

  .shadow-block {
    position: absolute;

    transition: 0.3s ease;
    transform: translate(13px, 5px);
    top: 0;
    left: 0;

    width: calc(100% - 15px);
    background: $primaryColor;
  }
  .shadow-light-block {
    background: $primaryLightColor;
  }
  .shadow-alert-block {
    background: $AlertColor;
  }

  .shadow-block-ani {
    transform: translate(10px, 0);
  }

  .button-default-size {
    height: 55px;
    border-radius: 55px;
  }

  .button-light-size {
    height: 44px;
    border-radius: 44px;
  }
}

.content {
  display: flex;
  align-items: center;
  width: 100%;

  .text {
    font-size: 20px;
    color: $primaryFontColor;
    font-weight: bold;
    line-height: 1.5;
  }

  .light {
    color: $lineColor;
    font-size: 19px;
  }
  .answer-label {
    font-weight: bold;
    margin: 0 10px;
  }
  .answer {
    color: $lineColor;
    font-size: 15px;
  }
  .answer-active {
    color: $primaryFontColor;
  }
}
.content-center {
  justify-content: center;
}

.content-light {
  height: 40px;
}

.icon {
  width: 30px;
  height: 30px;
  margin-right: 5px;
}
.answer-padding {
  margin-bottom: 15px;
}
</style>

