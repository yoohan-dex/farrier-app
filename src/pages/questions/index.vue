<template>
  <div class="questions-container">
    <questionBoard v-if="normal.length > 0" :questions="normal" :estimate="estimate"></questionBoard>
  </div>
</template>
<script>
import {mapActions, mapState} from 'vuex'
import questionBoard from '@/components/question-board'
import login from '@/store/flyio/login'
export default {
  data() {
    return {
    }
  },
  components: {
    questionBoard
  },
  computed: {
    ...mapState('question', ['normal'])
  },
  async created() {
    await login()
  },
  mounted() {
    if (this.normal.length < 1) {
      this.getNormal()
    }
  },
  updated() {
  },

  methods: {
    ...mapActions('question', ['getNormal', 'estimate'])
  }
}
</script>
<style lang="scss" scoped>
@import '../../style/var.scss';
.questions-container {
  box-sizing: border-box;
  padding: 80px 20px 0;
  position: absolute;
  height: 100%;
  width: 100%;
}
</style>
