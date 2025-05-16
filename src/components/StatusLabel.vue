<template>
  <div class="status">
    <h2>{{ msg }}</h2>
  </div>
</template>

<script>
export default {
  name: "StatusLabel",
  props: {
    msg: {
      type: String,
      required: true,
    },
  },
};
</script>

<style scoped>
.status {
  margin-top: 150px;
  text-align: center;
}

h2 {
  font-family: Arial, Helvetica, sans-serif;
  font-weight: normal;
  color: #444;
}
</style>
