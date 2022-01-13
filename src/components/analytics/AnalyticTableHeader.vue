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
<script lang="ts">
import {Component, Vue,Prop} from "vue-property-decorator"
@Component({})
export default class AnalyticTableHeader extends Vue {
  @Prop({default:null})
  private data!:object
}
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