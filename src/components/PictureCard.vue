<template>
  <div class="ui card">
    <img class="ui fluid image" :src="image" />
    <div class="content"></div>
    <button type="button" class="ui bottom attached icon button" :class="{ pink: pined }" @click="togglePin">
      <i class="pin icon"></i>
    </button>
  </div>
</template>
<script>
export default {
  name: 'PictureCard',
  props: ['image', 'pined'],
  methods: {
    togglePin() {
      if (!this.pined) {
        this.$emit('pin');
      } else {
        this.$emit('unpin');
      }
    },
  },
};
</script>
