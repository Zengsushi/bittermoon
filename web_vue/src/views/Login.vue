<template>
  <div class="login-container">
    <el-form :model="ruleForm" :rules="rules"
             status-icon
             ref="formRef" 
             label-position="left"
             label-width="0px"
             class="demo-ruleForm login-page">
      <h3 class="title">系统登录</h3>
      <el-form-item prop="username">
        <el-input type="text"
                  v-model="ruleForm.username"
                  placeholder="用户名"
        ></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password"
                  v-model="ruleForm.password"
                  placeholder="密码"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-radio v-model="type" label="systemAdmin">系统管理员</el-radio>
        <el-radio style="position: relative;left: 80px" v-model="type" label="dormitoryAdmin">宿舍管理员</el-radio>
      </el-form-item>
      <el-form-item style="width:100%;">
        <el-button type="primary" style="width:100%;" @click="handleSubmit" :loading="logining">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';  // 导入 useRouter
import instance from '@/utils/result';  // 引入自定义的 API 函数
import { useInfo } from '@/api/index'; // 可能是自定义的接口调用
import route from '@/router/index';  // 引入路由
export default {
  name: "Login",
  setup() {
    const logining = ref(false);

    // 创建响应式对象 ruleForm
    const ruleForm = reactive({
      username: 'admin1',
      password: '123123'
    });

    // 账号类型
    const type = ref('systemAdmin');

    // 表单验证规则
    const rules = {
      username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
      password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
    };

    // 获取表单实例
    const formRef = ref(null);

    // 获取 Vue Router 实例
    const router = useRouter();

    // 提交表单方法
    const handleSubmit = async () => {
      try {
        // 验证表单
        const valid = await formRef.value.validate();
        if (valid) {
          logining.value = true;

          // 根据用户类型发送请求
          let apiCall;
          if (type.value === 'dormitoryAdmin') {
            apiCall = useInfo(ruleForm);  // 调用宿舍管理员接口
          } else if (type.value === 'systemAdmin') {
            apiCall = instance.get('/systemAdmin/login', { params: ruleForm });  // 调用系统管理员接口
          }

          // 发送请求
          const resp = await apiCall;
          logining.value = false;

          // 处理登录结果
          if (resp.data.code === -1) {
            alert('用户名不存在');
          } else if (resp.data.code === -2) {
            alert('密码错误');
          } else if (resp.data.code === 0) {
            localStorage.setItem("token", resp.data.data);
            getInfo(); 
            router.push("/dormitoryAdminAdd");  // 跳转到首页
            // if (type.value === 'dormitoryAdmin') {
            //   localStorage.setItem('dormitoryAdmin', JSON.stringify(resp.data.data));
            //   router.replace({ path: '/dormitoryAdmin' });  // 跳转到宿舍管理员页面
            // } else if (type.value === 'systemAdmin') {
            //   localStorage.setItem('systemAdmin', JSON.stringify(resp.data.data));
            //   router.replace({ path: '/SystemAdmin' });  // 跳转到系统管理员页面
            // }
          }
        }
      } catch (error) {
        logining.value = false;
        console.error('登录请求失败:', error);
      }
    };

    const getInfo = async () => {
      const res = await instance.get("/dormitoryAdmin/info", {
                            headers: {
                                "Authorization":  localStorage.token
                            }
                        })
      if(res.data.code === 0){
            if (type.value === 'dormitoryAdmin') {
              localStorage.setItem('dormitoryAdmin', JSON.stringify(res.data.data));
            } else if (type.value === 'systemAdmin') {
              localStorage.setItem('systemAdmin', JSON.stringify(res.data.data));
            }            
      }
    }

    return {
      logining,
      ruleForm,
      type,
      rules,
      handleSubmit,
      formRef
    };
  }
};
</script>

<style scoped>
.login-container {
  width: 100%;
  height: 100%;
}
.login-page {
  border-radius: 5px;
  margin: 180px auto;
  width: 350px;
  padding: 35px 35px 15px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
}
label.el-checkbox.rememberme {
  margin: 0px 0px 15px;
  text-align: left;
}
</style>
