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
      <button type="button" class="ui button">
        <i class="pin icon"></i>
      </button>
      <button type="button" class="ui button">
        <i class="talk outline icon"></i>
      </button>
    </div>
  </div>
</template>
<script>
export default {
  name: 'PronuncicationCard',
  props: ['word', 'sound'],
  methods: {
    playAudio() {
      this.$refs.audio.play();
    },
  },
};
</script>

