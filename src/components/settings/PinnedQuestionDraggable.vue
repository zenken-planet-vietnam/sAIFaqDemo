<template>
  <b-row>
    <b-col md="12">
      <h3>Transition</h3>
      <b-row class="mb-2">
        <b-col md="2">
          <b-button variant="primary" @click="addNewQuestion">+</b-button>

        </b-col>
      </b-row>
      <draggable
        class="list-group"
        tag="ul"
        v-model="pinnedQuestionList"
        v-bind="dragOptions"
        @start="drag = true"
        @end="drag = false"
        @change="orderChange"
      >
        <transition-group type="transition" :name="!drag ? 'flip-list' : null">
          <li
            class="list-group-item"
            v-for="element in pinnedQuestionList"
            :key="element.question_id"
          >
            <i
              :class="
                element.fixed ? 'fa fa-anchor' : 'glyphicon glyphicon-pushpin'
              "
              @click="element.fixed = !element.fixed"
              aria-hidden="true"
            ></i>
            #{{ element.display_order }} {{element.label }}
          </li>
        </transition-group>
      </draggable>
    </b-col>
  </b-row>
</template>

<script lang="ts">
import draggable from "vuedraggable";
import {Component, Prop} from "vue-property-decorator";
import {BCol, BRow, BTable} from "bootstrap-vue";
import SettingMixin from "@/@core/mixins/settingMixin";
import { mixins } from "vue-class-component";
import {SettingModule} from "@/store/modules/setting";

@Component({
  components: {
    BRow,
    BCol,
    BTable,
    draggable,
  },
})
export default class PinnedQuestionDraggable extends mixins(SettingMixin) {
  message = [
    "vue.draggable",
    "draggable",
    "component",
    "for",
    "vue.js 2.0",
    "based",
    "on",
    "Sortablejs"
  ];
  drag = false
  isLoading = false

  @Prop({ default: [] })
  private items!: Array<object>;

  @Prop({ default: {} })
  private queryItem!: object;

  sort() {
    this.items = this.items.sort((a:any, b:any) => a.order - b.order);
  }

  addNewQuestion() {
    this.isLoading = true
    // this.items.push({name: "new message", order: this.items.length + 1})
  }

  orderChange(e: any) {
    // this.items = this.items.map((name:any, index:any) => {
    //     return { name, order: index + 1 };
    //   })
    // this.fetchDataPinnedQuestion()
    // this.items = this.pinnedQuestionByQueryID
    console.log(e)
    // console.log("AFTER CHANGED: ")
    // console.log(this.pinnedQuestionList)
  }
  get dragOptions() {
      return {
        animation: 200,
        group: "description",
        disabled: false,
        ghostClass: "ghost"
      };
    }
  get loadingPanel() {
    return this.isLoading
  }
  async fetchDataPinnedQuestion() {
      await SettingModule.getPinnedQuestionByQuery(this.queryItem, {})
  }

  get pinnedQuestionList() {
    return this.pinnedQuestionByQueryID
  }

  set pinnedQuestionList(value: any) {
    SettingModule.setPinnedQuestionList({
      queryItem: this.queryItem, value:value
    })
  }
}


</script>

<style scoped>
.button {
  margin-top: 35px;
}

.flip-list-move {
  transition: transform 0.5s;
}

.no-move {
  transition: transform 0s;
}

.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}

.list-group {
  min-height: 20px;
}

.list-group-item {
  cursor: move;
}

.list-group-item i {
  cursor: pointer;
}
</style>