<template>
  <div class="logout">
    <Button label="Logout" @click="logout" class="p-button-secondary" />
  </div>
</template>
<script>
import Button from "primevue/button";
export default {
  data() {
    return {
    };
  },
  methods: {
    logout() {
    localStorage.clear();
    window.location.href = "/login";
    }
  },
  components:{Button}
};
</script>
<style scoped>
.logout {
      position: absolute !important;
    margin-left: 93% !important;
    line-height: 15px !important;
}
</style>
