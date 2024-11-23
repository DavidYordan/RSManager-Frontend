<template>
  <div class="view-traffics">
    <!-- 搜索表单 -->
    <el-form :model="form" label-width="120px" :inline="false" class="search-form">
      <el-row :gutter="20">
        <!-- 学员姓名 -->
        <el-col :span="6">
          <el-form-item :label="$t('ViewTraffics.fullname')">
            <el-input v-model="form.fullname" :placeholder="$t('ViewTraffics.placeholders.enterFullname')"></el-input>
          </el-form-item>
        </el-col>

        <!-- 学员账号 -->
        <el-col :span="6">
          <el-form-item :label="$t('ViewTraffics.username')">
            <el-input v-model="form.username" :placeholder="$t('ViewTraffics.placeholders.enterUsername')"></el-input>
          </el-form-item>
        </el-col>

        <!-- 学员邀请码 -->
        <el-col :span="6">
          <el-form-item :label="$t('ViewTraffics.invitationCode')">
            <el-input v-model="form.invitationCode" :placeholder="$t('ViewTraffics.placeholders.enterInvitationCode')"></el-input>
          </el-form-item>
        </el-col>

        <!-- 项目等级 -->
        <el-col :span="6">
          <el-form-item :label="$t('ViewTraffics.roleId')">
            <el-select v-model="form.roleId" :placeholder="$t('ViewTraffics.placeholders.selectRole')" clearable>
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
          <el-form-item :label="$t('ViewTraffics.inviterFullname')">
            <el-input v-model="form.inviterFullname" :placeholder="$t('ViewTraffics.placeholders.enterInviterFullname')"></el-input>
          </el-form-item>
        </el-col>

        <!-- 邀请人账号 -->
        <el-col :span="6">
          <el-form-item :label="$t('ViewTraffics.inviterName')">
            <el-input v-model="form.inviterName" :placeholder="$t('ViewTraffics.placeholders.enterInviterName')"></el-input>
          </el-form-item>
        </el-col>

        <!-- 邀请人邀请码 -->
        <el-col :span="6">
          <el-form-item :label="$t('ViewTraffics.inviterCode')">
            <el-input v-model="form.inviterCode" :placeholder="$t('ViewTraffics.placeholders.enterInviterCode')"></el-input>
          </el-form-item>
        </el-col>

        <!-- Tiktok账号 -->
        <el-col :span="6">
          <el-form-item :label="$t('ViewTraffics.tiktokAccount')">
            <el-input v-model="form.tiktokAccount" :placeholder="$t('ViewTraffics.placeholders.enterTiktokAccount')"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <!-- 管理人姓名 -->
        <el-col :span="6">
          <el-form-item :label="$t('ViewTraffics.managerFullname')">
            <el-input v-model="form.managerFullname" :placeholder="$t('ViewTraffics.placeholders.enterManagerFullname')"></el-input>
          </el-form-item>
        </el-col>

        <!-- 管理人账号 -->
        <el-col :span="6">
          <el-form-item :label="$t('ViewTraffics.managerName')">
            <el-input v-model="form.managerName" :placeholder="$t('ViewTraffics.placeholders.enterManagerName')"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="6">
        </el-col>

        <el-col :span="6" class="button-group">
          <el-form-item>
            <el-button type="primary" @click="searchtrafficsHandler">{{ $t('ViewTraffics.buttons.query') }}</el-button>
            <el-button @click="resetForm">{{ $t('ViewTraffics.buttons.reset') }}</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <!-- 学员表格 -->
    <div class="table-container" style="width: 100%; margin-top: 20px;">
      <el-table
        ref="tableRef"
        :data="traffics"
        :default-sort="{ prop: 'userId', order: 'ascending' }"
        style="width: 100%; overflow-x: auto;"
        height="600px"
        :border="true"
        stripe
        v-loading="loading"
        :header-cell-style="{ background: '#f5f7fa', 'font-weight': 'bold' }"
      >

        <!-- 表格列定义 -->

        <!-- 学员姓名 -->
        <el-table-column prop="fullname" :label="$t('ViewTraffics.table.fullname')"></el-table-column>

        <!-- 角色等级 -->
        <el-table-column prop="roleId" :label="$t('ViewTraffics.table.role')">
          <template #default="scope">
            {{ roleOptions[scope.row.roleId] }}
          </template>
        </el-table-column>
        
        <!-- 管理人姓名 -->
        <el-table-column prop="managerFullname" :label="$t('ViewTraffics.table.managerFullname')"></el-table-column>
        
        <!-- 邀请人姓名 -->
        <el-table-column prop="inviterFullname" :label="$t('ViewTraffics.table.inviterFullname')">
          <template #default="scope">
            <span
              :style="{ color: ([4, 5, 6].includes(scope.row.roleId) && !scope.row.inviterFullname) ? 'red' : 'inherit' }"
            >
              <span v-html="([4, 5, 6].includes(scope.row.roleId) && !scope.row.inviterFullname) ? `未录入` : scope.row.inviterFullname || ''"></span>
            </span>
          </template>
        </el-table-column>

        <!-- 导师姓名 -->
        <el-table-column prop="teacherFullname" :label="$t('ViewTraffics.table.teacherFullname')"></el-table-column>

        <!-- tiktok账号 -->
        <el-table-column prop="tiktokAccount" show-overflow-tooltip :label="$t('ViewTraffics.table.tiktokAccount')">
          <template #default="scope">
            <span
              :style="{ color: (scope.row.comments === '账号不存在') ? 'red' : (scope.row.comments === '获取失败') ? 'orange' : 'inherit' }"
              @click="copyToClipboard(scope.row.tiktokAccount)"
              style="cursor: pointer;"
              title="点击复制"
            >
              {{ scope.row.tiktokAccount }}
            </span>
          </template>
        </el-table-column>
        
        <!-- 邀请码 -->
        <el-table-column prop="invitationCode" :label="$t('ViewTraffics.table.invitationCode')"></el-table-column>

        <!-- 关注数 -->
        <el-table-column prop="followingCount" :label="$t('ViewTraffics.table.followingCount')"></el-table-column>

        <!-- 粉丝数 -->
        <el-table-column prop="followerCount" :label="$t('ViewTraffics.table.followerCount')"></el-table-column>

        <!-- 点赞数 -->
        <el-table-column prop="heartCount" :label="$t('ViewTraffics.table.heartCount')"></el-table-column>

        <!-- 视频数 -->
        <el-table-column prop="videoCount" :label="$t('ViewTraffics.table.videoCount')"></el-table-column>

        <!-- 最新视频发布时间 -->
        <el-table-column 
          prop="tiktokVideoDetailsDTO" 
          :label="$t('ViewTraffics.table.latestVideoTime')"
        >
          <template #default="scope">
            <span :style="{ color: getRowColor(scope.row) }">
              {{ getDisplayTime(scope.row) }}
            </span>
          </template>
        </el-table-column>

        <!-- 更新时间 -->
        <el-table-column prop="updatedAt" :label="$t('ViewTraffics.table.updatedAt')">
          <template #default="scope">
            {{ getRelativeTime(scope.row.updatedAt) }}
          </template>
        </el-table-column>

        <!-- 推广链接，允许复制 -->
        <el-table-column prop="link" show-overflow-tooltip :label="$t('ViewTraffics.table.link')">
          <template #default="scope">
            <span
              @click="copyToClipboard(scope.row.link)"
              :style="{ cursor: 'pointer', color: isLinkValid(scope.row) ? '' : 'red' }"
              title="点击复制"
            >
              {{ scope.row.link }}
            </span>
          </template>
        </el-table-column>

        <!-- 链接风险 risk -->
        <el-table-column prop="risk" :label="$t('ViewTraffics.table.risk')"></el-table-column>

        <el-table-column
          :label="$t('ViewTraffics.table.actions')"
          width="120"
          fixed="right"
        >
          <template #default="scope">
            <el-button type="primary" size="small" @click="viewTraffic(scope.row)">
              {{ $t('ViewTraffics.buttons.view') }}
            </el-button>
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
      processStatuses: [],
      managerFullname: '',
      managerName: '',
      roleId: null,
      paymentMethod: '',
      createdAfter: null,
      createdBefore: null
    });

    // 角色选项
    const roleOptions = {
      '4': t('ViewTraffics.status.4'),
      '5': t('ViewTraffics.status.5'),
      '6': t('ViewTraffics.status.6')
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

    const ViewTrafficDrawerRef = shallowRef(null);

    const tableRef = ref(null);

    const copyToClipboard = (text) => {
      if (!text) {
        ElMessage.warning('无有效内容可复制');
        return;
      }

      // 创建一个隐藏的文本输入框
      const input = document.createElement('textarea');
      input.value = text;
      document.body.appendChild(input);

      // 选中并复制文本
      input.select();
      try {
        const successful = document.execCommand('copy');
        if (successful) {
          ElMessage.success('复制成功');
        } else {
          ElMessage.error('复制失败，请重试');
        }
      } catch (err) {
        ElMessage.error('复制失败，请检查浏览器支持情况');
        console.error('Fallback: Oops, unable to copy', err);
      }

      // 清理文本输入框
      document.body.removeChild(input);
    };

    /**
     * 获取学者数据
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
              const { children, ...rest } = item; // 移除 children
              return { ...rest, hasChildren: true };
            } else {
              return { ...item, hasChildren: false };
            }
          });

          if (parentRow) {
            // 如果是子节点，添加到父节点的 children 中
            parentRow.children = data;
          } else {
            // 否则，设置为主表格数据
            traffics.value = data;
            totalElements.value = response.data.data.totalElements;
            totalPages.value = response.data.data.totalPages;
          }
        } else {
          ElMessage.error(t('ViewTraffics.messages.fetchError'));
        }
      } catch (error) {
        console.error(error);
        ElMessage.error(t('ViewTraffics.messages.fetchError'));
      } finally {
        loading.value = false;
      }
    };

    /**
     * 搜索学者
     */
    const searchtrafficsHandler = () => {
      currentPage.value = 1;
      const payload = {
        ...form,
        roleId: form.roleId ? parseInt(form.roleId, 10) : null,
        inviterExists: form.inviterExists === 'true' ? true : form.inviterExists === 'false' ? false : null,
        page: currentPage.value - 1,
        size: pageSize.value
      };
      fetchTraffics(payload);
    };

    const getRelativeTime = (inputTime) => {
      if (!inputTime) {
        return '-';
      }
      const nowUTC = Date.now();
      const serverUTC = new Date(inputTime).getTime();

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
        if (result.length === 2) break;
      }

      return result.length > 0 ? result.join('') : '刚刚';
    };

    const getRelativeTimeByTimestamp = (inputTime) => {
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

    const getRowColor = (row) => {
      if (!row.tiktokVideoDetailsDTO || row.tiktokVideoDetailsDTO.length === 0) {
        return 'inherit'; // 默认颜色
      }
      const maxCreateTime = Math.max(
        ...row.tiktokVideoDetailsDTO.map((item) => item.createTime)
      );
      const now = new Date();
      const diffInDays = Math.floor((now - new Date(maxCreateTime * 1000)) / (24 * 60 * 60 * 1000));

      if (diffInDays >= 7) {
        return 'red';
      } else if (diffInDays >= 3) {
        return 'orange';
      } else if (diffInDays >= 1) {
        return 'blue';
      } else {
        return 'green';
      }
    };

    const getDisplayTime = (row) => {
      if (!row.tiktokVideoDetailsDTO || row.tiktokVideoDetailsDTO.length === 0) {
        return '-';
      }
      const maxCreateTime = Math.max(
        ...row.tiktokVideoDetailsDTO.map((item) => item.createTime)
      );
      return getRelativeTimeByTimestamp(maxCreateTime);
    };

    const isLinkValid = (row) => {
      if (!row.link || typeof row.link !== "string") {
        return false;
      }
      const linkPattern = /[a-zA-Z0-9.-]+\/pages\/login\/login\?inviterType=\d+&invitation=([a-zA-Z0-9]+)$/;
      const match = row.link.match(linkPattern);
      if (!match) {
        return false;
      }
      const invitationCodeInLink = match[1];
      return invitationCodeInLink === row.invitationCode;
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
      form.processStatuses = [];
      form.managerFullname = '';
      form.managerName = '';
      form.roleId = null;
      searchtrafficsHandler();
    };

    /**
     * 查看学者详情
     * @param {String} userId - 用户ID
     */
    const viewTraffic = (userId) => {
      if (ViewTrafficDrawerRef.value) {
        ViewTrafficDrawerRef.value.showDrawer(userId);
      } else {
        console.error('Drawer component is not ready.');
      }
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
      searchtrafficsHandler();
    };

    /**
     * 更新表格（例如在新增、编辑、删除子节点后调用）
     */
    const updateTable = () => {
      // 替换为实际的父级ID
      const parentId = 1; // 示例
      refresh(parentId);
    };

    /**
     * 切换行展开/折叠
     * @param {Object} row - 当前行数据
     */
    const toggleRow = (row) => {
      if (!row.hasChildren) {
        return;
      }
      if (tableRef.value.isRowExpanded(row)) {
        tableRef.value.collapseRow(row);
      } else {
        tableRef.value.expandRow(row);
      }
    };

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
      searchtrafficsHandler();
    });

    return {
      t,
      form,
      roleOptions,
      enabledOptions,
      formatDate,
      traffics,
      loading,
      copyToClipboard,
      isLinkValid,
      searchtrafficsHandler, // 确保返回名称与模板一致
      resetForm,
      viewTraffic,
      handlePageChange,
      handleSizeChange,
      currentPage,
      pageSize,
      totalElements,
      totalPages,
      ViewTrafficDrawerRef,
      updateTable, // 添加 updateTable 方法
      toggleRow, // 添加 toggleRow 方法
      tableRef, // 添加 tableRef
      ArrowRightBold,
      ArrowLeftBold,
      getRelativeTime,
      getRelativeTimeByTimestamp,
      getRowColor,
      getDisplayTime
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
  