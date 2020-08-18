<template>
  <div class="app-container">
    <!-- 工具栏  -->
    <div class="filter-container">
      <el-input v-model="listQuery.name" placeholder="姓名" prefix-icon="el-icon-search" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.class_name" placeholder="班级名称" clearable style="width: 150px" class="filter-item">
        <el-option v-for="item in classsNameOptions" :key="item" :label="item" :value="item" />
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
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          <span>{{ scope.row.students_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="学号" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.students_student_number }}
        </template>
      </el-table-column>
      <el-table-column label="姓名" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.students_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否考试" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.students_is_exam | examFilter }}
        </template>
      </el-table-column>
      <el-table-column label="班级名称">
        <template slot-scope="scope">
          {{ scope.row.students_class_name }}
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
        <el-form-item label="姓名" prop="students_name">
          <el-input v-model="temp.students_name" />
        </el-form-item>
        <el-form-item label="学号" prop="students_student_number">
          <el-input v-model="temp.students_student_number" />
        </el-form-item>
        <el-form-item label="是否考试" prop="students_is_exam">
          <el-select v-model="temp.students_is_exam" class="filter-item" placeholder="Please select">
            <el-option v-for="item in calendarExamOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="班级名称" prop="students_class_name">
          <el-select v-model="temp.students_class_name" class="filter-item" placeholder="Please select">
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
import { getStudents, exportStudents, createStudents, updateStudents, deleteStudents } from '@/api/students/table'
import { getClasses } from '@/api/classes/table'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'

// 字典
const calendarExamOptions = [
  { key: '0', display_name: '是' },
  { key: '1', display_name: '否' }
]

// arr to obj, such as { 0 : "是", 1 : "否" }
const calendarExamKeyValue = calendarExamOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'StudentsTable',
  components: { Pagination },
  directives: { waves },
  filters: {
    examFilter(exam) {
      return calendarExamKeyValue[exam]
    }
  },
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
      calendarExamOptions,
      classsNameOptions: [],
      temp: {
        students_id: undefined,
        students_name: '',
        students_class_name: '',
        students_is_exam: '',
        students_student_number: ''
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
        students_is_exam: [{ required: true, message: 'student exam or not is required', trigger: 'change' }],
        students_student_number: [{ required: true, message: 'student number is required', trigger: 'blur' }]
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
      getStudents(this.listQuery).then(response => {
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
        students_id: undefined,
        students_name: '',
        students_class_name: '',
        students_is_exam: '',
        students_student_number: ''
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
          formdata.append('name', this.temp.students_name)
          formdata.append('class_name', this.temp.students_class_name)
          formdata.append('student_number', this.temp.students_student_number)
          formdata.append('is_exam', this.temp.students_is_exam)
          createStudents(formdata, config).then(() => {
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
      exportStudents(this.listQuery).then(response => {
        const blob = new Blob([response], {
          type: 'application/vnd.ms-excel'
        })
        console.log(blob)
        const fileName = 'student_' + Date.parse(new Date()) + '.xlsx'
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
          const config = {
            headers: { 'Content-Type': 'multipart/form-data' }
          }
          const formdata = new FormData()
          formdata.append('name', tempData.students_name)
          formdata.append('class_name', tempData.students_class_name)
          formdata.append('student_number', tempData.students_student_number)
          formdata.append('is_exam', tempData.students_is_exam)
          updateStudents(this.temp.students_id, formdata, config).then(() => {
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
      deleteStudents(tempData.students_id).then(() => {
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
    }
  }
}
</script>
