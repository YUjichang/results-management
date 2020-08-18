<template>
  <div class="dashboard-container">
    <div class="dashboard-text">{{ name }}, 欢迎你</div>
    <panel-group @handleSetJumpUrl="handleSetJumpUrl" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import PanelGroup from './components/PanelGroup'

const urlPath = {
  classes: {
    path: '/classes/table'
  },
  students: {
    path: '/students/table'
  },
  results: {
    path: '/results/table'
  },
  statistics: {
    path: '/statistics/table'
  }
}

export default {
  name: 'Dashboard',
  components: { PanelGroup },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  methods: {
    handleSetJumpUrl(type) {
      this.$router.push(urlPath[type])
    }
  }
}

</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
