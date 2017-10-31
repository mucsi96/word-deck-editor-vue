<template>
  <div class="ui card">
    <div class="ui center aligned content">
      <div class="header">
        <button type="button" class="ui basic icon button" @click="playAudio">
          <i class="play large icon"></i>
        </button>
        <audio ref="audio">
          <source :src="sound" type="audio/mpeg">
        </audio>
      </div>
      <div class="description">
        {{word}}
      </div>
    </div>
    <div class="ui bottom attached icon buttons">
      <button type="button" class="ui button" :class="{ pink: pined }" @click="togglePin">
        <i class="pin icon"></i>
      </button>
      <button type="button" class="ui button" :class="{ pink: pinedPhrase }" @click="togglePinPhrase">
        <i class="talk outline icon"></i>
      </button>
    </div>
  </div>
</template>
<script>
export default {
  name: 'PronuncicationCard',
  props: ['word', 'sound', 'pined', 'pinedPhrase'],
  methods: {
    playAudio() {
      this.$refs.audio.play();
    },
    togglePin() {
      if (!this.pined) {
        this.$emit('pin');
      } else {
        this.$emit('unpin');
      }
    },
    togglePinPhrase() {
      if (!this.pinedPhrase) {
        this.$emit('pinPhrase');
      } else {
        this.$emit('unpinPhrase');
      }
    },
  },
};
</script>

