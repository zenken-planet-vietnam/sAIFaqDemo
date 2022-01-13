/* eslint-disable no-unused-vars */
<template lang="">
    <div class="auth-wrapper h-100">
    <div class="auth-inner">
      <div class="w-100 d-lg-flex align-items-center justify-content-center px-5">
          <b-img
            class="logo mb-1"
            fluid
            :src="sideImg"
            alt="Login img"
          />
        </div>
        <div class="title">
            {{"Welcome to sAI Search ! 👋"}}
        </div>
        <b-card-text class="mb-1">
            Please sign-in to your account and start the adventure
          </b-card-text>
        <b-form>
      <b-form-group
        id="input-group-1"
        label="Username:"
        label-for="input-1"
      >
        <b-form-input
          id="input-1"
          v-model="username"
          type="text"
          placeholder="Enter username"
          required
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-2" label="Password:" label-for="input-2">
        <b-form-input
          type="password"
          id="input-2"
          v-model="password"
          placeholder="Enter password"
          required
        ></b-form-input>
      </b-form-group>


      <div class="mt-2 mb-2">
      <b-button class="submit-btn"  @click="login" variant="primary">Login</b-button>
      </div>
    </b-form>
    </div>
   
  </div>
</template>
<script>
import { BFormInput, BFormGroup, BForm, BCardText, BImg } from "bootstrap-vue";
import { Component, Vue } from "vue-property-decorator";
// eslint-disable-next-line no-unused-vars
import useJwt from "@core/auth";
@Component({
  components: {
    BFormInput,
    BFormGroup,
    BForm,
    BCardText,
    BImg,
  },
})
export default class Login extends Vue {
  username = "adminhasacl";
  password = "Hello123#";
  sideImg = require("@/assets/logo.png");
  // login
  login = () => {
    console.log(this.$store);
    // eslint-disable-next-line no-debugger
    //  useJwt.healthcheck()
    useJwt
      .login({
        name: this.username,
        password: this.password,
      })
      .then((response) => {
        const { data } = response;
        if (data) {
          useJwt.setToken(data.data.access_token),
            useJwt.setRefreshToken(data.data.refresh_token);
          this.$router.push("/");
        }
      });
  };
  // reset data
  resetData = () => {
    this.username = "";
    this.password = "";
  };
}
// export default {
//   components: {
//     BFormInput,
//     BFormGroup,
//     BForm,
//     BCardText,
//     BImg,
//   },
//   data() {
//     return {
//       username: "adminhasacl",
//       password: "Hello123#",
//       sideImg: require("@/assets/logo.png"),
//     };
//   },
//   created() {
//     localStorage.clear();
//   },
//   methods: {
//     // login
//     login() {
//       // eslint-disable-next-line no-debugger
//       //  useJwt.healthcheck()
//       useJwt
//         .login({
//           name: this.username,
//           password: this.password,
//         })
//         .then((response) => {
//           const { data } = response;
//           if (data) {
//             useJwt.setToken(data.data.access_token),
//               useJwt.setRefreshToken(data.data.refresh_token);
//             this.$router.push("/");
//           }
//         });
//     },
//     resetData() {
//       this.username = "";
//       this.password = "";
//     },
//   },
// };
</script>
<style lang="scss">
.auth-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  background: #fff;
}
.auth-inner {
  max-width: 400px;
  width: 100%;
  border-radius: 6px;
  box-shadow: 0 4px 24px 0 rgba(34, 41, 47, 0.1);
  padding: 20px;
  .logo {
    height: 50px;
  }
  .title {
    font-size: 18px;
    font-weight: 500;
  }
  .submit-btn {
    width: 100%;
  }
}
</style>