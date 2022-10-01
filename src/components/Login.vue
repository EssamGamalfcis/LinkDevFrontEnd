<template>
  <div class="login mt-5">
    <Toast position="top-right" />
    <h1>Login</h1>
    <div class="form">
      <label for="username">Username</label>
      <input
        v-model="loginParam.userName"
        type="text"
        name="username"
        class="input"
      />
      <label for="password">Password</label>
      <input v-model="loginParam.password" type="password" class="input" />
      <button @click="login" class="btn btn-primary">Login</button>
    </div>
  </div>
</template>
<script>
import service from "../API/ApiServicesCall";
import Toast from 'primevue/toast';
export default {
  data() {
    return {
      loginParam: {
        userName: null,
        password: null,
      },
    };
  },
  methods: {
    login() {
      if (
        this.loginParam.userName != null &&
        this.loginParam.password != null
      ) {
        service
          .PostCallService("User/Login", this.loginParam)
          .then((res) => {
            window.localStorage.setItem("token", res.data.data.token);
            window.localStorage.setItem("userId", res.data.data.userId);
            this.$toast.add({
              severity: "success",
              summary: res.data.message,
              life: 3000,
            });
            if (res.data.data.roles.some((value) => "Admin" == value))
            {
              this.$router.push("/BranchSetup");
            }
            else
            {
              this.$router.push("/BranchesBook");
            }
          })
          .catch((err) => {
            this.$toast.add({
              severity: "error",
              summary: err.data.message,
              life: 3000,
            });
          });
      } else {
        this.$toast.add({
          severity: "error",
          summary: "Please enter username and password",
          life: 3000,
        });
      }
    },
  },
  components: {Toast},
};
</script>
<style scoped>
.form {
  display: flex;
  flex-direction: column;
  max-width: 400px;
  margin: 0 auto;
}
</style>
