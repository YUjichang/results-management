<template>
  <div class="app-container">
    <!-- 工具栏  -->
    <div class="filter-container">
      <el-input v-model="listQuery.student_name" placeholder="姓名" prefix-icon="el-icon-search" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.class_name" placeholder="班级名称" clearable style="width: 150px" class="filter-item">
        <el-option v-for="item in classsNameOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select v-model="listQuery.name" placeholder="考试名称" clearable style="width: 150px" class="filter-item">
        <el-option v-for="item in resultsNameOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        添加
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        导出
      </el-button>
    </div>

    <div class="filter-container">
      <label class="radio-label" style="padding-left:0;">分数范围： </label>
      <el-input v-model="listQuery.min_score" placeholder="最小分值" :disabled="showLevel" style="width: 120px;margin:15px 10px 0 0" class="filter-item" @keyup.enter.native="handleFilter" />
      <label class="radio-label" style="padding-left:0;">- </label>
      <el-input v-model="listQuery.max_score" placeholder="最大分值" :disabled="showLevel" style="width: 120px;margin:15px 10px 0 10px" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-checkbox v-model="showLevel" class="filter-item" style="margin-top:15px;" @change="handleChangeLevel">
        评级
      </el-checkbox>
      <el-select v-model="listQuery.level" placeholder="评级" multiple :disabled="showLevel?false:true" style="width: 200px;margin:15px 15px 0 15px" class="filter-item">
        <el-option v-for="item in levelOptions" :key="item" :label="item" :value="item" />
      </el-select>
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
      <el-table-column align="center" label="班级名称" width="120">
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
      <el-table-column v-for="item of resultsNameInTable" :key="item" :prop="item" :label="item" align="center" />
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" :disabled="resultsNameInTable.length===1?false:true" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button size="mini" type="danger" :disabled="resultsNameInTable.length===1?false:true" @click="handleDelete(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="fetchData" />

    <!-- 弹窗界面 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="80px" style="width: 400px; margin-left:50px;">
        <el-form-item label="姓名" prop="students_name">
          <el-input v-model="temp.students_name" />
        </el-form-item>
        <el-form-item label="班级名称" prop="students_class_name">
          <el-select v-model="temp.students_class_name" class="filter-item" placeholder="Please select">
            <el-option v-for="item in classsNameOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="考试名称" prop="result_name">
          <el-input v-model="temp.result_name" />
        </el-form-item>
        <el-form-item label="分数" prop="result_score">
          <el-input v-model="temp.result_score" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确定
        </el-button>
      </div>
    </el-dialog>

    <el-dialog title="提示" :visible.sync="deleteVisible" width="30%">
      <span>确认删除？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="deleteData">
          确认
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getResults, exportResults, createResults, updateResults, deleteResults, getId } from '@/api/results/table'
import { getClasses } from '@/api/classes/table'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'

export default {
  name: 'ResultsTable',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        name: undefined,
        class_name: undefined,
        student_name: undefined,
        is_level: 0,
        level: undefined,
        min_score: undefined,
        max_score: undefined
      },
      classsNameOptions: [],
      resultsNameOptions: [],
      levelOptions: ['A', 'B', 'C', 'D'],
      resultsNameInTable: [],
      showLevel: false,
      temp: {
        result_id: undefined,
        students_name: '',
        students_class_name: '',
        result_score: '',
        result_name: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      rules: {
        students_name: [{ required: true, message: 'student name is required', trigger: 'blur' }],
        students_class_name: [{ required: true, message: 'classes name is required', trigger: 'change' }],
        result_name: [{ required: true, message: 'result name is required', trigger: 'blur' }],
        result_score: [{ required: true, message: 'result core is required', trigger: 'blur' }]
      },
      downloadLoading: false,
      deleteVisible: false
    }
  },
  created() {
    this.fetchData()
    this.handleFetchClass()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getResults(this.listQuery).then(response => {
        this.list = response.data
        this.total = response.total
        this.resultsNameOptions = response.total_results
        this.resultsNameInTable = response.current_results
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      if (this.listQuery.min_score) {
        const reg = new RegExp('^\\d+$').test(this.listQuery.min_score)
        if (!reg) {
          this.$message.error('分数请输入正整数')
          return false
        }
      }
      if (this.listQuery.max_score) {
        const reg = new RegExp('^\\d+$').test(this.listQuery.max_score)
        if (!reg) {
          this.$message.error('分数请输入正整数')
          return false
        }
      }
      this.fetchData()
    },
    handleRefresh() {
      this.listQuery.page = 1
      this.listQuery.name = ''
      this.fetchData()
    },
    handleChangeLevel() {
      this.listQuery.is_level = this.listQuery.is_level === 0 ? 1 : 0
      this.listQuery.min_score = ''
      this.listQuery.max_score = ''
      this.fetchData()
    },
    resetTemp() {
      this.temp = {
        result_id: undefined,
        students_name: '',
        students_class_name: '',
        result_score: '',
        result_name: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const config = {
            headers: { 'Content-Type': 'multipart/form-data' }
          }
          const formdata = new FormData()
          formdata.append('name', this.temp.result_name)
          formdata.append('class_name', this.temp.students_class_name)
          formdata.append('student_name', this.temp.students_name)
          formdata.append('score', this.temp.result_score)
          createResults(formdata, config).then(() => {
            this.fetchData()
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDownload() {
      this.downloadLoading = true
      exportResults(this.listQuery).then(response => {
        const blob = new Blob([response], {
          type: 'application/vnd.ms-excel'
        })
        console.log(blob)
        const fileName = 'statistics_' + Date.parse(new Date()) + '.xlsx'
        if (window.navigator.msSaveOrOpenBlob) {
          navigator.msSaveBlob(blob, fileName)
        } else {
          var link = document.createElement('a')
          link.href = window.URL.createObjectURL(blob)
          link.download = fileName
          link.click()
          window.URL.revokeObjectURL(link.href)
        }
        this.downloadLoading = false
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.$set(this.temp, 'result_name', this.resultsNameInTable[0])
      this.$set(this.temp, 'result_score', row[this.resultsNameInTable[0]])
      const idQuery = { 'name': this.temp.result_name, 'student_name': this.temp.students_name, 'class_name': this.temp.students_class_name }
      this.handleGetId(idQuery)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          const config = {
            headers: { 'Content-Type': 'multipart/form-data' }
          }
          const formdata = new FormData()
          formdata.append('name', tempData.result_name)
          formdata.append('class_name', tempData.students_class_name)
          formdata.append('student_name', tempData.students_name)
          formdata.append('score', tempData.result_score)
          updateResults(tempData.result_id, formdata, config).then(() => {
            this.handleRefresh()
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row) {
      this.temp = Object.assign({}, row)
      this.temp.result_name = this.resultsNameInTable[0]
      const idQuery = { 'name': this.temp.result_name, 'student_name': this.temp.students_name, 'class_name': this.temp.students_class_name }
      this.handleGetId(idQuery)
      this.deleteVisible = true
    },
    deleteData(row) {
      const tempData = Object.assign({}, this.temp)
      deleteResults(tempData.result_id).then(() => {
        this.deleteVisible = false
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
        this.handleRefresh()
      })
    },
    handleFetchClass() {
      getClasses().then(response => {
        response.data.forEach(item => {
          this.classsNameOptions.push(item.classes_name)
        })
      })
    },
    handleGetId(query) {
      getId(query).then(response => {
        this.temp.result_id = response.result_id
      })
    }
  }
}
</script>
