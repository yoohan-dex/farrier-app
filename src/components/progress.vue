<template>
  <div class="progress">
    <div class="bar"></div>
    <div class="bar progress-color-bar" :style="{width: len + '%'}"></div>
  </div>
</template>
<script>
export default {
  props: ['total', 'current'],
  computed: {
    len() {
      return (this.current / this.total) * 100
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../style/var.scss';

.progress {
  position: relative;
}
.bar {
  width: 100%;
  height: 8px;
  background: $progressBackground;

  border-radius: 4px;
}

.progress-color-bar {
  position: absolute;
  top: 0;
  left: 0;
  background-image: $progressColor;
  z-index: 2;
  transition: 0.2s ease;
}
</style>

