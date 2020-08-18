<template>
  <div class="app-container">
    <!-- 工具栏  -->
    <div class="filter-container">
      <el-input v-model="listQuery.name" placeholder="班级名称" prefix-icon="el-icon-search" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
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
          <span>{{ scope.row.classes_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="班级名称">
        <template slot-scope="scope">
          {{ scope.row.classes_name }}
        </template>
      </el-table-column>
      <el-table-column label="总人数" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.classes_total_number }}</span>
        </template>
      </el-table-column>
      <el-table-column label="考试人数" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.classes_exam_number }}
        </template>
      </el-table-column>
      <el-table-column label="登记总人数" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.register_total_number }}
        </template>
      </el-table-column>
      <el-table-column label="登记考试人数" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.register_exam_number }}
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
        <el-form-item label="班级名称" prop="classes_name">
          <el-input v-model="temp.classes_name" />
        </el-form-item>
        <el-form-item label="总人数" prop="classes_total_number">
          <el-input v-model="temp.classes_total_number" />
        </el-form-item>
        <el-form-item label="考试人数" prop="classes_exam_number">
          <el-input v-model="temp.classes_exam_number" />
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
import { getClasses, exportClasses, createClasses, updateClasses, deleteClasses } from '@/api/classes/table'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'

export default {
  name: 'ClassesTable',
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
        name: undefined
      },
      temp: {
        classes_id: undefined,
        classes_name: '',
        classes_total_number: '',
        classes_exam_number: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      rules: {
        classes_name: [{ required: true, message: 'class name is required', trigger: 'blur' }],
        classes_total_number: [{ required: true, message: 'classes total number is required', trigger: 'blur' }],
        classes_exam_number: [{ required: true, message: 'class exam number is required', trigger: 'blur' }]
      },
      downloadLoading: false,
      deleteVisible: false
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getClasses(this.listQuery).then(response => {
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
        classes_id: undefined,
        classes_name: '',
        classes_total_number: '',
        classes_exam_number: ''
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
          formdata.append('name', this.temp.classes_name)
          formdata.append('total_number', this.temp.classes_total_number)
          formdata.append('exam_number', this.temp.classes_exam_number)
          createClasses(formdata, config).then(() => {
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
      exportClasses(this.listQuery).then(response => {
        const blob = new Blob([response], {
          type: 'application/vnd.ms-excel'
        })
        console.log(blob)
        const fileName = 'class_' + Date.parse(new Date()) + '.xlsx'
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
          formdata.append('name', tempData.classes_name)
          formdata.append('total_number', tempData.classes_total_number)
          formdata.append('exam_number', tempData.classes_exam_number)
          updateClasses(this.temp.classes_id, formdata, config).then(() => {
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
      deleteClasses(tempData.classes_id).then(() => {
        this.deleteVisible = false
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
        this.fetchData()
      })
    }
  }
}
</script>
