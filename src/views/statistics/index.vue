<template>
  <div class="app-container">
    <!-- 工具栏  -->
    <div class="filter-container">
      <el-input v-model="listQuery.name" placeholder="考试名称" prefix-icon="el-icon-search" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.class_name" placeholder="班级名称" clearable style="width: 150px" class="filter-item">
        <el-option v-for="item in classsNameOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        添加
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-refresh" @click="handleAnalyse">
        更新
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        导出
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
      <el-table-column align="center" label="ID" width="50">
        <template slot-scope="scope">
          <span>{{ scope.row.statistics_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="考试名称">
        <template slot-scope="scope">
          {{ scope.row.statistics_name }}
        </template>
      </el-table-column>
      <el-table-column label="班级名称" width="120" align="center">
        <template slot-scope="scope">
          {{ scope.row.statistics_class_name }}
        </template>
      </el-table-column>
      <el-table-column label="总分" width="80" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.statistics_total_score }}</span>
        </template>
      </el-table-column>
      <el-table-column label="平均分" width="80" align="center">
        <template slot-scope="scope">
          {{ scope.row.statistics_average_score }}
        </template>
      </el-table-column>
      <el-table-column label="班级人数" width="80" align="center">
        <template slot-scope="scope">
          {{ scope.row.statistics_total_number }}
        </template>
      </el-table-column>
      <el-table-column label="考试人数" width="80" align="center">
        <template slot-scope="scope">
          {{ scope.row.statistics_exam_number }}
        </template>
      </el-table-column>
      <el-table-column label="合格人数" width="80" align="center">
        <template slot-scope="scope">
          {{ scope.row.statistics_pass_number }}
        </template>
      </el-table-column>
      <el-table-column label="合格率" width="80" align="center">
        <template slot-scope="scope">
          {{ scope.row.statistics_pass_percent }}
        </template>
      </el-table-column>
      <el-table-column label="A" width="80" align="center">
        <template slot-scope="scope">
          {{ scope.row.statistics_a_number }}
        </template>
      </el-table-column>
      <el-table-column label="A占比" width="80" align="center">
        <template slot-scope="scope">
          {{ scope.row.statistics_a_percent }}
        </template>
      </el-table-column>
      <el-table-column label="B" width="80" align="center">
        <template slot-scope="scope">
          {{ scope.row.statistics_b_number }}
        </template>
      </el-table-column>
      <el-table-column label="B占比" width="80" align="center">
        <template slot-scope="scope">
          {{ scope.row.statistics_b_percent }}
        </template>
      </el-table-column>
      <el-table-column label="C" width="80" align="center">
        <template slot-scope="scope">
          {{ scope.row.statistics_c_number }}
        </template>
      </el-table-column>
      <el-table-column label="C占比" width="80" align="center">
        <template slot-scope="scope">
          {{ scope.row.statistics_c_percent }}
        </template>
      </el-table-column>
      <el-table-column label="D" width="80" align="center">
        <template slot-scope="scope">
          {{ scope.row.statistics_d_number }}
        </template>
      </el-table-column>
      <el-table-column label="D占比" width="80" align="center">
        <template slot-scope="scope">
          {{ scope.row.statistics_d_percent }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="fetchData" />

    <!-- 弹窗界面 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="80px" style="width: 400px; margin-left:50px;">
        <el-form-item label="考试名称" prop="statistics_name">
          <el-input v-model="temp.statistics_name" />
        </el-form-item>
        <el-form-item label="班级名称" prop="statistics_class_name">
          <el-select v-model="temp.statistics_class_name" class="filter-item" placeholder="Please select">
            <el-option v-for="item in classsNameOptions" :key="item" :label="item" :value="item" />
          </el-select>
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
import { getStatistics, exportStatistics, createStatistics, updateStatistics, deleteStatistics, analyseStatistics } from '@/api/statistics/table'
import { getClasses } from '@/api/classes/table'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'

export default {
  name: 'StatisticsTable',
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
        class_name: undefined
      },
      classsNameOptions: [],
      temp: {
        statistics_id: undefined,
        statistics_name: '',
        statistics_class_name: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      rules: {
        statistics_name: [{ required: true, message: 'statustics name is required', trigger: 'blur' }],
        statistics_class_name: [{ required: true, message: 'classes name is required', trigger: 'change' }]
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
      getStatistics(this.listQuery).then(response => {
        this.list = response.data
        this.total = response.total
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.fetchData()
    },
    resetTemp() {
      this.temp = {
        statistics_id: undefined,
        statistics_name: '',
        statistics_class_name: ''
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
          formdata.append('name', this.temp.statistics_name)
          formdata.append('class_name', this.temp.statistics_class_name)
          createStatistics(formdata, config).then(() => {
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
      exportStatistics(this.listQuery).then(response => {
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
          updateStatistics(tempData.statistics_id).then(() => {
            this.fetchData()
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
      this.deleteVisible = true
    },
    deleteData(row) {
      const tempData = Object.assign({}, this.temp)
      deleteStatistics(tempData.statistics_id).then(() => {
        this.deleteVisible = false
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
        this.fetchData()
      })
    },
    handleFetchClass() {
      getClasses().then(response => {
        response.data.forEach(item => {
          this.classsNameOptions.push(item.classes_name)
        })
      })
    },
    handleAnalyse() {
      analyseStatistics().then(response => {
        this.$notify({
          title: '成功',
          message: '重分析成功',
          type: 'success',
          duration: 2000
        })
        this.fetchData()
      })
    }
  }
}
</script>
