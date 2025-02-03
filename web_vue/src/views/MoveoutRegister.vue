<template>
    <div style="margin-top: 60px;margin-left:80px;border: 0px solid red;" >
        <el-form style="margin-left: -40px" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="字段：" prop="key">
                <el-select v-model="ruleForm.key" style="width: 160px;float: left" placeholder="请选择字段">
                    <el-option label="学号" value="number"></el-option>
                    <el-option label="姓名" value="name"></el-option>
                </el-select>
            </el-form-item>
            <div style="border: 0px solid red;width: 400px;height: 60px;position: relative;top: -64px;left: 270px">
                <el-form-item label="值：" style="margin-top: 30px;">
                    <el-input v-model="ruleForm.value" placeholder="请输入关键字" style="width: 160px;"></el-input>
                    <el-button type="primary" icon="el-icon-search" style="position: relative;left: 10px;" @click="submitForm('ruleForm')">搜索</el-button>
                </el-form-item>
            </div>
        </el-form>

        <el-table
                :data="tableData"
                
                stripe
                style="width: 1190px;position: relative;top:-30px">
            <el-table-column
                    fixed
                    prop="id"
                    label="ID"
                    width="130">
            </el-table-column>
            <el-table-column
                    prop="dormitoryName"
                    label="宿舍"
                    width="130">
            </el-table-column>
            <el-table-column
                    prop="number"
                    label="学号"
                    width="130">
            </el-table-column>
            <el-table-column
                    prop="name"
                    label="姓名"
                    width="130">
            </el-table-column>
            <el-table-column
                    prop="gender"
                    label="性别"
                    width="130">
            </el-table-column>
            <el-table-column
                    prop="state"
                    label="状态"
                    width="130">
            </el-table-column>
            <el-table-column
                    prop="createDate"
                    label="入住时间"
                    width="180">
            </el-table-column>
            <el-table-column fixed="right" label="&nbsp;操作" min-width="120" style="align-items: center;">
                <template #default="scope">
                <el-button link type="primary" size="small" @click="moveout(scope.row)">
                    迁出
                </el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination style="margin-top: 20px;float: right"
                       background
                       layout="prev, pager, next"
                       :page-size="pageSize"
                       :total="total"
                       :current-page.sync="currentPage"
                       @current-change="page">
        </el-pagination>
    </div>

</template>

<script>
    import instance from '@/utils/result';
export default {
        data() {
            return {
                tableData: null,
                currentPage: 1,
                pageSize: 5,
                total: null,
                key: '',
                value: '',
                ruleForm: {
                    key: '',
                    value: '',
                    page: '',
                    size: 5
                },
                rules: {
                    key: [
                        { required: true, message: '请选择字段', trigger: 'change' }
                    ]
                }
            }
        },
        methods:{
            submitForm(formName) {
                const _this = this
                //让翻页复原
                _this.currentPage=1
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        const _this = this
                        _this.ruleForm.page = _this.currentPage
                        instance.get('/moveout/search',{params:_this.ruleForm} ,{
                            headers: {
                                "Authorization":  localStorage.token
                            }
                        }).then(function (resp) {
                            _this.tableData = resp.data.data.data
                            _this.total = resp.data.data.total
                        })
                    }
                });

            },
            page(currentPage){
                const _this = this
                if(_this.ruleForm.value == ''){
                    instance.get('/moveout/list/'+currentPage+'/'+_this.pageSize , {
                            headers: {
                                "Authorization":  localStorage.token
                            }
                        }).then(function (resp) {
                        _this.tableData = resp.data.data.data
                        _this.total = resp.data.data.total
                        _this.currentPage = currentPage
                    })
                } else {
                    _this.ruleForm.page = _this.currentPage
                    instance.get('/moveout/search',{params:_this.ruleForm} , {
                            headers: {
                                "Authorization":  localStorage.token
                            }
                        }).then(function (resp) {
                        _this.tableData = resp.data.data.data
                        _this.total = resp.data.data.total
                    })
                }

            },
            moveout(row) {
                const _this = this
                this.$prompt('请输入迁出原因', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputPattern: /^[\s\S]*.*[^\s][\s\S]*$/,
                    inputErrorMessage: '迁出原因不能为空'
                }).then(({ value }) => {
                    this.$confirm('确认迁出【'+row.name+'】吗？', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        instance.put('/moveout/moveout/'+row.id+"/"+value , {
                            headers: {
                                "Authorization":  localStorage.token
                            }
                        }).then(function (resp) {
                            if(resp.data.code == 0){
                                _this.$alert('【'+row.name+'】已迁出', '', {
                                    confirmButtonText: '确定',
                                    callback: action => {
                                        location.reload()
                                    }
                                });
                            }
                        });
                    });
                });
            }
        },
        created() {
            const _this = this
            instance.get('/moveout/list/1/'+_this.pageSize , {
                            headers: {
                                "Authorization":  localStorage.token
                            }
                        }).then(function (resp) {
                _this.tableData = resp.data.data.data
                _this.total = resp.data.data.total
            })
        }
    }
</script>