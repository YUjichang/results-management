<template>
  <div class="app-container">
    <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload" :import-data="importData" />
    <el-button style="float:right;margin-bottom:15px;" class="filter-item" type="primary" icon="el-icon-download" @click="handleExport">模板下载</el-button>
    <el-table :data="tableData" border highlight-current-row style="width: 100%;margin-top:20px;">
      <el-table-column v-for="item of tableHeader" :key="item" :prop="item" :label="item" />
    </el-table>
  </div>
</template>

<script>
import UploadExcelComponent from '@/components/UploadExcel/index.vue'
import { importStudents } from '@/api/students/table'

export default {
  name: 'StudentsImport',
  components: { UploadExcelComponent },
  data() {
    return {
      tableData: [],
      tableHeader: []
    }
  },
  methods: {
    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 1

      if (isLt1M) {
        return true
      }

      this.$message({
        message: 'Please do not upload files larger than 1m in size.',
        type: 'warning'
      })
      return false
    },
    handleSuccess({ results, header }) {
      this.tableData = results
      this.tableHeader = header
    },
    importData(file) {
      const config = {
        headers: { 'Content-Type': 'multipart/form-data' }
      }
      const formdata = new FormData()
      formdata.append('file', file)
      importStudents(formdata, config).then(() => {
        this.$notify({
          title: '成功',
          message: '批量导入成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    handleExport() {
      var elemIF = document.createElement('iframe')
      elemIF.src = 'http://47.106.206.157/resource/templates/student_import_template.xlsx'
      elemIF.style.display = 'none'
      document.body.appendChild(elemIF)
    }
  }
}
</script>
