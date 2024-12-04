<template>
  <div class="config-container">
    <!-- 地区项目配置 -->
    <el-card class="config-card">
      <h2 class="section-title">地区项目配置</h2>
      <el-button
        type="primary"
        @click="addRegionProjectGroup"
      >
        新增
      </el-button>
      <el-table
        :data="processedRegionProjects"
        :span-method="spanMethod"
        style="width: 100%; margin-top: 10px;"
        :border="true"
      >
        <!-- 地区名称列 -->
        <el-table-column
          prop="regionName"
          label="地区"
        >
          <template #default="{ row }">
            <template v-if="row.isAddingGroup && isFirstRowInGroup(row)">
              <el-select
                v-model="row.regionName"
                placeholder="选择地区"
                @change="onRegionChange(row)"
              >
                <el-option
                  v-for="option in optionsForRegions"
                  :key="option.regionCode"
                  :label="option.regionName"
                  :value="option.regionName"
                />
              </el-select>
            </template>
            <template v-else>
              {{ row.regionName }}
            </template>
          </template>
        </el-table-column>

        <!-- 币种列 -->
        <el-table-column
          prop="currencyName"
          label="币种"
        >
          <template #default="{ row }">
            <template v-if="row.isAddingGroup && isFirstRowInGroup(row)">
              <el-select
                v-model="row.currencyName"
                placeholder="选择币种"
                @change="onCurrencyChange(row)"
              >
                <el-option
                  v-for="option in currencyOptions"
                  :key="option.currencyCode"
                  :label="option.currencyName"
                  :value="option.currencyName"
                />
              </el-select>
            </template>
            <template v-else>
              {{ row.currencyName }}
            </template>
          </template>
        </el-table-column>

        <!-- 角色列 -->
        <el-table-column
          prop="roleId"
          label="角色"
        >
          <template #default="{ row }">
            {{ roleMap[row.roleId] }}
          </template>
        </el-table-column>

        <!-- 项目名称列 -->
        <el-table-column
          prop="projectName"
          label="项目名称"
        >
          <template #default="{ row }">
            <template v-if="row.isPEditing || row.isREditing">
              <el-select
                v-model="row.projectName"
                placeholder="选择项目"
              >
                <el-option
                  v-for="option in optionsForProjects"
                  :key="option.projectId"
                  :label="option.projectName"
                  :value="option.projectName"
                />
              </el-select>
            </template>
            <template v-else>
              {{ row.projectName }}
            </template>
          </template>
        </el-table-column>

        <!-- 项目金额列 -->
        <el-table-column
          prop="projectAmount"
          label="项目金额"
        >
          <template #default="{ row }">
            <template v-if="row.isPEditing || row.isREditing">
              <el-input
                v-model.number="row.projectAmount"
                type="number"
              />
          </template>
          </template>
        </el-table-column>

        <!-- 换汇参考金额 -->
        <el-table-column
          prop="exchangeAmount"
          label="换汇($)"
        >
          <template #default="{ row }">
            {{ exchangeAmount(row.projectAmount, row.currencyCode) }}
          </template>
        </el-table-column>

        <!-- 行操作 -->
        <el-table-column
          label="行操作"
          prop="projectActions"
          width="180"
        >
          <template #default="{ row }">
            <el-button
              v-if="!row.isPEditing && !row.isREditing"
              size="small"
              @click="editRow(row)"
            >
              编辑
            </el-button>
            <el-button
              v-if="row.isREditing && !row.isAddingRow"
              size="small"
              @click="cancelEditRow(row)"
            >
              取消
            </el-button>
            <el-button
              v-if="row.isREditing && !row.isAddingRow"
              size="small"
              type="primary"
              @click="updateRow(row)"
            >
              更新
            </el-button>
            <el-button
              v-if="!row.isREditing && !row.isPEditing"
              size="small"
              type="danger"
              @click="deleteRow(row)"
            >
              删除
            </el-button>
            <el-button
              v-if="row.isAddingRow"
              size="small"
              type="primary"
              @click="saveNewRow(row)"
            >
              保存
            </el-button>
            <el-button
              v-if="row.isAddingRow"
              size="small"
              @click="cancelNewRow(row)"
            >
              取消
            </el-button>
          </template>
        </el-table-column>

        <!-- 组操作 -->
        <el-table-column
          label="组操作"
          prop="groupActions"
          width="180"
        >
          <template #default="{ row }">
            <template v-if="isFirstRowInGroup(row)">
              <el-button
                v-if="!row.isAddingGroup && !row.isPEditing  && !isGroupRowEditing(row.groupId)"
                size="small"
                @click="editGroup(row.groupId)"
              >
                编辑
              </el-button>
              <el-button
                v-if="!row.isAddingGroup && row.isPEditing"
                size="small"
                @click="cancelEditGroup(row.groupId)"
              >
                取消
              </el-button>
              <el-button
                v-if="!row.isAddingGroup && row.isPEditing"
                size="small"
                type="primary"
                @click="updateGroup(row.groupId)"
              >
                更新
              </el-button>
              <el-button
                v-if="!row.isPEditing  && !isGroupRowEditing(row.groupId)"
                size="small"
                type="danger"
                @click="deleteGroup(row.groupId)"
              >
                删除
              </el-button>
              <el-button
                v-if="!row.isPEditing  && !isGroupRowEditing(row.groupId)"
                size="small"
                type="primary"
                @click="addRegionProjectRow(row)"
              >
                新增
              </el-button>
              <el-button
                v-if="row.isAddingGroup"
                size="small"
                type="primary"
                @click="saveNewGroup(row)"
              >
                保存
              </el-button>
              <el-button
                v-if="row.isAddingGroup"
                size="small"
                @click="cancelNewGroup(row)"
              >
                取消
              </el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 默认项目配置 -->
    <el-card class="config-card">
      <h2 class="section-title">默认项目配置</h2>
      <el-button 
        type="primary"
        @click="addProjectRow"
      >
        新增
      </el-button>
      <el-table :data="projectDTOs" style="width: 100%; margin-top: 10px" :border="true">
        <el-table-column prop="projectId" label="项目ID" width="80" />
        <el-table-column prop="roleId" label="角色" >
          <template #default="{ row }">
            <template v-if="row.isEditing">
              <el-select v-model="row.roleId" placeholder="选择角色">
                <el-option
                  v-for="[roleId, roleName] in Object.entries(roleMap)"
                  :key="roleId"
                  :label="roleName"
                  :value="roleId"
                />
              </el-select>
            </template>
            <template v-else>
              {{ roleMap[row.roleId] }}
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="projectName" label="项目名称" >
          <template #default="{ row }">
            <template v-if="row.isEditing">
              <el-input v-model="row.projectName" />
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="projectAmount" label="项目金额($)" >
          <template #default="{ row }">
            <template v-if="row.isEditing">
              <el-input v-model.number="row.projectAmount" type="number" />
            </template>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template #default="{ row }">
            <el-button
              v-if="!row.isEditing"
              size="small"
              @click="editProject(row)"
            >
              编辑
            </el-button>
            <el-button
              v-if="row.isEditing && !row.isAdding"
              size="small"
              @click="cancelEditProject(row)"
            >
              取消
            </el-button>
            <el-button
              v-if="row.isEditing && !row.isAdding"
              size="small"
              type="primary"
              @click="updateProject(row)"
            >
              更新
            </el-button>
            <el-button
              v-if="!row.isEditing && !row.isAdding"
              size="small"
              type="danger"
              @click="deleteProject(row)"
            >
              删除
            </el-button>
            <el-button
              v-if="row.isAdding"
              size="small"
              type="primary"
              @click="saveNewProject(row)"
            >
              保存
            </el-button>
            <el-button
              v-if="row.isAdding"
              size="small"
              @click="cancelNewProject(row)"
            >
              取消
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 地区和币种配置 -->
    <el-card class="config-card">
      <h2 class="section-title">地区和币种配置</h2>
      <el-button
        type="primary"
        @click="addRegionCurrencyRow"
      >
        新增
      </el-button>
      <el-table :data="regionCurrencyDTOs" style="width: 100%; margin-top: 10px" :border="true">
        <el-table-column prop="regionName" label="地区">
          <template #default="{ row }">
            <template v-if="row.isEditing">
              <el-input v-model="row.regionName" />
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="regionCode" label="地区代码">
          <template #default="{ row }">
            <template v-if="row.isEditing">
              <el-input v-model="row.regionCode" />
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="currencyName" label="币种">
          <template #default="{ row }">
            <template v-if="row.isEditing">
              <el-input v-model="row.currencyName" />
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="currencyCode" label="币种代码">
          <template #default="{ row }">
            <template v-if="row.isEditing">
              <el-input v-model="row.currencyCode" />
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="rate" label="汇率" />
        <el-table-column label="操作" width="180">
          <template #default="{ row }">
            <el-button
              v-if="!row.isEditing && !row.isAdding"
              size="small"
              @click="editRegionCurrency(row)"
            >
              编辑
            </el-button>
            <el-button
              v-if="row.isEditing && !row.isAdding"
              size="small"
              @click="cancelEditRegionCurrency(row)"
            >
              取消
            </el-button>
            <el-button
              v-if="row.isEditing && !row.isAdding"
              size="small"
              type="primary"
              @click="updateRegionCurrency(row)"
            >
              更新
            </el-button>
            <el-button
              v-if="!row.isEditing && !row.isAdding"
              size="small"
              type="danger"
              @click="deleteRegionCurrency(row)"
            >
              删除
            </el-button>
            <el-button
              v-if="row.isAdding"
              size="small"
              type="primary"
              @click="saveNewRegionCurrency(row)"
            >
              保存
            </el-button>
            <el-button
              v-if="row.isAdding"
              size="small"
              @click="cancelNewRegionCurrency(row)"
            >
              取消
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted } from 'vue';
import {
  fetchAllTypes as apiFetchAllTypes,
  updateProject as apiUpdateProject,
  deleteProject as apiDeleteProject,
  addProject as apiAddProject,
  updateRegionCurrency as apiUpdateRegionCurrency,
  deleteRegionCurrency as apiDeleteRegionCurrency,  
  addRegionCurrency as apiAddRegionCurrency,
  updateRegionProjects as apiUpdateRegionProjects,
  deleteRegionProjects as apiDeleteRegionProjects,
  addRegionProjects as apiAddRegionProjects,
} from '@/api/utils';
import { ElMessage, ElMessageBox } from 'element-plus';

export default {
  name: 'RegionProjectsConfig',
  setup() {
    const projectDTOs = ref([]);
    const regionCurrencyDTOs = ref([]);
    const regionProjectsDTOs = ref([]);

    const processedRegionProjects = ref([]);
    let newGroupId = -1;

    const addProjectRow = () => {
      const newProject = {
        projectId: null,
        projectName: '',
        projectAmount: null,
        isAdding: true,
        isEditing: true,
      };
      projectDTOs.value.unshift(newProject);
    };

    const saveNewProject = async (row) => {
      const payload = {
        roleId: row.roleId,
        projectName: row.projectName,
        projectAmount: row.projectAmount,
      };
      try {
        const response = await apiAddProject(payload);
        if (response.data && response.data.success) {
          row.projectId = response.data.data.projectId;
          row.isAdding = false;
          row.original = { ...row };
          ElMessage.success('项目新增成功');
          row.isEditing = false;
        } else {
          ElMessage.error('新增失败: ' + response.data.message);
        }
      } catch (error) {
        console.error('Failed to add project:', error);
        ElMessage.error('新增项目时发生错误');
      }
    };

    const deleteProject = async (row) => {
      try {
        await ElMessageBox.confirm('确定删除此项目吗?', '提示', {
          type: 'warning',
        });

        const response = await apiDeleteProject({ projectId: row.projectId });
        if (response.data && response.data.success) {
          const index = projectDTOs.value.findIndex(item => item === row);
          if (index !== -1) {
            projectDTOs.value.splice(index, 1);
          }
          ElMessage.success('删除成功');
        } else {
          ElMessage.error('删除失败: ' + response.data.message);
        }
      } catch (error) {
        if (error !== 'cancel') {
          console.error(error);
          ElMessage.error('删除失败');
        }
      }
    };

    const cancelNewProject = (row) => {
      const index = projectDTOs.value.findIndex((item) => item === row);
      if (index !== -1) {
        projectDTOs.value.splice(index, 1);
      }
    };

    const addRegionProjectGroup = () => {
      const newGroupRow = {
        groupId: newGroupId--,
        regionName: '',
        regionCode: '',
        currencyName: '',
        currencyCode: '',
        projectName: '',
        projectId: '',
        projectAmount: null,
        roleId: '',
        isPEditing: true,
        isAddingGroup: true,
        original: {},
      };
      processedRegionProjects.value.unshift(newGroupRow);
    };

    const saveNewGroup = async (row) => {
      const requestData = [
        {
          regionCode: row.regionCode,
          regionName: row.regionName,
          currencyCode: row.currencyCode,
          currencyName: row.currencyName,
          projectId: row.projectId,
          projectName: row.projectName,
          projectAmount: row.projectAmount,
        },
      ];
      try {
        const response = await apiAddRegionProjects(requestData);
        if (response.data && response.data.success) {
          // 重新获取数据
          await fetchData();
          ElMessage.success('新增组成功');
        } else {
          ElMessage.error('新增失败: ' + response.data.message);
        }
      } catch (error) {
        console.error('Failed to add region project group:', error);
        ElMessage.error('新增组时发生错误');
      }
    };

    const cancelNewGroup = (row) => {
      const index = processedRegionProjects.value.findIndex((item) => item === row);
      if (index !== -1) {
        processedRegionProjects.value.splice(index, 1);
      }
    };

    const addRegionProjectRow = (row) => {
      const newRow = {
        groupId: row.groupId,
        regionName: row.regionName,
        regionCode: row.regionCode,
        currencyName: row.currencyName,
        currencyCode: row.currencyCode,
        projectName: '',
        projectId: '',
        projectAmount: null,
        roleId: '',
        isREditing: true,
        isAddingRow: true,
        original: {},
      };
      // const index = processedRegionProjects.value.findIndex((item) => item === row);
      // processedRegionProjects.value.splice(index + 1, 0, newRow);
      processedRegionProjects.value.push(newRow);
      sortProcessedRegionProjects();
    };

    const sortProcessedRegionProjects = () => {
      processedRegionProjects.value.sort((a, b) => {
        if (a.regionName === b.regionName) {
          return a.currencyName.localeCompare(b.currencyName);
        }
        return a.regionName.localeCompare(b.regionName);
      });
    };

    const saveNewRow = async (row) => {
      const requestData = [
        {
          regionCode: row.regionCode,
          regionName: row.regionName,
          currencyCode: row.currencyCode,
          currencyName: row.currencyName,
          projectId: row.projectId,
          projectName: row.projectName,
          projectAmount: row.projectAmount,
        },
      ];
      try {
        const response = await apiAddRegionProjects(requestData);
        if (response.data && response.data.success) {
          // 重新获取数据
          await fetchData();
          ElMessage.success('新增行成功');
        } else {
          ElMessage.error('新增失败: ' + response.data.message);
        }
      } catch (error) {
        console.error('Failed to add region project row:', error);
        ElMessage.error('新增行时发生错误');
      }
    };

    const cancelNewRow = (row) => {
      const index = processedRegionProjects.value.findIndex((item) => item === row);
      if (index !== -1) {
        processedRegionProjects.value.splice(index, 1);
      }
    };

    const addRegionCurrencyRow = () => {
      const newRegionCurrency = {
        regionCode: '',
        regionName: '',
        currencyCode: '',
        currencyName: '',
        rate: null,
        isAdding: true,
        isEditing: true,
      };
      regionCurrencyDTOs.value.unshift(newRegionCurrency);
    };

    const saveNewRegionCurrency = async (row) => {
      const payload = {
        regionCode: row.regionCode,
        regionName: row.regionName,
        currencyCode: row.currencyCode,
        currencyName: row.currencyName,
      };
      try {
        const response = await apiAddRegionCurrency(payload);
        if (response.data && response.data.success) {
          row.isAdding = false;
          row.original = { ...row };
          ElMessage.success('地区和币种新增成功');
          row.isEditing = false;
        } else {
          ElMessage.error('新增失败: ' + response.data.message);
        }
      } catch (error) {
        console.error('Failed to add region currency:', error);
        ElMessage.error('新增地区和币种时发生错误');
      }
    };

    const deleteRegionCurrency = async (row) => {
      try {
        await ElMessageBox.confirm('确定删除此地区和币种吗?', '提示', {
          type: 'warning',
        });

        const payload = {
          regionCode: row.regionCode,
          regionName: row.regionName,
          currencyCode: row.currencyCode,
          currencyName: row.currencyName,
        };
        const response = await apiDeleteRegionCurrency(payload);
        if (response.data && response.data.success) {
          const index = regionCurrencyDTOs.value.findIndex(item => item === row);
          if (index !== -1) {
            regionCurrencyDTOs.value.splice(index, 1);
          }
          ElMessage.success('删除成功');
        } else {
          ElMessage.error('删除失败: ' + response.data.message);
        }
      } catch (error) {
        if (error !== 'cancel') {
          console.error(error);
          ElMessage.error('删除失败');
        }
      }
    };

    const cancelNewRegionCurrency = (row) => {
      const index = regionCurrencyDTOs.value.findIndex((item) => item === row);
      if (index !== -1) {
        regionCurrencyDTOs.value.splice(index, 1);
      }
    };

    const optionsForRegions = computed(() => {
      // 提取地区选项
      return regionCurrencyDTOs.value.map(item => ({
        regionCode: item.regionCode,
        regionName: item.regionName,
        currencyCode: item.currencyCode,
        currencyName: item.currencyName,
      }));
    });

    const optionsForProjects = computed(() => {
      // 提取项目选项
      return projectDTOs.value.map(item => ({
        projectId: item.projectId,
        projectName: item.projectName,
        roleId: item.roleId,
      }));
    });

    const roleMap = {
      4: '高阶学员',
      5: '中阶学员',
      6: '初阶学员',
    };

    const rateMap = ref({});

    // 监听单行 projectName 的变化，更新本行 roleId
    watch(processedRegionProjects, (newVal, oldVal) => {
      newVal.forEach(row => {
        const project = projectDTOs.value.find(item => item.projectName === row.projectName);
        if (project) {
          row.projectId = project.projectId;
          row.roleId = project.roleId;
        }
      });
    }, { deep: true });

    const currencyOptions = computed(() => {
      // 提取唯一的币种选项
      const currencies = {};
      regionCurrencyDTOs.value.forEach(item => {
        currencies[item.currencyName] = item.currencyCode;
      });
      return Object.keys(currencies).map(name => ({
        currencyName: name,
        currencyCode: currencies[name],
      }));
    });

    const fetchData = async () => {
      try {
        const response = await apiFetchAllTypes();
        console.log(response);
        if (response.data && response.data.success) {
          projectDTOs.value = response.data.data.projectDTOs;
          regionCurrencyDTOs.value = response.data.data.regionCurrencyDTOs;
          regionProjectsDTOs.value = response.data.data.regionProjectsDTOs;

          processRegionProjects();
          processReginCurrencies();
          processProjects();
        } else {
          ElMessage.error('获取数据失败');
        }
      } catch (error) {
        console.error(error);
        ElMessage.error('获取数据出错: ' + error.message);
      }
    };

    const exchangeAmount = (projectAmount, currencyCode) => {
      if (!currencyCode) return;
      if (!rateMap.value[currencyCode]) return;
      if (!projectAmount) return 0;
      return Math.round(projectAmount / rateMap.value[currencyCode]);
    };

    onMounted(fetchData);

    const processRegionProjects = () => {
      const data = [];
      const groupMap = {};
      let groupId = 0;

      // 对数据进行排序，确保相同的groupId的行是连续的
      regionProjectsDTOs.value.sort((a, b) => {
        if (a.regionName === b.regionName) {
          return a.currencyName.localeCompare(b.currencyName);
        }
        return a.regionName.localeCompare(b.regionName);
      });

      regionProjectsDTOs.value.forEach(item => {
        const groupKey = item.regionName + '_' + item.currencyName;
        if (!groupMap[groupKey]) {
          groupId++;
          groupMap[groupKey] = groupId;
        }
        data.push({
          ...item,
          groupId: groupMap[groupKey],
          isREditing: false,
          isPEditing: false,
          isAddingGroup: false,
          isAddingRow: false,
          original: { ...item },
        });
      });

      processedRegionProjects.value = data;
    };

    const processReginCurrencies = () => {
      regionCurrencyDTOs.value.forEach(item => {
        item.isEditing = false;
        item.isAdding = false;
        item.original = { ...item };
        rateMap.value[item.currencyCode] = item.rate;
      });
    };

    const processProjects = () => {
      projectDTOs.value.forEach(item => {
        item.isEditing = false;
        item.isAdding = false;
        item.original = { ...item };
      });
    };

    const spanMethod = ({ row, column, rowIndex }) => {
      if (['regionName', 'currencyName', 'groupActions'].includes(column.property)) {
        // const groupRows = processedRegionProjects.value.filter(item => item.groupId === row.groupId);
        // const firstIndex = processedRegionProjects.value.findIndex(item => item === groupRows[0]);
        const firstIndex = processedRegionProjects.value.findIndex(item => item.groupId === row.groupId);
        const groupLength = processedRegionProjects.value.filter(item => item.groupId === row.groupId).length;
        if (rowIndex === firstIndex) {
          return {
            // rowspan: groupRows.length,
            rowspan: groupLength,
            colspan: 1,
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0,
          };
        }
      }
      return { rowspan: 1, colspan: 1 };
    };

    const isFirstRowInGroup = (row) => {
      // const groupRows = processedRegionProjects.value.filter(item => item.groupId === row.groupId);
      // return groupRows[0] === row;
      const firstIndex = processedRegionProjects.value.findIndex(item => item.groupId === row.groupId);
      return processedRegionProjects.value[firstIndex] === row;
    };

    const isGroupRowEditing = (groupId) => {
      return processedRegionProjects.value.some(row => row.groupId === groupId && (row.isREditing));
    };

    const editRow = (row) => {
      row.isREditing = true;
    };

    const cancelEditRow = (row) => {
      Object.assign(row, row.original);
      row.isREditing = false;
    };

    const updateRow = async (row) => {
      const requestData = [{
        regionCode: row.regionCode,
        currencyCode: row.currencyCode,
        projectId: row.projectId,
        projectAmount: row.projectAmount,
      }];

      try {
        const response = await apiUpdateRegionProjects(requestData);
        if (response.data && response.data.success) {
          row.original = { ...row };
          row.isREditing = false;
          ElMessage.success('更新成功');
        } else {
          ElMessage.error('更新失败: ' + response.data.message);
        }
      } catch (error) {
        console.error(error);
        ElMessage.error('更新失败');
      }
    };

    const deleteRow = async (row) => {
      try {
        await ElMessageBox.confirm('确定删除此项目吗?', '提示', {
          type: 'warning',
        });

        const requestData = [{
          regionCode: row.regionCode,
          currencyCode: row.currencyCode,
          projectId: row.projectId,
        }];

        const response = await apiDeleteRegionProjects(requestData);
        if (response.data && response.data.success) {
          const index = processedRegionProjects.value.findIndex(item => item === row);
          if (index !== -1) {
            processedRegionProjects.value.splice(index, 1);
          }
          ElMessage.success('删除成功');
        } else {
          ElMessage.error('删除失败: ' + response.data.message);
        }
      } catch (error) {
        if (error !== 'cancel') {
          console.error(error);
          ElMessage.error('删除失败');
        }
      }
    };

    const editGroup = (groupId) => {
      processedRegionProjects.value.forEach(item => {
        if (item.groupId === groupId) {
          item.isPEditing = true;
        }
      });
    };

    const cancelEditGroup = (groupId) => {
      processedRegionProjects.value.forEach(item => {
        if (item.groupId === groupId) {
          Object.assign(item, item.original);
          item.isPEditing = false;
        }
      });
    };

    const updateGroup = async (groupId) => {
      const groupRows = processedRegionProjects.value.filter(item => item.groupId === groupId);
      const requestData = groupRows.map(row => ({
        regionCode: row.regionCode,
        regionName: row.regionName,
        currencyCode: row.currencyCode,
        currencyName: row.currencyName,
        projectId: row.projectId,
        projectName: row.projectName,
        projectAmount: row.projectAmount,
      }));

      try {
        const response = await apiUpdateRegionProjects(requestData);
        if (response.data && response.data.success) {
          groupRows.forEach(row => {
            row.original = { ...row };
            row.isPEditing = false;
          });
          ElMessage.success('更新成功');
        } else {
          ElMessage.error('更新失败: ' + response.data.message);
        }
      } catch (error) {
        console.error(error);
        ElMessage.error('更新失败');
      }
    };

    const deleteGroup = async (groupId) => {
      try {
        await ElMessageBox.confirm('确定删除此地区和币种的所有项目吗?', '提示', {
          type: 'warning',
        });

        const groupRows = processedRegionProjects.value.filter(item => item.groupId === groupId);
        const requestData = groupRows.map(row => ({
          regionCode: row.regionCode,
          currencyCode: row.currencyCode,
          projectId: row.projectId,
        }));

        const response = await apiDeleteRegionProjects(requestData);
        if (response.data && response.data.success) {
          processedRegionProjects.value = processedRegionProjects.value.filter(item => item.groupId !== groupId);
          ElMessage.success('删除成功');
        } else {
          ElMessage.error('删除失败: ' + response.data.message);
        }
      } catch (error) {
        if (error !== 'cancel') {
          console.error(error);
          ElMessage.error('删除失败');
        }
      }
    };

    const onRegionChange = (row) => {
      const region = regionCurrencyDTOs.value.find(item => item.regionName === row.regionName);
      if (region) {
        row.regionCode = region.regionCode;
        row.currencyName = region.currencyName;
        row.currencyCode = region.currencyCode;
      } else {
        row.regionCode = null;
        row.currencyName = '';
        row.currencyCode = '';
      }
    };

    const onCurrencyChange = (row) => {
      const currency = currencyOptions.value.find(item => item.currencyName === row.currencyName);
      if (currency) {
        row.currencyCode = currency.currencyCode;
      } else {
        row.currencyCode = '';
      }
    };

    // 项目配置部分的方法
    const editProject = (row) => {
      row.isEditing = true;
      row.original = { ...row };
    };

    const cancelEditProject = (row) => {
      Object.assign(row, row.original);
      row.isEditing = false;
    };

    const updateProject = async (row) => {
      const payload = {
        projectId: row.projectId,
        roleId: row.roleId,
        projectName: row.projectName,
        projectAmount: row.projectAmount,
      };
      try {
        const response = await apiUpdateProject(payload);
        if (response.data && response.data.success) {
          row.original = { ...row };
          row.isEditing = false;
          ElMessage.success('项目更新成功');
        } else {
          ElMessage.error('更新失败: ' + response.data.message);
        }
      } catch (error) {
        console.error('Failed to update project:', error);
        ElMessage.error('更新项目时发生错误');
      }
    };

    // 地区和币种配置的方法
    const editRegionCurrency = (row) => {
      row.isEditing = true;
      row.original = { ...row };
    };

    const cancelEditRegionCurrency = (row) => {
      Object.assign(row, row.original);
      row.isEditing = false;
    };

    const updateRegionCurrency = async (row) => {
      const payload = {
        regionCode: row.regionCode,
        regionName: row.regionName,
        currencyName: row.currencyName,
        currencyCode: row.currencyCode,
      };
      try {
        const response = await apiUpdateRegionCurrency(payload);
        if (response.data && response.data.success) {
          row.original = { ...row };
          row.isEditing = false;
          ElMessage.success('地区和币种更新成功');
        } else {
          ElMessage.error('更新失败: ' + response.data.message);
        }
      } catch (error) {
        console.error('Failed to update region currency:', error);
        ElMessage.error('更新地区和币种时发生错误');
      }
    };

    return {
      addProjectRow,
      addRegionProjectGroup,
      addRegionProjectRow,
      addRegionCurrencyRow,
      saveNewProject,
      cancelNewProject,
      saveNewGroup,
      cancelNewGroup,
      saveNewRow,
      cancelNewRow,
      saveNewRegionCurrency,
      cancelNewRegionCurrency,
      projectDTOs,
      regionCurrencyDTOs,
      processedRegionProjects,
      optionsForRegions,
      optionsForProjects,
      currencyOptions,
      roleMap,
      rateMap,
      exchangeAmount,
      spanMethod,
      isFirstRowInGroup,
      isGroupRowEditing,
      editRow,
      cancelEditRow,
      updateRow,
      deleteRow,
      editGroup,
      cancelEditGroup,
      updateGroup,
      deleteGroup,
      onRegionChange,
      onCurrencyChange,
      editProject,
      cancelEditProject,
      updateProject,
      deleteProject,
      editRegionCurrency,
      deleteRegionCurrency,
      cancelEditRegionCurrency,
      updateRegionCurrency,
    };
  },
};
</script>

<style scoped>
.config-container {
  padding: 20px;
}

.config-card {
  margin-bottom: 30px;
  padding: 20px;
}

.section-title {
  font-size: 16px;
  font-weight: bold;
}

.el-table .el-button {
  margin-right: 5px;
}
</style>
