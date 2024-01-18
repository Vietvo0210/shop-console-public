<!-- LeftNavigation.vue -->
<template>
  <a-menu
      id="dddddd"
      style="width: 256px"
      mode="inline"
      :default-selected-keys="[defaultSelectedKey]"
      :default-open-keys="[defaultOpenKey]"
  >
    <a-sub-menu v-for="item in items" :key="item.key" :title="item.label" @click="handleSubMenuClick(item)">
      <template v-if="item.children">
        <a-menu-item v-for="subItem in item.children" :key="subItem.key">
          {{ subItem.label }}
        </a-menu-item>
      </template>
    </a-sub-menu>
  </a-menu>
</template>

<script setup>
import { ref } from 'vue';

const defaultSelectedKey = ref('1');
const defaultOpenKey = ref('sub1');

const items = [
  { key: '1', label: 'Item 1', children: [{ key: '43', label: 'Subitem 1' }, { key: '45', label: 'Subitem 2' }] },
  { key: '2', label: 'Item 2' },
  { key: '3', label: 'Item 3' },
  { key: '4', label: 'Item 4', children: [{ key: '41', label: 'Subitem 1' }, { key: '42', label: 'Subitem 2' }] },
];

const openSubMenu = ref(false);

const handleSubMenuClick = (item) => {
  if (item.children) {
    // Bạn có thể thực hiện các xử lý cần thiết khi một mục có con được click ở đây
    openSubMenu.value = true;
    console.log('Item with children clicked:', item);
  }
}
</script>
