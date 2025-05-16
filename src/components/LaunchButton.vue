<template>
  <div id="btn">
    <button id="launchbtn" :disabled="disabled" @click="$emit('launch')">
      <p>Jogar</p>
    </button>
  </div>
</template>

<script>
export default {
  props: {
    disabled: Boolean,
  },
};
</script>

<style>
#launchbtn {
  height: 70px;
  width: 200px;
  cursor: pointer;
  font-weight: bold;
  background-color: rgb(3, 107, 226);
  border-color: rgb(3, 107, 226);
  border-radius: 10px;
  border-style: groove;
}

#launchbtn:hover {
  background-color: rgb(88, 158, 238);
  border-color: rgb(88, 158, 238);
}

p {
  font-family: Arial;
  font-size: xx-large;
  font-style: normal;
  margin: 5px;
  color: whitesmoke;
}
#launchbtn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>
