<template>
  <div class="view-traffics">
    <!-- 搜索表单 -->
    <el-form :model="form" label-width="120px" :inline="false" class="search-form">
      <el-row :gutter="20">
        <!-- 学员姓名 -->
        <el-col :span="6">
          <el-form-item label="姓名">
            <el-input v-model="form.fullname" placeholder="请输入姓名"></el-input>
          </el-form-item>
        </el-col>

        <!-- 学员账号 -->
        <el-col :span="6">
          <el-form-item label="用户名">
            <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
          </el-form-item>
        </el-col>

        <!-- 学员邀请码 -->
        <el-col :span="6">
          <el-form-item label="平台邀请码">
            <el-input v-model="form.invitationCode" placeholder="请输入平台邀请码"></el-input>
          </el-form-item>
        </el-col>

        <!-- 项目等级 -->
        <el-col :span="6">
          <el-form-item label="角色">
            <el-select v-model="form.roleId" placeholder="请选择角色" clearable>
              <el-option
                v-for="(label, key) in roleOptions"
                :key="key"
                :label="label"
                :value="parseInt(key, 10)"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <!-- 邀请人姓名 -->
        <el-col :span="6">
          <el-form-item label="邀请人姓名">
            <el-input v-model="form.inviterFullname" placeholder="请输入邀请人姓名"></el-input>
          </el-form-item>
        </el-col>

        <!-- 邀请人账号 -->
        <el-col :span="6">
          <el-form-item label="邀请人账号">
            <el-input v-model="form.inviterName" placeholder="请输入邀请人账号"></el-input>
          </el-form-item>
        </el-col>

        <!-- 邀请人邀请码 -->
        <el-col :span="6">
          <el-form-item label="邀请人邀请码">
            <el-input v-model="form.inviterCode" placeholder="请输入邀请人邀请码"></el-input>
          </el-form-item>
        </el-col>

        <!-- Tiktok账号 -->
        <el-col :span="6">
          <el-form-item label="Tiktok账号">
            <el-input v-model="form.tiktokAccount" placeholder="请输入Tiktok账号"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <!-- 管理人姓名 -->
        <el-col :span="6">
          <el-form-item label="管理人姓名">
            <el-input v-model="form.managerFullname" placeholder="请输入管理人姓名"></el-input>
          </el-form-item>
        </el-col>

        <!-- 管理人账号 -->
        <el-col :span="6">
          <el-form-item label="管理人账号">
            <el-input v-model="form.managerName" placeholder="请输入管理人账号"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="6"></el-col>
        <el-col :span="6" class="button-group">
          <el-form-item>
            <el-button type="primary" @click="searchusersHandler">查询</el-button>
            <el-button @click="resetForm">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <!-- 表格 -->
    <div class="table-container" style="width: 100%; margin-top: 20px;">
      <el-table
        ref="tableRef"
        :data="traffics"
        :default-sort="{ prop: 'userId', order: 'ascending' }"
        style="width: 100%"
        height="600px"
        :border="true"
        stripe
        v-loading="loading"
        :header-cell-style="{ background: '#f5f7fa', 'font-weight': 'bold' }"
        lazy
      >

        <!-- 表格列定义 -->
        <el-table-column
          label="ID"
        >
          <template #default="scope">
            <span @click="toggleRow(scope.row)" style="cursor: pointer; display: inline-flex; align-items: center;">
              <component
                :is="tableRef.value && tableRef.value.isRowExpanded(scope.row) ? 'ArrowLeftBold' : 'ArrowRightBold'"
                style="margin-right: 4px;"
              />
              <span>{{ scope.row.userId }}</span>
              <span v-if="scope.row.hasChildren" class="child-count" style="margin-left: 4px;">({{ scope.row.inviteCount }})</span>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="姓名">
          <template #default="scope">
            <span>{{ scope.row.fullname || scope.row.username || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="角色">
          <template #default="scope">
            {{ scope.row.roleName || '-' }}
          </template>
        </el-table-column>
        <!-- 管理人账号 -->
        <el-table-column label="管理人">
          <template #default="scope">
            <span>{{ scope.row.managerFullname || scope.row.managerName || '-'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="邀请人">
          <template #default="scope">
            <span>
              {{ scope.row.inviterFullname || scope.row.inviterName || '-'}}
            </span>
          </template>
        </el-table-column>
        <!-- 导师 -->
        <el-table-column label="导师">
          <template #default="scope">
            <span>{{ scope.row.teacherFullname || scope.row.teacherName || '-' }}</span>
          </template>
        </el-table-column>
        <!-- TK账号 -->
        <el-table-column label="TK账号" show-overflow-tooltip>
          <template #default="scope">
            <span
              v-if="scope.row.tiktokAccount"
              @click="copyText(scope.row.tiktokAccount)"
              :style="{
                cursor: 'pointer',
                color: scope.row.comments !== '获取成功' ? 'red' : 'inherit'
              }"
            >
              {{ scope.row.tiktokAccount }}
            </span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <!-- 邀请码 -->
        <el-table-column label="邀请码">
          <template #default="scope">
            <span>{{ scope.row.invitationCode || '-' }}</span>
          </template>
        </el-table-column>
        <!-- 关注数 -->
        <el-table-column label="关注数">
          <template #default="scope">
            <span>{{ scope.row.followingCount || '-' }}</span>
          </template>
        </el-table-column>
        <!-- 粉丝数 -->
        <el-table-column label="粉丝数">
          <template #default="scope">
            <span>{{ scope.row.followerCount || '-' }}</span>
          </template>
        </el-table-column>
        <!-- 点赞数 -->
        <el-table-column label="点赞数">
          <template #default="scope">
            <span>{{ scope.row.heartCount || '-' }}</span>
          </template>
        </el-table-column>
        <!-- 视频数 -->
        <el-table-column label="视频数">
          <template #default="scope">
            <span>{{ scope.row.videoCount || '-' }}</span>
          </template>
        </el-table-column>
        <!-- 最近发布时间 -->
        <el-table-column label="最新发布时间">
          <template #default="scope">
            <span :style="{ color: getTimeColor(findMaxCreateTime(scope.row.tiktokVideoDetailDTOs)) }">
              {{ getRelativeTimeByTimestamp(findMaxCreateTime(scope.row.tiktokVideoDetailDTOs)) }}
            </span>
          </template>
        </el-table-column>
        <!-- 数据更新时间 -->
        <el-table-column label="数据更新时间">
          <template #default="scope">
            {{ formatUpdateAt(scope.row.updatedAt) }}
          </template>
        </el-table-column>
        <!-- 推广链接 -->
        <el-table-column label="推广链接" show-overflow-tooltip>
          <template #default="scope">
            <span
              v-if="scope.row.link"
              @click="copyText(scope.row.link)"
              :style="{
                cursor: 'pointer',
                color: isLinkValid(scope.row.link, scope.row.invitationCode) ? 'inherit' : 'red'
              }"
            >
              {{ scope.row.link }}
            </span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <!-- 链接风险 -->
        <el-table-column label="链接风险">
          <template #default="scope">
            <span>{{ scope.row.risk == null ? '-' : scope.row.risk }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="120"
          fixed="right"
        >
          <template #default="scope">
            <el-button type="primary" size="small" @click="viewTraffic(scope.row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <ViewTrafficDrawer ref="ViewTrafficDrawerRef" />
    </div>

    <!-- 分页 -->
    <el-pagination
      @current-change="handlePageChange"
      @size-change="handleSizeChange"
      :current-page="currentPage"
      :page-size="pageSize"
      show-size-picker
      show-total
      :total="totalElements"
      layout="total, prev, pager, next, jumper, sizes"
      style="margin-top: 20px; text-align: right;"
    >
    </el-pagination>
  </div>
</template>

<script>
import { ref, reactive, onMounted, shallowRef } from 'vue';
import { useI18n } from 'vue-i18n';
import { ElMessage } from 'element-plus';
import ViewTrafficDrawer from '@/components/ViewTrafficDrawer.vue';
import { searchTraffics } from '@/api/traffics';
import { fetchAllRegions as apifetchAllRegions } from '@/api/utils';
import { ArrowRightBold, ArrowLeftBold } from '@element-plus/icons-vue'; 

export default {
  name: 'ViewTraffics',
  components: { 
    ViewTrafficDrawer, 
    ArrowRightBold, 
    ArrowLeftBold 
  },
  setup() {
    const { t } = useI18n();

    // 表单数据
    const form = reactive({
      inviterExists: '',
      fullname: '',
      username: '',
      invitationCode: '',
      tiktokAccount: '',
      inviterFullname: '',
      inviterName: '',
      inviterCode: '',
      managerFullname: '',
      managerName: '',
      roleId: null,
      createdAfter: null,
      createdBefore: null
    });

    // 角色选项
    const roleOptions = {
      '4': '高阶学员',
      '5': '中阶学员',
      '6': '初阶学员'
    };

    const enabledOptions = {
      true: '是',
      false: '否'
    };

    // 表格数据
    const traffics = ref([]);

    // 加载状态
    const loading = ref(false);

    // 分页
    const currentPage = ref(1);
    const pageSize = ref(10);
    const totalElements = ref(0);
    const totalPages = ref(1);

    // 地区选项
    const regionOptions = ref([]);
    const currencyOptions = ref([]);

    const ViewTrafficDrawerRef = shallowRef(null);

    const tableRef = ref(null);

    /**
     * 复制文本
     * @param {String} text - 要复制的文本
     */
    const copyText = async (text) => {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        try {
          await navigator.clipboard.writeText(text);
          ElMessage.success("复制成功！");
        } catch (err) {
          console.error("Clipboard API 复制失败:", err);
          ElMessage.error("复制失败，请手动复制");
        }
      } else {
        // 如果 Clipboard API 不支持，使用备用方案
        fallbackCopyText(text);
      }
    };

    const fallbackCopyText = (text) => {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        ElMessage.success("复制成功！");
      } catch (err) {
        console.error("复制失败:", err);
        ElMessage.error("复制失败，请手动复制");
      }
      document.body.removeChild(textArea);
    };

    const formatUpdateAt = (utcTime) => {
      if (!utcTime) {
        return '-';
      }
      const updateAt = new Date(utcTime);
      const now = new Date();

      const diff = now - updateAt;

      const seconds = Math.floor(diff / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);
      const months = Math.floor(days / 30);
      const years = Math.floor(days / 365);

      const timeUnits = [
        { unit: "年", value: years },
        { unit: "月", value: months % 12 },
        { unit: "天", value: days % 30 },
        { unit: "时", value: hours % 24 },
        { unit: "分", value: minutes % 60 },
        { unit: "秒", value: seconds % 60 },
      ];

      const nonZeroUnits = timeUnits.filter((item) => item.value > 0);

      if (nonZeroUnits.length === 0) {
        return "刚刚";
      }

      const topTwoUnits = nonZeroUnits.slice(0, 2);

      return topTwoUnits.map((item) => `${item.value}${item.unit}`).join(" ");
    };

    const findMaxCreateTime = (videoDOTs) => {
      if (!videoDOTs || videoDOTs.length === 0) {
        return null;
      }
      return videoDOTs.reduce((max, videoDOT) => {
        return videoDOT.createTime > max ? videoDOT.createTime : max;
      }, videoDOTs[0].createTime);
    };

    const getRelativeTimeByTimestamp = (inputTime) => {
      if (!inputTime) {
        return '-';
      }
      const nowUTC = Date.now();
      const serverUTC = inputTime * 1000;

      let diff = Math.abs(nowUTC - serverUTC);

      const units = [
        { label: '年', value: 365 * 24 * 60 * 60 * 1000 },
        { label: '月', value: 30 * 24 * 60 * 60 * 1000 },
        { label: '天', value: 24 * 60 * 60 * 1000 },
        { label: '时', value: 60 * 60 * 1000 },
        { label: '分', value: 60 * 1000 },
        { label: '秒', value: 1000 },
      ];

      const result = [];

      for (const unit of units) {
        if (diff >= unit.value) {
          const count = Math.floor(diff / unit.value);
          diff %= unit.value;
          result.push(`${count}${unit.label}`);
        }
        if (result.length === 2) break; // 限制最多两个单位
      }

      return result.length > 0 ? result.join('') : '刚刚';
    };

    const getTimeColor = (inputTime) => {
      if (!inputTime) {
        return '#000';
      }
      const nowUTC = Date.now();
      const serverUTC = inputTime * 1000;

      let diff = Math.abs(nowUTC - serverUTC);

      if (diff <= 24 * 60 * 60 * 1000) {
        return '#52c41a';
      } else if (diff > 24 * 60 * 60 * 1000 && diff <= 3 * 24 * 60 * 60 * 1000) {
        return '#1890ff';
      } else if (diff > 3 * 24 * 60 * 60 * 1000 && diff <= 7 * 24 * 60 * 60 * 1000) {
        return '#faad14';
      } else {
        return '#f5222d';
      }
    };

    const isLinkValid = (value, invitationCode) => {
      if (!value || typeof value !== 'string') {
        return false;
      }
      const linkPattern = /[a-zA-Z0-9.-]+\/pages\/login\/login\?inviterType=\d+&invitation=([a-zA-Z0-9]+)$/;
      const match = value.match(linkPattern);
      if (!match) {
        return false;
      }
      const invitationCodeInLink = match[1];
      return invitationCodeInLink === invitationCode;
    };

    /**
     * 获取学员数据
     * @param {Object} payload - 请求参数
     * @param {Object|null} parentRow - 父级行数据
     */
    const fetchTraffics = async (payload, parentRow = null) => {
      loading.value = true;
      try {
        const response = await searchTraffics(payload);
        if (response.data.success) {
          let data = response.data.data.content.map(item => {
            if (item.inviteCount > 0) {
              const { children, ...rest } = item;
              return { ...rest, hasChildren: true };
            } else {
              return { ...item, hasChildren: false };
            }
          });

          traffics.value = data;
          totalElements.value = response.data.data.totalElements;
          totalPages.value = response.data.data.totalPages;

        } else {
          ElMessage.error("获取数据失败:" + response.data.message);
        }
      } catch (error) {
        console.error(error);
        ElMessage.error("获取数据失败");
      } finally {
        loading.value = false;
      }
    };

    /**
     * 搜索学员
     */
    const searchusersHandler = () => {
      currentPage.value = 1;
      const payload = {
        ...form,
        roleId: form.roleId ? parseInt(form.roleId, 10) : null,
        page: currentPage.value - 1,
        size: pageSize.value
      };
      fetchTraffics(payload);
    };

    /**
     * 重置表单
     */
    const resetForm = () => {
      form.inviterExists = '';
      form.fullname = '';
      form.username = '';
      form.invitationCode = '';
      form.tiktokAccount = '';
      form.inviterFullname = '';
      form.inviterName = '';
      form.inviterCode = '';
      form.managerFullname = '';
      form.managerName = '';
      form.roleId = null;
      form.createdAfter = null;
      form.createdBefore = null;
      searchusersHandler();
    };

    /**
     * 查看学员详情
     */
    const viewTraffic = (row) => {
      if (ViewTrafficDrawerRef.value) {
        ViewTrafficDrawerRef.value.showDrawer(row);
      } else {
        console.error('Drawer component is not ready.');
      }
    };

    /**
     * 格式化货币
     * @param {Number} value - 金额
     * @returns {String} 格式化后的金额
     */
    const formatCurrency = (value, currencyName="美元") => {
      if (value === null || value === undefined) {
        return '-'; // 返回占位符
      }
      return `${parseFloat(value.toFixed(2))} ${currencyName ? currencyName : ''}`;
    };

    /**
     * 处理页码变化
     * @param {Number} page - 当前页码
     */
    const handlePageChange = (page) => {
      currentPage.value = page;
      const payload = {
        ...form,
        roleId: form.roleId ? parseInt(form.roleId, 10) : null,
        page: currentPage.value - 1, // 假设 API 是 0-based
        size: pageSize.value
      };
      fetchTraffics(payload);
    };

    /**
     * 处理分页大小变化
     * @param {Number} newSize - 新的分页大小
     */
    const handleSizeChange = (newSize) => {
      pageSize.value = newSize;
      currentPage.value = 1; // 重置为第一页
      searchusersHandler();
    };

    /**
     * 获取所有类型数据（地区和项目名称）
     */
    const loadAllTypes = async () => {
      try {
        const response = await apifetchAllRegions()
        if (response.data.success) {
          const data = response.data.data

          regionOptions.value = data.map(region => region.regionName);
          currencyOptions.value = [...new Set(data.map(region => region.currencyName))];

        } else {
          ElMessage.error(t('enrollTraffic.FetchTypesFailed'))
        }
      } catch (error) {
        ElMessage.error(t('enrollTraffic.FetchTypesFailed'))
      }
    }

    const formatDate = (field) => {
      if (form[field]) {
        const date = new Date(form[field]);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        form[field] = `${year}-${month}-${day}`;
      }
    };

    // 在组件挂载时执行初始搜索
    onMounted(() => {
      loadAllTypes();
      searchusersHandler();
    });

    return {
      t,
      form,
      roleOptions,
      enabledOptions,
      formatDate,
      traffics,
      loading,
      searchusersHandler, // 确保返回名称与模板一致
      resetForm,
      viewTraffic,
      formatCurrency,
      handlePageChange,
      handleSizeChange,
      currentPage,
      pageSize,
      totalElements,
      totalPages,
      ViewTrafficDrawerRef,
      tableRef, // 添加 tableRef
      ArrowRightBold,
      ArrowLeftBold,
      regionOptions,
      currencyOptions,
      formatUpdateAt,
      copyText,
      fallbackCopyText,
      isLinkValid,
      findMaxCreateTime,
      getRelativeTimeByTimestamp,
      getTimeColor
    };
  }
};
</script>

<style scoped>
.view-traffics {
  padding: 20px;
}

.search-form {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

/* 调整按钮组布局 */
.button-group {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 100%;
}

/* 确保表格容器支持横向滚动 */
.table-container {
  overflow-x: auto;
}

/* 自定义滚动条样式 */
.table-container::-webkit-scrollbar {
  height: 12px;
}

.table-container::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.table-container::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 6px;
}

.table-container::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* 确保固定列样式 */
.el-table .cell {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

</style>
