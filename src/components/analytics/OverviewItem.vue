<template lang="">
    <div class="total-overview-item">
        <b-badge :variant="item.variant">
            <feather-icon  size="21" :icon="item.icon"/>
        </b-badge>
       <div class="ml-1">
            <div class="result">
            <span class="counter">
                {{value}}
            </span>
        </div>
        <div class="description">
            <span>
                {{item.title}}
            </span>
        </div>
       </div>
    </div>
</template>
<script>
import { BBadge } from "bootstrap-vue";
// eslint-disable-next-line no-unused-vars
import $ from "jquery";
export default {
  components: {
    BBadge,
  },
  props: {
    item: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      delay: 50,
      time: 1000,
      value: 0,
    };
  },
  watch: {
    item(newItem) {
      if (newItem) this.counterUp();
    },
  },
  methods: {
    counterUp() {
      this.value = 0;
      let unit = Math.floor((this.item.value / this.time) * this.delay);
      if (unit < 1) unit = 1;
      setInterval(() => {
        this.value += unit;
        if (this.value >= this.item.value) {
          this.value = this.item.value;
          clearInterval();
        }
      }, this.delay);
    },
  },
  mounted() {
    this.counterUp();
  },
};
</script>
<style lang="scss">
.total-overview-item {
  padding: 20px 10px;
  background: #fafbfd;
  margin: 10px 0px;
  border-radius: 0.75rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  .badge {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .result {
    font-weight: 600;
    font-size: 21px;
  }
  .description {
    font-size: 12px;
  }
}
</style>