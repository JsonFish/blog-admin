<template>
  <div>
    <el-card>
      <template #header>
        <div>分类管理</div>
      </template>
      <el-row>
        <el-form :model="queryParams" :inline="true" ref="queryFormRef">
          <el-form-item label="分类名称">
            <el-input
              v-model="queryParams.categoryName"
              placeholder="请输入分类名称"
              prop="categoryName"
            />
          </el-form-item>
        </el-form>
        <el-button
          type="primary"
          :icon="useRenderIcon(Search)"
          @click="getCategoryInfo"
          >搜索</el-button
        >
        <el-button type="info" :icon="useRenderIcon(Refresh)" @click="reset"
          >重置</el-button
        >
        <el-button
          type="primary"
          :icon="useRenderIcon(Plus)"
          @click="dialogVisible = true"
          >新增</el-button
        >
        <el-button
          :disabled="idList.length > 0 ? false : true"
          type="danger"
          :icon="useRenderIcon(Delete)"
          @click="deleteBtn"
          >批量删除</el-button
        >
      </el-row>
      <el-table
        :loading="true"
        :data="categoryList"
        border
        height="450"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="50" />
        <el-table-column type="index" align="center" label="序号" width="60" />
        <el-table-column
          prop="categoryName"
          align="center"
          label="分类名称"
          width="200"
        />
        <el-table-column
          prop="create_time"
          align="center"
          label="创建时间"
          width="250"
        />
        <el-table-column
          prop="update_time"
          align="center"
          label="更新时间"
          width="300"
        />
        <el-table-column prop="address" label="操作">
          <template #default="scope">
            <div class="btnClass">
              <el-button
                link
                type="primary"
                @click="updateBtn(scope.row)"
                :icon="useRenderIcon(EditPen)"
                >修改</el-button
              >
              <el-popconfirm
                width="220"
                :title="`是否删除分类 ${scope.row.categoryName} ?`"
                :icon="useRenderIcon(Warning)"
                icon-color="#f56c6c"
                @confirm="deleteBtn(scope.row)"
              >
                <template #reference>
                  <el-button link type="danger" :icon="useRenderIcon(Delete)"
                    >删除</el-button
                  >
                </template>
              </el-popconfirm>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <el-pagination
          v-model:current-page="queryParams.currentPage"
          v-model:page-size="queryParams.pageSize"
          :page-sizes="[10, 15, 20]"
          :small="true"
          background
          layout="->,total, sizes, prev, pager, next,jumper"
          :total="total"
          @size-change="getCategoryInfo"
          @current-change="getCategoryInfo"
        />
      </template>
    </el-card>

    <el-dialog
      :close-on-click-modal="false"
      append-to-body
      :title="categoryForm.id ? '修改分类' : '新增分类'"
      v-model="dialogVisible"
      width="30%"
      :before-close="cancel"
    >
      <el-form :model="categoryForm" ref="dialogFormRef" label-width="100px">
        <el-form-item
          label="分类名称"
          :rules="[
            {
              required: true,
              min: 2,
              max: 10,
              message: '分类长度2-15位!',
              trigger: 'blur'
            }
          ]"
          prop="categoryName"
        >
          <el-input
            v-model="categoryForm.categoryName"
            placeholder="请输入分类名称"
            clearable
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="submit(dialogFormRef)">
          确定
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import Search from "@iconify-icons/ep/search";
import Plus from "@iconify-icons/ep/plus";
import Refresh from "@iconify-icons/ep/refresh";
import Delete from "@iconify-icons/ep/delete";
import EditPen from "@iconify-icons/ep/edit-pen";
import Warning from "@iconify-icons/ep/warning";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { onMounted, ref, reactive, nextTick } from "vue";
import type {
  CategoryInfo,
  QueryParams,
  CategoryForm
} from "@/api/category/type";
import {
  getCategoryList,
  addCategory,
  updateCategory,
  deleteCategory
} from "@/api/category";
import { message } from "@/utils/message";
import { type FormInstance } from "element-plus";

const queryParams = reactive<QueryParams>({
  categoryName: "",
  currentPage: 1,
  pageSize: 10
});
const queryFormRef = ref<FormInstance>();
const dialogFormRef = ref<FormInstance>();
const categoryForm = reactive<CategoryForm>({
  id: "",
  categoryName: ""
});
const total = ref<number>(0);
const dialogVisible = ref<boolean>(false);

const categoryList = ref<CategoryInfo[]>();
// 存储批量删除标签id
const idList = ref<Array<number>>([]);
onMounted(() => {
  getCategoryInfo();
});

// 获取category数据
const getCategoryInfo = () => {
  getCategoryList(queryParams).then(response => {
    categoryList.value = response.data.categoryList;
    total.value = response.data.total;
  });
};
// 重置按钮回调
const reset = () => {
  // queryFormRef.value.resetFields(); // 无法重置
  queryParams.categoryName = "";
  getCategoryInfo();
};
// dialog取消按钮回调
const cancel = () => {
  dialogVisible.value = false;
  dialogFormRef.value.resetFields();
  categoryForm.id = ""; // id不能重置
};
// 修改按钮回调
const updateBtn = (row: CategoryInfo) => {
  dialogVisible.value = true;
  // dialog + form resetFields() 无法重置问题
  nextTick(() => {
    categoryForm.id = row.id;
    categoryForm.categoryName = row.categoryName;
  });
};

// dialog确定按钮回调
const submit = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate((valid, fields) => {
    if (valid) {
      if (categoryForm.id) {
        updateCategory(categoryForm).then(response => {
          if (response.code == 200) {
            message("修改成功", { type: "success" });
            dialogVisible.value = false;
            dialogFormRef.value.resetFields();
            getCategoryInfo();
          } else {
            message(response.message, { type: "error" });
          }
          categoryForm.id = "";
        });
      } else {
        console.log(categoryForm);
        addCategory(categoryForm).then(response => {
          if (response.code == 200) {
            message("添加成功", { type: "success" });
            dialogVisible.value = false;
            dialogFormRef.value.resetFields();
            getCategoryInfo();
          } else {
            message(response.message, { type: "error" });
          }
        });
      }
    } else {
      return fields;
    }
  });
};
// checkBox处理
const handleSelectionChange = (categoryList: CategoryInfo[]) => {
  idList.value = categoryList.map((categoryInfo: CategoryInfo) => {
    return categoryInfo.id;
  });
};
// 删除按钮回调
const deleteBtn = (row: CategoryInfo | any) => {
  if (row.id) {
    idList.value = [];
    idList.value.push(row.id);
  }
  categoryForm.id = idList.value;
  deleteCategory(categoryForm).then(response => {
    if (response.code == 200) {
      message("删除成功", { type: "success" });
      getCategoryInfo();
    } else {
      message("删除失败", { type: "error" });
    }
  });
  categoryForm.id = ""; // 重置id
};
</script>

<style lang="scss" scoped></style>
