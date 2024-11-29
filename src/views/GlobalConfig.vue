<template>
  <div class="config-container">

    <!-- 默认项目配置 -->
    <el-card class="config-card">
      <h2 class="section-title">{{ t('globalConfig.projectsTitle') }}</h2>
      <el-table :data="projects" :border="true" size="default" style="width: 100%">
        <el-table-column
          prop="projectId"
          :label="t('globalConfig.projectLevel')"
        >
          <template #default="{ row }">
            <span>{{ roleLevelMap[row.roleId] }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="projectName"
          :label="$t('globalConfig.projectName')"
        >
          <template #default="{ row }">
            <el-input
              v-if="row.isEditing"
              v-model="row.projectName"
              placeholder="请输入项目名称"
              size="small"
              class="editable-input"
            />
            <span v-else>{{ row.projectName }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="projectAmount"
          :label="$t('globalConfig.projectAmount')"
        >
          <template #default="{ row }">
            <el-input
              v-if="row.isEditing"
              v-model="row.projectAmount"
              placeholder="请输入项目金额"
              size="small"
              class="editable-input"
            />
            <span v-else>{{ row.projectAmount }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('globalConfig.actions')"
        >
          <template #default="{ row }">
            <el-button
              type="primary"
              size="small"
              @click="editProject(row)"
              v-if="!row.isEditing"
            >
              {{ t('globalConfig.edit') }}
            </el-button>
            <el-button
              type="success"
              size="small"
              @click="updateProject(row)"
              v-if="row.isEditing"
              :disabled="!isProjectChanged(row)"
            >
              {{ t('globalConfig.update') }}
            </el-button>
            <el-button
              type="warning"
              size="small"
              @click="cancelEditProject(row)"
              v-if="row.isEditing"
            >
              {{ t('globalConfig.cancel') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 地区项目配置 -->
    <el-card class="config-card">
      <h2 class="section-title">{{ t('globalConfig.regionsTitle') }}</h2>
      <el-table
        :data="regions"
        :border="true"
        size="default"
        style="width: 100%"
        :span-method="regionSpanMethod"
      >
        <!-- 地区代码列 -->
        <el-table-column
          prop="regionCode"
          :label="$t('globalConfig.regionCode')"
        >
          <template #default="{ row }">
            <template v-if="row.isFirst">
              <el-input
                v-if="row.isEditing"
                v-model="row.regionCode"
                placeholder="请输入地区代码"
                size="small"
                class="editable-input"
              />
              <span v-else>{{ row.regionCode }}</span>
            </template>
          </template>
        </el-table-column>

        <!-- 地区名称列 -->
        <el-table-column
          prop="regionName"
          :label="$t('globalConfig.regionName')"
        >
          <template #default="{ row }">
            <template v-if="row.isFirst">
              <el-input
                v-if="row.isEditing"
                v-model="row.regionName"
                placeholder="请输入地区名称"
                size="small"
                class="editable-input"
              />
              <span v-else>{{ row.regionName }}</span>
            </template>
          </template>
        </el-table-column>

        <!-- 币种列 -->
        <el-table-column
          prop="currency"
          :label="$t('globalConfig.currency')"
        >
          <template #default="{ row }">
            <template v-if="row.isFirst">
              <el-input
                v-if="row.isEditing"
                v-model="row.currency"
                placeholder="请输入币种"
                size="small"
                class="editable-input"
              />
              <span v-else>{{ row.currency }}</span>
            </template>
          </template>
        </el-table-column>

        <!-- 项目名称列 -->
        <el-table-column
          prop="projectName"
          :label="$t('globalConfig.projectName')"
        >
          <template #default="{ row }">
            <el-input
              v-if="row.isEditing"
              v-model="row.projectName"
              placeholder="请输入项目名称"
              size="small"
              class="editable-input"
            />
            <span v-else>{{ row.projectName }}</span>
          </template>
        </el-table-column>

        <!-- 项目金额列 -->
        <el-table-column
          prop="projectAmount"
          :label="$t('globalConfig.projectAmount')"
        >
          <template #default="{ row }">
            <el-input
              v-if="row.isEditing"
              v-model="row.projectAmount"
              placeholder="请输入项目金额"
              size="small"
              class="editable-input"
            />
            <span v-else>{{ row.projectAmount }}</span>
          </template>
        </el-table-column>

        <!-- 操作列 -->
        <el-table-column
          prop="actions"
          :label="$t('globalConfig.actions')"
        >
          <template #default="{ row }">
            <div v-if="row.isFirst" class="actions-cell">
              <el-button
                type="primary"
                size="small"
                @click="editRegion(row)"
                v-if="!row.isEditing"
              >
                {{ t('globalConfig.edit') }}
              </el-button>
              <el-button
                type="success"
                size="small"
                @click="updateRegion(row)"
                v-if="row.isEditing"
                :disabled="!isRegionChanged(row)"
              >
                {{ t('globalConfig.update') }}
              </el-button>
              <el-button
                type="warning"
                size="small"
                @click="cancelEditRegion(row)"
                v-if="row.isEditing"
              >
                {{ t('globalConfig.cancel') }}
              </el-button>
              <el-button
                type="danger"
                size="small"
                @click="deleteRegion(row)"
                v-if="!row.isEditing"
              >
                {{ t('globalConfig.delete') }}
              </el-button>
            </div>
          </template>
        </el-table-column>

      </el-table>

      <el-button type="success" @click="addRegion" class="add-region-btn">
        {{ t('globalConfig.addRegion') }}
      </el-button>
    </el-card>
  </div>
</template>


<script>
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import {
  fetchAllTypes,
  updateRolePermissions as apiUpdateRolePermissions,
  updateProject as apiUpdateProject,
  updateRegion as apiUpdateRegion,
  deleteRegion as apiDeleteRegion,
} from '@/api/utils';
import { ElMessage, ElMessageBox } from 'element-plus';

export default {
  name: 'GlobalConfig',
  setup() {
    const { t } = useI18n();

    const roles = ref([]);
    const projects = ref([]);
    const regions = ref([]);

    const originalProjects = ref([]);
    const originalRegions = ref([]);

    const roleLevelMap = {
      4: '高阶',
      5: '中阶',
      6: '初阶'
    };

    const fetchData = async () => {
      try {
        const response = await fetchAllTypes();
        if (response.data.success) {
          const data = response.data.data;

          // 处理项目
          projects.value = data.projectDTOs.map(project => ({
            ...project,
            isEditing: false,
            original: { ...project },
          }));
          originalProjects.value = JSON.parse(JSON.stringify(projects.value));

          // 处理地区
          regions.value = data.regionProjectsDTOs
          .sort((a, b) => a.regionId - b.regionId)
          .flatMap(region => {
            region.regionProjectDTOs.sort((a, b) => a.projectId - b.projectId);
            return region.regionProjectDTOs.map((proj, index) => ({
              regionId: region.regionId,
              regionCode: region.regionCode,
              regionName: region.regionName,
              currency: region.currency,
              isEditing: region.isEditing || false,
              projectId: proj.projectId,
              projectName: proj.projectName,
              projectAmount: proj.projectAmount,
              projectIsEditing: proj.isEditing || false,
              original: {
                regionCode: region.regionCode,
                regionName: region.regionName,
                currency: region.currency,
                projectName: proj.projectName,
                projectAmount: proj.projectAmount,
              },
              isFirst: index === 0,
            }));
          });
          originalRegions.value = JSON.parse(JSON.stringify(regions.value));
        }
      } catch (error) {
        console.error('Failed to fetch configurations:', error);
      }
    };

    onMounted(fetchData);

    // 角色权限表格的合并单元格方法
    const roleSpanMethod = ({ row, column, rowIndex, columnIndex }) => {
      if (column.property === 'roleName') {
        if (row.isFirst) {
          const count = roles.value.filter(r => r.roleId === row.roleId).length;
          return { rowspan: count, colspan: 1 };
        } else {
          return { rowspan: 0, colspan: 0 };
        }
      }
      return { rowspan: 1, colspan: 1 };
    };

    // 角色权限部分方法
    const editRolePermission = (row) => {
      row.isEditing = true;
    };

    const cancelEditRolePermission = (row) => {
      // 恢复原始值
      row.rate1 = row.original.rate1;
      row.rate2 = row.original.rate2;
      row.isEnabled = row.original.isEnabled;
      row.isEditing = false;
    };

    const isRowChanged = (row) => {
      const original = row.original;
      return (
        original.rate1 !== row.rate1 ||
        original.rate2 !== row.rate2 ||
        original.isEnabled !== row.isEnabled
      );
    };

    const updateRolePermission = async (row) => {
      const payload = {
        roleId: row.roleId,
        permissionId: row.permissionId,
        rate1: row.rate1,
        rate2: row.rate2,
        isEnabled: row.isEnabled,
      };
      try {
        const response = await apiUpdateRolePermissions(payload);
        if (response.data.success) {
          // 更新原始数据
          row.original.rate1 = row.rate1;
          row.original.rate2 = row.rate2;
          row.original.isEnabled = row.isEnabled;
          row.isEditing = false;
          // 可选：显示成功消息
          // ElMessage.success('角色权限更新成功');
        } else {
          // 处理失败，例如显示消息
          console.error('Update role permission failed:', response.data.message);
          // 可选：显示错误消息
          // ElMessage.error(`更新失败: ${response.data.message}`);
        }
      } catch (error) {
        console.error('Failed to update role permission:', error);
        // 可选：显示错误消息
        // ElMessage.error('更新角色权限时发生错误');
      }
    };

    // 全局项目配置部分方法
    const editProject = (project) => {
      project.isEditing = true;
    };

    const cancelEditProject = (project) => {
      // 恢复原始值
      project.projectName = project.original.projectName;
      project.projectAmount = project.original.projectAmount;
      project.isEditing = false;
    };

    const isProjectChanged = (project) => {
      const original = project.original;
      return (
        original.projectName !== project.projectName ||
        original.projectAmount !== project.projectAmount
      );
    };

    const updateProject = async (project) => {
      const payload = {
        projectId: project.projectId,
        projectName: project.projectName,
        projectAmount: project.projectAmount,
      };
      try {
        const response = await apiUpdateProject(payload);
        if (response.data.success) {
          // 更新原始数据
          project.original.projectName = project.projectName;
          project.original.projectAmount = project.projectAmount;
          project.isEditing = false;
          // 可选：显示成功消息
          // ElMessage.success('项目更新成功');
        } else {
          // 处理失败，例如显示消息
          console.error('Update project failed:', response.data.message);
          // 可选：显示错误消息
          // ElMessage.error(`更新失败: ${response.data.message}`);
        }
      } catch (error) {
        console.error('Failed to update project:', error);
        // 可选：显示错误消息
        // ElMessage.error('更新项目时发生错误');
      }
    };

    // 地区项目配置部分方法，自动填充默认项目信息
    const addRegion = () => {
      const newRegionId = -Date.now(); // 使用负的时间戳作为临时的唯一 regionId
      const newRows = projects.value.map((proj, index) => ({
        regionId: newRegionId,
        regionCode: '',
        regionName: '',
        currency: '',
        isEditing: true,
        projectId: proj.projectId,
        projectName: proj.projectName,
        projectAmount: proj.projectAmount,
        original: {
          regionCode: '',
          regionName: '',
          currency: '',
          projectName: '',
          projectAmount: '',
        },
        isFirst: index === 0,
      }));
      regions.value.push(...newRows);
    };


    // 取消编辑地区的方法
    const cancelEditRegion = (row) => {
      // 移除新添加的地区
      if (row.regionId < 0) {
        regions.value = regions.value.filter(r => r.regionId !== row.regionId);
      } else {
        // 恢复原始值
        regions.value.forEach(r => {
          if (r.regionId === row.regionId) {
            r.regionCode = r.original.regionCode;
            r.regionName = r.original.regionName;
            r.currency = r.original.currency;
            r.projectName = r.original.projectName;
            r.projectAmount = r.original.projectAmount;
            r.isEditing = false;
          }
        });
      }
    };

    // 判断地区是否有更改
    const isRegionChanged = (row) => {
      const originalRows = originalRegions.value.filter(r => r.regionId === row.regionId);
      const currentRows = regions.value.filter(r => r.regionId === row.regionId);

      // 检查 originalRows 是否为空，如果为空，直接返回 true
      if (originalRows.length === 0) {
        return true; // 新添加的地区
      }

      for (let i = 0; i < currentRows.length; i++) {
        const current = currentRows[i];
        const original = originalRows[i];

        if (
          current.regionCode !== original.regionCode ||
          current.regionName !== original.regionName ||
          current.currency !== original.currency ||
          current.projectName !== original.projectName ||
          current.projectAmount !== original.projectAmount
        ) {
          return true;
        }
      }
      return false;
    };

    // 更新地区的方法
    const updateRegion = async (row) => {
      const updatedRows = regions.value.filter(r => r.regionId === row.regionId);

      const payload = {
        regionId: row.regionId > 0 ? row.regionId : null, // 新添加的地区 regionId 设为 null
        regionCode: row.regionCode,
        regionName: row.regionName,
        currency: row.currency,
        projects: updatedRows.map(r => ({
          projectId: r.projectId,
          projectName: r.projectName,
          projectAmount: r.projectAmount,
        })),
      };

      try {
        const response = await apiUpdateRegion(payload);
        if (response.data.success) {
          // 如果是新添加的地区，需要更新 regionId，并更新原始数据
          if (row.regionId < 0) {
            const newRegionId = response.data.data.regionId;
            regions.value = regions.value.map(r => {
              if (r.regionId === row.regionId) {
                return {
                  ...r,
                  regionId: newRegionId,
                  original: {
                    regionCode: r.regionCode,
                    regionName: r.regionName,
                    currency: r.currency,
                    projectName: r.projectName,
                    projectAmount: r.projectAmount,
                  },
                  isEditing: false,
                };
              }
              return r;
            });
          } else {
            // 更新原始数据
            updatedRows.forEach(r => {
              r.original.regionCode = r.regionCode;
              r.original.regionName = r.regionName;
              r.original.currency = r.currency;
              r.original.projectName = r.projectName;
              r.original.projectAmount = r.projectAmount;
              r.isEditing = false;
            });
          }
          ElMessage.success('地区更新成功');
        } else {
          console.error('Update region failed:', response.data.message);
          ElMessage.error(`更新失败: ${response.data.message}`);
        }
      } catch (error) {
        console.error('Failed to update region:', error);
        ElMessage.error('更新地区时发生错误');
      }
    };

    // 编辑地区的方法
    const editRegion = (row) => {
      regions.value.forEach(r => {
        if (r.regionId === row.regionId) {
          r.isEditing = true;
        }
      });
    };

    // 合并单元格的方法
    const regionSpanMethod = ({ row, column}) => {
      if (['regionCode', 'regionName', 'currency', 'actions'].includes(column.property)) {
        if (row.isFirst) {
          const count = regions.value.filter(r => r.regionId === row.regionId).length;
          return { rowspan: count, colspan: 1 };
        } else {
          return { rowspan: 0, colspan: 0 };
        }
      }
      return { rowspan: 1, colspan: 1 };
    };

    // 删除地区的方法
    const deleteRegion = (row) => {
      ElMessageBox.confirm(
        '您确定要删除这个地区及其所有项目吗？',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).then(async () => {
        try {
          // 调用删除地区的 API
          const response = await apiDeleteRegion({ regionId: row.regionId });
          if (response.data.success) {
            // 从 regions 中移除该地区
            regions.value = regions.value.filter(r => r.regionId !== row.regionId);
            ElMessage.success('地区已删除');
          } else {
            ElMessage.error(`删除失败: ${response.data.message}`);
          }
        } catch (error) {
          console.error('Failed to delete region:', error);
          ElMessage.error('删除地区时发生错误');
        }
      }).catch(() => {
        // 用户取消删除
      });
    };

    return {
      t,
      roles,
      projects,
      regions,
      roleSpanMethod,
      editRolePermission,
      cancelEditRolePermission,
      isRowChanged,
      updateRolePermission,
      editProject,
      cancelEditProject,
      isProjectChanged,
      updateProject,
      editRegion,
      cancelEditRegion,
      isRegionChanged,
      updateRegion,
      deleteRegion,
      regionSpanMethod,
      roleLevelMap,
      addRegion
    };
  },
};
</script>

<style scoped>
.config-container {
  max-width: 1600px;
  margin: 0 auto;
  padding: 20px;
  /* 移除固定高度和垂直滚动，让 layout.vue 处理滚动 */
}

.config-card {
  margin-bottom: 30px;
  padding: 20px;
  /* 增大内边距以改善布局 */
}

.section-title {
  font-size: 24px;
  margin-bottom: 20px;
  font-weight: bold;
}

.el-table {
  font-size: 16px; /* 增大字体 */
}

.editable-input {
  font-size: 16px; /* 增大字体 */
}

.el-button {
  margin-right: 5px;
  font-size: 14px; /* 增大字体 */
}

.add-region-btn {
  margin-top: 15px;
}

.table-header {
  font-size: 16px;
  font-weight: bold;
}

.el-table th, .el-table td {
  text-align: center;
  padding: 12px 8px; /* 增大内边距 */
}

.el-input, .el-switch {
  width: 100%;
}

@media (max-width: 1200px) {
  .config-container {
    padding: 10px;
  }

  .config-card {
    padding: 15px;
  }

  .section-title {
    font-size: 20px;
  }

  .el-table {
    font-size: 14px;
  }

  .editable-input {
    font-size: 14px;
  }

  .el-button {
    font-size: 13px;
  }
}
</style>
