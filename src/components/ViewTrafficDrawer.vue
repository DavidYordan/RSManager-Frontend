<template>
  <el-drawer
    v-model="drawerVisible"
    title="流量详情"
    :with-header="true"
    size="70%"
    direction="ltr"
    @close="closeDrawer"
  >
    <div v-if="trafficsData" class="drawer-content">
      <!-- 上半部分：左右两张表格共享一个垂直滚动条 -->
      <div class="upper-half">
        <div class="tables-wrapper">
          <!-- 左侧表格 -->
          <el-table :data="leftMainData" :border="true" :show-header="false" stripe class="left-table">
            <el-table-column prop="label" label="字段"></el-table-column>
            <el-table-column prop="value" label="值" show-overflow-tooltip>
              <template #default="scope">
                <template v-if="scope.row.key === 'uniqueId'">
                  <div style="display: flex; align-items: center; gap: 10px;">
                    <span>{{ scope.row.value }}</span>
                    <el-button
                      type="primary"
                      size="small"
                      @click="jumpToTikTokAccount(scope.row.value)"
                    >
                      主页
                    </el-button>
                  </div>
                </template>
                <template v-else-if="scope.row.key === 'link'">
                  <span
                    @click="copyToClipboard(scope.row.value)"
                    :style="{ cursor: 'pointer', color: isLinkValid(scope.row.value) ? '' : 'red' }"
                    title="点击复制"
                  >
                    {{ scope.row.value }}
                  </span>
                </template>
                <template v-else>
                  {{ scope.row.value }}
                </template>
              </template>
            </el-table-column>
          </el-table>

          <!-- 右侧表格 -->
          <el-table :data="rightMainData" :border="true" :show-header="false" stripe class="right-table">
            <el-table-column prop="label" label="字段"></el-table-column>
            <el-table-column prop="value" label="值" show-overflow-tooltip>
              <template #default="scope">
                <template v-if="scope.row.key === 'updatedAt'">
                  {{ getRelativeTime(scope.row.value) }}
                </template>
                <template v-else>
                  {{ scope.row.value }}
                </template>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>

      <!-- 下半部分：TikTok Videos Table，带垂直和横向滚动条 -->
      <div class="lower-half">
        <el-table
          :data="formattedTikTokVideos"
          class="tiktok-videos-table"
          :border="true"
          stripe
          style="width: 100%; margin-top: 20px;"
        >
          <!-- 动态生成的列 -->
          <el-table-column
            v-for="(column, index) in tiktokVideoColumns"
            :key="index"
            :prop="column.prop"
            :label="column.label"
            :min-width="column.minWidth || 100"
            show-overflow-tooltip
          >
            <template v-if="column.prop === 'createTime'" #default="scope">
              {{ getRelativeTimeByTimestamp(scope.row.createTime) }}
            </template>
            <template v-else #default="scope">
              {{ scope.row[column.prop] }}
            </template>
          </el-table-column>

          <!-- 固定列：跳转按钮 -->
          <el-table-column
            label="操作"
            fixed="right"
            width="100"
          >
            <template #default="scope">
              <el-button
                type="primary"
                size="small"
                @click="jumpToTikTokVideo(scope.row)"
              >
                观看
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </el-drawer>
</template>

<script>
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { ElMessage } from 'element-plus'; // 确保引入 ElMessage

export default {
  name: 'ViewTrafficDrawer',
  setup(_, { expose }) {
    const { t } = useI18n();
    const drawerVisible = ref(false);
    const trafficsData = ref(null);

    const showDrawer = (data) => {
      trafficsData.value = data;
      drawerVisible.value = true;
    };

    const closeDrawer = () => {
      drawerVisible.value = false;
      trafficsData.value = null;
    };

    const leftMainData = computed(() => {
      return [
        { key: 'userId', label: "用户ID", value: trafficsData.value?.userId || '-' },
        { key: 'fullname', label: "姓名", value: trafficsData.value?.fullname || '-' },
        { key: 'link', label: "推广链接", value: trafficsData.value?.link || '-' },
        { key: 'regionName', label: "地区", value: trafficsData.value?.regionName || '-' },
        { key: 'uniqueId', label: "tiktok账号", value: trafficsData.value?.uniqueId || '-' },
        { key: 'followingCount', label: "关注数", value: trafficsData.value?.followingCount},
        { key: 'heartCount', label: "点赞数", value: trafficsData.value?.heartCount || '-' },
        { key: 'teacherFullname', label: "导师姓名", value: trafficsData.value?.teacherFullname || '-' },
        { key: 'comments', label: "爬取状态", value: trafficsData.value?.comments || '-' },
        { key: 'platformId', label: "平台Id", value: trafficsData.value?.platformId || '-' },
        { key: 'inviterFullname', label: "邀请人姓名", value: trafficsData.value?.inviterFullname || '-' },
        { key: 'managerFullname', label: "管理人姓名", value: trafficsData.value?.managerFullname || '-' },
      ];
    });

    const rightMainData = computed(() => {
      return [
        { key: 'username', label: "用户名", value: trafficsData.value?.username || '-' },
        { key: 'roleId', label: "角色", value: trafficsData.value?.roleName || '-' },
        { key: 'invitationCode', label: "平台邀请码", value: trafficsData.value?.invitationCode || '-' },
        { key: 'platformInviteCount', label: "平台邀请人数", value: trafficsData.value?.platformInviteCount || '-' },
        { key: 'nickname', label: "Tiktok昵称", value: trafficsData.value?.nickname || '-' },
        { key: 'followerCount', label: "粉丝数", value: trafficsData.value?.followerCount || '-' },
        { key: 'videoCount', label: "视频数", value: trafficsData.value?.videoCount || '-' },
        { key: 'teacherName', label: "导师账号", value: trafficsData.value?.teacherName || '-' },
        { key: 'updatedAt', label: "爬取时间", value: trafficsData.value?.updatedAt || '-' },
        { key: 'risk', label: "链接风险", value: trafficsData.value?.risk },
        { key: 'inviterName', label: "邀请人账号", value: trafficsData.value?.inviterName || '-' },
        { key: 'managerName', label: "管理人账号", value: trafficsData.value?.managerName || '-' },
      ];
    });

    const tiktokVideoColumns = [
      { prop: 'videoDesc', label: '标题' },
      { prop: 'categoryType', label: '类别' },
      { prop: 'collectCount', label: '收藏' },
      { prop: 'commentCount', label: '评论' },
      { prop: 'diggCount', label: '点赞' },
      { prop: 'playCount', label: '观看' },
      { prop: 'repostCount', label: '转发' },
      { prop: 'shareCount', label: '分享' },
      { prop: 'createTime', label: '发布时间' },
    ];

    const copyToClipboard = async (text) => {
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

    // 验证推广链接
    const isLinkValid = (value) => {
      if (!value || typeof value !== 'string') {
        return false;
      }
      const linkPattern = /[a-zA-Z0-9.-]+\/pages\/login\/login\?inviterType=\d+&invitation=([a-zA-Z0-9]+)$/;
      const match = value.match(linkPattern);
      if (!match) {
        return false;
      }
      const invitationCodeInLink = match[1];
      return invitationCodeInLink === trafficsData.value?.invitationCode;
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

    // 确保 tiktokVideoDetailDTOs 是一个数组，并按 createTime 降序排列
    const formattedTikTokVideos = computed(() => {
      if (Array.isArray(trafficsData.value?.tiktokVideoDetailDTOs)) {
        return trafficsData.value.tiktokVideoDetailDTOs.slice().sort((a, b) => b.createTime - a.createTime);
      } else if (trafficsData.value?.tiktokVideoDetailDTOs) {
        return [trafficsData.value.tiktokVideoDetailDTOs];
      }
      return [];
    });

    // 跳转到TikTok账号
    const jumpToTikTokAccount = (uniqueId) => {
      if (uniqueId && uniqueId !== '-') {
        window.open(`https://www.tiktok.com/@${uniqueId}`, '_blank');
      } else {
        ElMessage.warning('无效的Unique ID');
      }
    };

    // 跳转到具体的视频
    const jumpToTikTokVideo = (row) => {
      const uniqueId = trafficsData.value?.uniqueId;
      const videoId = row.tiktokVideoId;
      if (uniqueId && videoId) {
        window.open(`https://www.tiktok.com/@${uniqueId}/video/${videoId}`, '_blank');
      } else {
        ElMessage.warning('无效的视频信息');
      }
    };

    expose({ showDrawer });

    return {
      t,
      drawerVisible,
      trafficsData,
      leftMainData,
      rightMainData,
      tiktokVideoColumns,
      formattedTikTokVideos,
      closeDrawer,
      getRelativeTime,
      getRelativeTimeByTimestamp,
      copyToClipboard,
      isLinkValid,
      jumpToTikTokAccount,
      jumpToTikTokVideo,
      fallbackCopyText
    };
  },
};
</script>

<style scoped>
.drawer-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
}

.upper-half,
.lower-half {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.tables-wrapper {
  display: flex;
  gap: 20px;
  height: 100%;
  overflow-y: auto;
}

.left-table,
.right-table {
  flex: 1;
}

.tiktok-videos-table {
  width: 100%;
  height: 100%;
  overflow: auto;
}

/* 调整表格内的滚动条 */
.upper-half .el-table__body-wrapper {
  max-height: none; /* 取消单个表格的最大高度限制 */
}

.lower-half .el-table__body-wrapper {
  max-height: none;
}

/* 可选：调整TikTok Videos Table的列宽，以确保横向滚动 */
.tiktok-videos-table .el-table__header-wrapper,
.tiktok-videos-table .el-table__body-wrapper {
  overflow-x: auto;
}
</style>
