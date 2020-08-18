<template>
  <div class="app-container">
    <!-- 工具栏  -->
    <div class="filter-container">
      <ResultnameOption v-model="resultname" />
      <el-select v-model="listQuery.class_name" placeholder="班级名称" clearable style="width: 150px; margin-left: 10px;" class="filter-item">
        <el-option v-for="item in classsNameOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCheckin">
        登记
      </el-button>
    </div>

    <br>

    <!-- 表格 -->
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column align="center" label="班级名称">
        <template slot-scope="scope">
          <span>{{ scope.row.students_class_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="学号" width="80" align="center">
        <template slot-scope="scope">
          {{ scope.row.students_student_number }}
        </template>
      </el-table-column>
      <el-table-column label="姓名" width="120" align="center">
        <template slot-scope="scope">
          {{ scope.row.students_name }}
        </template>
      </el-table-column>

      <el-table-column min-width="300px" label="成绩" align="center">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-input v-model="row.score" class="edit-input" size="small" @blur="confirmEdit(row)" @keyup.enter.native="confirmEdit(row)" />
          </template>
          <span v-else class="link-type" @click="row.edit=!row.edit">{{ row.score }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="Actions" width="300">
        <template slot-scope="{row}">
          <el-button
            v-if="row.edit"
            type="success"
            size="small"
            icon="el-icon-check"
            @click="confirmEdit(row)"
          >
            完成
          </el-button>
          <el-button
            v-else
            type="primary"
            size="small"
            icon="el-icon-edit"
            @click="row.edit=!row.edit"
          >
            编辑
          </el-button>
          <el-button
            v-if="row.edit"
            class="cancel-btn"
            size="small"
            icon="el-icon-refresh"
            type="warning"
            @click="cancelEdit(row)"
          >
            取消
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div align="center">
      <el-button class="filter-item" style="margin-top: 10px;" type="primary" :disabled="onSubmit?true:false" icon="el-icon-finished" @click="handleCreate">
        提交
      </el-button>
    </div>
  </div>
</template>

<script>
import { getResults, createResults } from '@/api/results/table'
import { getClasses } from '@/api/classes/table'
import ResultnameOption from './components/ResultnameOption'

export default {
  name: 'ResultsCheckin',
  components: { ResultnameOption },
  data() {
    return {
      list: null,
      resultname: '',
      listLoading: false,
      onSubmit: true,
      listQuery: {
        name: undefined,
        class_name: undefined,
        student_name: undefined
      },
      classsNameOptions: [],
      temp: {
        result_id: undefined,
        students_name: '',
        students_class_name: '',
        result_score: '',
        result_name: ''
      }
    }
  },
  created() {
    this.handleFetchClass()
  },
  methods: {
    async fetchData() {
      this.listLoading = true
      const { data } = await getResults(this.listQuery)
      this.list = data.map(v => {
        this.$set(v, 'edit', true)
        v.originalScore = v[this.resultname]
        v.score = v[this.resultname]
        return v
      })
      this.listLoading = false
    },
    cancelEdit(row) {
      row.score = row.originalScore
      row.edit = false
      this.$message({
        message: 'The score has been restored to the original value',
        type: 'warning'
      })
    },
    confirmEdit(row) {
      row.edit = false
      row.originalScore = row.score
      this.$message({
        message: 'The score has been edited',
        type: 'success'
      })
    },
    handleCheckin() {
      if (!this.resultname) {
        this.$message.error('请输入考试名称！')
        return false
      }
      if (!this.listQuery.class_name) {
        this.$message.error('请选择班级！')
        return false
      }
      this.fetchData()
      this.onSubmit = false
    },
    handleCreate() {
      for (const x in this.list) {
        this.temp = Object.assign({}, this.list[x])
        this.$set(this.temp, 'result_name', this.resultname)
        if (!this.list[x].score) {
          this.$set(this.temp, 'result_score', '')
        } else {
          this.$set(this.temp, 'result_score', this.list[x].score)
        }
        this.createData()
      }
    },
    createData() {
      const tempData = Object.assign({}, this.temp)
      const config = {
        headers: { 'Content-Type': 'multipart/form-data' }
      }
      const formdata = new FormData()
      formdata.append('name', tempData.result_name)
      formdata.append('class_name', tempData.students_class_name)
      formdata.append('student_name', tempData.students_name)
      formdata.append('score', tempData.result_score)
      createResults(formdata, config).then(() => {
        this.$notify({
          title: '成功',
          message: '提交成功',
          type: 'success',
          duration: 2000
        })
        this.onSubmit = true
      })
    },
    handleFetchClass() {
      getClasses().then(response => {
        response.data.forEach(item => {
          this.classsNameOptions.push(item.classes_name)
        })
      })
    }
  }
}
</script>
