<script setup lang="ts">
const props = defineProps({
  numberLoop: {
    type: Number,
    default: 6,
  },
})
</script>

<template>
  <table cellpadding="0" cellspacing="0" width="100%" class="table_loader_spin">
    <tbody>
      <tr>
        <th class="col1">
          <span></span>
        </th>
        <th class="col4">
          <span></span>
        </th>
        <th class="col5">
          <span></span>
        </th>
      </tr>
      <tr v-for="i in Array(props.numberLoop).fill(0)" :key="i">
        <td class="col1">
          <span></span>
        </td>
        <td class="col4">
          <span></span>
          <span class="sub-temp"></span>
          <span class="sub-temp sub-temp-three"></span>
        </td>
        <td class="col5">
          <span></span>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style lang="scss" scoped>
.table_loader_spin {
  background-color: #fff;
  color: #666;
  width: 100%;
  padding: 0;
  border: 1px solid #dee2e6;
  border-radius: 6px;   
  border-collapse: separate;
  border-spacing: 0;
  border-top: none;
}

.table_loader_spin th {
  background: #f7f9fa;
  border-top: 1px solid #e5e5e5;
  border-bottom: 1px solid #e5e5e5;
  padding: 12px 10px;
  text-align: left;
}
.table_loader_spin td {
  border-top: 0px solid #e5e5e5;
  border-bottom: 1px solid #e5e5e5;
  padding: 12px 10px;
  vertical-align: top;
}
.table_loader_spin span {
  width: calc(100% - 5px);
  height: 15px;
  border-radius: 3px;
  background-image: linear-gradient(90deg, #ddd 0px, #e8e8e8 40px, #ddd 80px);
  background-size: 600px;
  animation: shine-lines-table 1.6s infinite linear;
  display: inline-block;
  min-width: 15px;
}
.table_loader_spin span.sub-temp {
  width: calc(100% - 50%);
  margin-top: 5px;
}
.table_loader_spin span.sub-temp-three {
  width: calc(100% - 70%);
  display: block;
}

/* set bo góc cho header và footer */
.table_loader_spin th:first-child {
  border-top-left-radius: 6px;
}
.table_loader_spin th:last-child {
  border-top-right-radius: 6px;
}
.table_loader_spin tr:last-child td:first-child {
  border-bottom-left-radius: 6px;
}
.table_loader_spin tr:last-child td:last-child {
  border-bottom-right-radius: 6px;
}

.col1 {
  width: 25px;
}
.col2 {
  width: 60px;
}
.col3 {
  width: 45px;
}
.col4 {
  width: 344px;
}
.col5 {
  width: 145px;
}
.col6 {
  width: 113px;
}
.col7 {
  width: 73px;
}
.col8 {
  width: 160px;
}
.col9 {
  width: 92px;
}

@keyframes shine-lines-table {
  0% {
    opacity: 0.4;
  }
  40% {
    opacity: 0.8;
  }
  100% {
    opacity: 0.4;
  }
}
</style>
