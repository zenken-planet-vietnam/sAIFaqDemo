<template lang="">
<div class="loading">
    <div class="flower-spinner">
  <div class="dots-container">
    <div class="bigger-dot">
      <div class="smaller-dot"></div>
    </div>
  </div>
</div>
</div>
</template>
<script>
export default {};
</script>
<style lang="css">
.loading {
  width: 100%;
  height: 100%;
  background: rgba(128, 128, 128, 0.4);
  position: absolute;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
.flower-spinner,
.flower-spinner * {
  box-sizing: border-box;
}

.flower-spinner {
  height: 70px;
  width: 70px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

.flower-spinner .dots-container {
  height: calc(70px / 7);
  width: calc(70px / 7);
}

.flower-spinner .smaller-dot {
  background: #28c76f;
  height: 100%;
  width: 100%;
  border-radius: 50%;
  animation: flower-spinner-smaller-dot-animation 2.5s 0s infinite both;
}

.flower-spinner .bigger-dot {
  background: #28c76f;
  height: 100%;
  width: 100%;
  padding: 10%;
  border-radius: 50%;
  animation: flower-spinner-bigger-dot-animation 2.5s 0s infinite both;
}

@keyframes flower-spinner-bigger-dot-animation {
  0%,
  100% {
    box-shadow: rgb(40, 199, 111) 0px 0px 0px, rgb(40, 199, 111) 0px 0px 0px,
      rgb(40, 199, 111) 0px 0px 0px, rgb(40, 199, 111) 0px 0px 0px,
      rgb(40, 199, 111) 0px 0px 0px, rgb(40, 199, 111) 0px 0px 0px,
      rgb(40, 199, 111) 0px 0px 0px, rgb(40, 199, 111) 0px 0px 0px;
  }

  50% {
    transform: rotate(180deg);
  }

  25%,
  75% {
    box-shadow: rgb(40, 199, 111) 26px 0px 0px, rgb(40, 199, 111) -26px 0px 0px,
      rgb(40, 199, 111) 0px 26px 0px, rgb(40, 199, 111) 0px -26px 0px,
      rgb(40, 199, 111) 19px -19px 0px, rgb(40, 199, 111) 19px 19px 0px,
      rgb(40, 199, 111) -19px -19px 0px, rgb(40, 199, 111) -19px 19px 0px;
  }

  100% {
    transform: rotate(360deg);
    box-shadow: rgb(40, 199, 111) 0px 0px 0px, rgb(40, 199, 111) 0px 0px 0px,
      rgb(40, 199, 111) 0px 0px 0px, rgb(40, 199, 111) 0px 0px 0px,
      rgb(40, 199, 111) 0px 0px 0px, rgb(40, 199, 111) 0px 0px 0px,
      rgb(40, 199, 111) 0px 0px 0px, rgb(40, 199, 111) 0px 0px 0px;
  }
}

@keyframes flower-spinner-smaller-dot-animation {
  0%,
  100% {
    box-shadow: rgb(40, 199, 111) 0px 0px 0px, rgb(40, 199, 111) 0px 0px 0px,
      rgb(40, 199, 111) 0px 0px 0px, rgb(40, 199, 111) 0px 0px 0px,
      rgb(40, 199, 111) 0px 0px 0px, rgb(40, 199, 111) 0px 0px 0px,
      rgb(40, 199, 111) 0px 0px 0px, rgb(40, 199, 111) 0px 0px 0px;
  }

  25%,
  75% {
    box-shadow: rgb(40, 199, 111) 14px 0px 0px, rgb(40, 199, 111) -14px 0px 0px,
      rgb(40, 199, 111) 0px 14px 0px, rgb(40, 199, 111) 0px -14px 0px,
      rgb(40, 199, 111) 10px -10px 0px, rgb(40, 199, 111) 10px 10px 0px,
      rgb(40, 199, 111) -10px -10px 0px, rgb(40, 199, 111) -10px 10px 0px;
  }

  100% {
    box-shadow: rgb(40, 199, 111) 0px 0px 0px, rgb(40, 199, 111) 0px 0px 0px,
      rgb(40, 199, 111) 0px 0px 0px, rgb(40, 199, 111) 0px 0px 0px,
      rgb(40, 199, 111) 0px 0px 0px, rgb(40, 199, 111) 0px 0px 0px,
      rgb(40, 199, 111) 0px 0px 0px, rgb(40, 199, 111) 0px 0px 0px;
  }
}
</style>