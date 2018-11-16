<template>
  <div class="question-board">

    <progress :total="total" :current="done ? total : current"></progress>

    <div v-if="currentQuestion.type !== 3" class="question-content">
      <div class="question-main-content">
        {{currentQuestion.content}}
      </div>
    </div>

    <swiper class="question-swiper" v-if="currentQuestion.type !== 1" :current="currentQuestion.current">
      <block v-for="(question, i) in currentQuestion.questions" :key="i">
        <swiper-item>
          <div :class="['question-sub-content', {'margin-top-20px': currentQuestion.type === 3}]">
            {{question.content}}
          </div>
          <myButton v-if="currentQuestion.type === 2" v-for="(answer, idx) in question.answers" :key="idx" :noShadow="true" :answer="idx" :questionIdx="i" :text="answer.content" :type="'answer'" :onClick="selectAnswer" :active="answer.active"></myButton>
          <myButton v-if="currentQuestion.type === 3" v-for="(answer, idx) in currentQuestion.answers" :key="idx" :noShadow="true" :answer="idx" :questionIdx="i" :text="answer.content" :type="'answer'" :onClick="selectAnswer" :active="answer.active.indexOf(i) !== -1"></myButton>
        </swiper-item>
      </block>
    </swiper>

    <myButton v-if="currentQuestion.type === 1" v-for="(answer, i) in currentQuestion.answers" :key="i" :noShadow="true" :answer="i" :text="answer.content" :type="'answer'" :onClick="selectAnswer" :active="answer.active"></myButton>
    <resultPanel :show="showResult" :up="panelUp" :handleUp="handlePanelUp" :result="willShowResult" :next="gotoNextQuestion" :final="final" :goResult="gotoResult"></resultPanel>
  </div>
</template>
<script>
import progress from '@/components/progress'
import myButton from '@/components/my-button'
import resultPanel from '@/components/result-panel'

export default {
  data() {
    return {
      current: 0,
      done: false,
      confirmed: [],
      /**
       * Array<{
       *  questionId: number
       *  type: number
       *  selectedAnswerId: number
       *  selectedAnswerText: string
       *  rightAnswerId: number
       *  rightAnswerText: string
       *  analysis: string | undefined
       * }>
       */
      result: [],
      pass: 0,
      fail: 0,
      panelUp: false
    }
  },
  props: ['questions', 'estimate'],
  computed: {
    total() {
      return this.questions.length
    },
    currentQuestion() {
      return this.questions[this.current]
    },
    showResult() {
      const currentQuestion = this.questions[this.current]
      let haveSelected
      if (currentQuestion.type === 1) {
        haveSelected = this.confirmed.indexOf(currentQuestion.id) !== -1
      } else if (
        currentQuestion.type === 2 || currentQuestion.type === 3
      ) {
        haveSelected = this.confirmed.indexOf(currentQuestion.questions[currentQuestion.current].id) !== -1
      }
      if (haveSelected) {
        return true
      }
      return false
    },
    willShowResult() {
      if (this.result.length > 0) {
        const currentQuestion = this.questions[this.current]
        const { type } = currentQuestion
        if (type === 1) {
          return this.result[this.current]
        } else {
          const currentExactQuestion = currentQuestion.questions[currentQuestion.current]
          return this.result.find(r => r.questionId === currentExactQuestion.id)
        }
      }
      return {}
    },
    final() {
      return this.result.length === this.confirmed.length
    },
    done() {
      return this.result.length === this.confirmed.length
    }
  },
  components: {
    progress,
    myButton,
    resultPanel
  },
  mounted() {
    this.initialResult()
  },

  /**
   * export class EstimateCommonQuestionDto {
   **  type: 1;
   **  questionId: number;
   **  selectedAnswers: number[];
   *  }
   * export class EstimateSecondQuestionDto {
   **   type: 2;
   **   questionId: number;
   **   subQuestions: {
   **     subQuestionId: number;
   **     selectedAnswers: number[];
   **   }[];
   * }
   * export class EstimateThirdQuestionDto {
   **   type: 3;
   **   questionId: number;
   **   subQuestions: {
   **     subQuestionId: number;
   **     selectedAnswers: number[];
   **   }[];
   * }
   */

  methods: {
    selectAnswer(answerIdx, questionIdx) {
      if (questionIdx === undefined) {
        if (this.confirmed.indexOf(this.currentQuestion.id) === -1) {
          const answer = this.currentQuestion.answers[answerIdx]
          answer.active = true
          this.confirmed.push(this.currentQuestion.id)
          this.estimateQuestion()
          this.computeResult(answer.id)
        }
      } else {
        const {type, answers} = this.currentQuestion
        const subQuestions = this.currentQuestion.questions
        const currentSubQuestion = subQuestions[questionIdx]
        if (this.confirmed.indexOf(currentSubQuestion.id) === -1) {
          if (type === 2) {
            const answer = currentSubQuestion.answers[answerIdx]
            answer.active = true
            this.confirmed.push(currentSubQuestion.id)
            this.computeResult(answer.id)
            const subQuestionIds = subQuestions.map(sq => sq.id)
            const finished = subQuestionIds.every(id => this.confirmed.includes(id))
            if (finished) {
              this.estimateQuestion()
            }
          } else if (type === 3) {
            const answer = answers[answerIdx]
            answer.active.push(questionIdx)
            this.confirmed.push(currentSubQuestion.id)
            this.computeResult(answer.id)
            const subQuestionIds = subQuestions.map(sq => sq.id)
            const finished = subQuestionIds.every(id => this.confirmed.includes(id))
            if (finished) {
              this.estimateQuestion()
            }
          }
        }
      }
    },
    async estimateQuestion() {
      const {type, id: questionId} = this.currentQuestion
      if (type === 1) {
        const selectAnswer = this.currentQuestion.answers.find(a => a.active).id
        const dto = {
          type,
          questionId,
          selectedAnswers: [selectAnswer]
        }
        this.estimateAction(dto)
      } else if (type === 2) {
        const subQuestions = this.currentQuestion.questions.map(subQuestion => ({
          subQuestionId: subQuestion.id,
          selectedAnswers: [subQuestion.answers.find(a => a.active).id]
        }))
        const dto = {
          type,
          questionId,
          subQuestions
        }
        this.estimateAction(dto)
      } else if (type === 3) {
        const subQuestions = this.currentQuestion.questions.map((subQuestion, idx) => {
          try {
          const re = {
            subQuestionId: subQuestion.id,
            selectedAnswers: [this.currentQuestion.answers.find((a, sss) => {
              return a.active.indexOf(idx) !== -1
            }
            ).id]
          }
          return re
          } catch (e) {
            console.log(e)
          }
        })
        const dto = {
          type,
          questionId,
          subQuestions
        }
        console.log('dto', dto)
        console.log('estimate???/')
        this.estimateAction(dto)
      }
    },
    estimateAction(dto) {
      console.log('dto', dto)
      this.estimate(dto)
    },
    initialResult() {
      let result = []
      this.questions.forEach(question => {
        const { type } = question
        if (type === 1) {
          result.push({
            questionId: question.id,
            type: question.type,
            rightAnswerId: parseInt(question.rightAnswer[0], 10),
            rightAnswerText: question.answers.find(
              answer => answer.id === parseInt(question.rightAnswer[0], 10)
            ).content,
            analysis: question.analysis,
            selectedAnswerId: '',
            selectedAnswerText: '',
            completed: false
          })
        } else if (type === 2) {
          console.log(question.id)
          result.push(...question.questions.map((subQ, idx, arr) => ({
            questionId: subQ.id,
            type: subQ.type,
            rightAnswerId:
              parseInt(subQ.rightAnswer[0], 10),
            rightAnswerText: subQ.answers.find(
              answer => answer.id === parseInt(subQ.rightAnswer[0], 10)
            ).content,
            selectedAnswerId: '',
            selectedAnswerText: '',
            analysis: subQ.analysis,
            completed: idx === arr.length - 1
          })))
        } else if (type === 3) {
          result.push(...question.questions.map((subQ, idx, arr) => ({
            questionId: subQ.id,
            type: subQ.type,
            rightAnswerId: parseInt(subQ.rightAnswer[0], 10),
            rightAnswerText:
              question.answers.find(
              answer => answer.id === parseInt(subQ.rightAnswer[0], 10)
            ).content,
            analysis: subQ.analysis,
            selectedAnswerId: '',
            selectedAnswerText: '',
            completed: idx === arr.length - 1
          })))
        }
      })
      this.result = result
       /**
       * Array<{
       *  questionId: number
       *  type: number
       *  selectedAnswerId: number
       *  selectedAnswerText: string
       *  rightAnswerId: number
       *  rightAnswerText: string
       *  analysis: string | undefined
       *  completed: boolean
       * }>
       */
    },
    computeResult(selectAnswer) {
      const {type, id, answers, current, questions} = this.currentQuestion
      if (type === 1) {
        const thisResult = this.result.find(r => r.questionId === id)
        thisResult.selectedAnswerId = selectAnswer
        thisResult.selectedAnswerText = answers.find(answer => answer.id === selectAnswer).content
        thisResult.completed = true
        this.computePass(thisResult)
        this.handlePanelUp(true)
      } else if (type === 2) {
        const subAnswers = questions[current].answers
        const thisResult = this.result.find(r => r.questionId === questions[current].id)
        thisResult.selectedAnswerId = selectAnswer
        thisResult.selectedAnswerText = subAnswers.find(answer => answer.id === selectAnswer).content
        thisResult.completed = questions.every(sq => this.confirmed.includes(sq.id))
        this.computePass(thisResult)
        this.handlePanelUp(true)
      } else if (type === 3) {
        const thisResult = this.result.find(r => r.questionId === questions[current].id)
        thisResult.selectedAnswerId = selectAnswer
        thisResult.selectedAnswerText = answers.find(answer => answer.id === selectAnswer).content
        thisResult.completed = questions.every(sq => this.confirmed.includes(sq.id))
        this.computePass(thisResult)
        this.handlePanelUp(true)
      }
    },
    handlePanelUp(bool) {
      setTimeout(() => { this.panelUp = bool }, 200)
    },
    gotoResult() {
      this.questions.forEach(q => {
        if (q.pass) {
          this.pass += 1
        } else {
          this.fail += 1
        }
      })
      const url = `../result/index?wrong=${this.fail}&right=${this.pass}&total=${this.total}`
      wx.redirectTo({ url })
    },
    computePass(result) {
      if (result.selectedAnswerId === result.rightAnswerId) {
          if (this.currentQuestion.pass !== false) {
            this.currentQuestion.pass = true
          }
        } else {
          this.currentQuestion.pass = false
        }
    },
    gotoNextQuestion() {
      const {type, current, questions} = this.currentQuestion
      if (this.done) {
        this.gotoResult()
      }
      if (type === 1) {
        this.current += 1
      } else {
        if (questions.length === current + 1) {
          this.current += 1
        } else {
          this.currentQuestion.current += 1
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../style/var.scss';

.questions-board {
  padding: 80px 20px 0;
}
.question-content {
  padding: 25px 10px;
  font-weight: bold;
  font-size: 16px;
  color: $lineColor;
  .question-main-content {
    margin-bottom: 10px;
  }
}

.question-sub-content {
  font-weight: bold;
  font-size: 16px;
  color: $lineColor;
  margin-bottom: 20px;
}

.margin-top-20px {
  margin-top: 20px;
}

.question-swiper {
  overflow: auto;
  height: 650px;
}
</style>


