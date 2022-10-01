<template>
  <div class="home">
    <Toast position="top-right" />
    <h1>
      Home
    </h1>
    <Button label="Success" class="p-button-success" @click="showSuccess" />

  </div>
</template>

<script>
import Toast from 'primevue/toast';
import Button from 'primevue/button';

export default {
  
  name: "home",
  components: {Toast,Button},
  data() {
    return {
    };
  },
  	methods: {
		showSuccess() {
            this.$toast.add({severity:'success', summary: 'Success Message', detail:'Message Content', life: 3000});
        },
    }
};
</script>
<style scoped>
.home {
  max-width: 1400px;
  margin: 0 auto;
}
img {
  max-width: 200px;
}
.destinations {
  display: flex;
  justify-content: space-between;
}
a {
  color: lightseagreen;
  text-decoration: none;
}
a:hover,
a:visited {
  text-decoration: underline;
}
</style>
