<template>
    <el-container class="home_container">
      <el-header class="home_header">
        <div class="home_title">宿舍管理系统-系统管理员</div>
        <div class="home_userinfoContainer">
          <el-dropdown>
            <span class="el-dropdown-link home_userinfo">
              {{ admin }}
            </span>
            <template #dropdown>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>

        </div>
      </el-header>
      
      <el-container>
        <el-aside class="home_aside" width="200px">
          <el-scrollbar>  
            <el-menu router :default-openeds="['1', '3']">
              <el-sub-menu index="1-1">
                <template #title> 宿管模块</template>
                <el-menu-item index="/dormitoryAdminAdd" :class="{'is-active': $route.path === '/dormitoryAdminAdd'}">添加宿管</el-menu-item>
                <el-menu-item index="/dormitoryAdminManager" :class="{'is-active': $route.path === '/dormitoryAdminManager'}">宿管管理</el-menu-item>
              </el-sub-menu>

              <el-sub-menu index="2-1">
                <template #title> 学生模块</template>
                <el-menu-item index="/studentAdd" :class="{'is-active': $route.path === '/studentAdd'}">添加学生</el-menu-item>
                <el-menu-item index="/studentManager">学生管理</el-menu-item>
              </el-sub-menu>

              <el-sub-menu index="3-1">
                <template #title> 楼宇模块</template>
                <el-menu-item index="/buildingAdd">添加楼宇</el-menu-item>
                <el-menu-item index="/buildingManager">楼宇管理</el-menu-item>
              </el-sub-menu>

              <el-sub-menu index="4-1">
                <template #title> 宿舍模块</template>
                <el-menu-item index="/dormitoryAdd">添加楼宇</el-menu-item>
                <el-menu-item index="/dormitoryManager">楼宇管理</el-menu-item>
              </el-sub-menu>


              <el-sub-menu index="6-1">
                <template #title> 迁出管理</template>
                <el-menu-item index="/moveoutRegister">迁出登记</el-menu-item>
                <el-menu-item index="/moveoutRecord">迁出记录</el-menu-item>
              </el-sub-menu>

              <el-menu-item index="/absentRecord">学生缺寝记录</el-menu-item>
     
     
            </el-menu>
          </el-scrollbar>
        </el-aside>
        
  
        <el-container>
          <el-main>
            <el-breadcrumb separator-class="el-icon-arrow-right">
              <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
              <el-breadcrumb-item v-text="$route.name"></el-breadcrumb-item>
            </el-breadcrumb>
            <router-view></router-view>
          </el-main>
          <el-footer class="home_footer">湖南科技职业学院</el-footer>
        </el-container>
      </el-container>
    </el-container>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';  
  import { useRouter } from 'vue-router';  
  import {ElMessageBox } from 'element-plus'
  import * as ElementPlusIconsVue from '@element-plus/icons-vue'
  export default {
    name: 'Home',
    setup() {
      const admin = ref({}); 
      const router = useRouter();  
  
      const logout = () => {
        ElMessageBox.confirm('注销登录吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          localStorage.removeItem('systemAdmin');  
          router.replace({ path: '/login' });  
        });
      };


      onMounted(() => {
        const storedAdmin = JSON.parse(localStorage.getItem('systemAdmin'))  
        if (storedAdmin) {
          admin.value = storedAdmin           
        }
      });
      return {
        admin,
        logout,
      };
    }
  };
  </script>
  
  <style scoped>
  .home_container {
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
  }
  
  .home_header {
    background-color: #2B2B2B;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  
  .home_title {
    color: #C2C2C2;
    font-size: 22px;
    display: inline;
  }
  
  .home_userinfo {
    color: #fff;
    cursor: pointer;
  }
  
  .home_userinfoContainer {
    display: inline;
    margin-right: 20px;
  }
  
  .home_aside {
    background-color: #FFFFFF;
  }
  
  .home_footer {
    background-color: #FFFFFF;
    color: #000000;
    font-size: 18px;
    line-height: 60px;
    text-align: center;
  }

  .example-showcase .el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
}
  </style>
  