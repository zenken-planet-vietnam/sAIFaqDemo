<template lang="">
    <div class="mb-1 table-header">
         <div class="title">
            <feather-icon size="32" :icon="data.icon"/>
            <span class="ml-1">{{data.title}}</span>
        </div>
        <div class="description">
            <span>
               {{data.description}}
            </span>
        </div>
    </div>
</template>
<script>
export default {
  props: {
    data: {
      type: Object,
    },
  },
};
</script>
<style lang="scss">
.table-header {
  .title {
    font-size: 18px;
    font-weight: 600;
  }
  .description {
    font-size: 12px;
    padding-left: 50px;
  }
}
</style>