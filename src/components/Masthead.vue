<template>
  <header class="ui fixed inverted icon menu">
    <div class="ui container">
      <router-link
        to="/"
        class="header item"
      >
        Word Deck Editor
      </router-link>
      <router-link
        to="/add-new-words"
        class="item"
      >
          <i class="plus icon"></i>
      </router-link>
      <router-link
        tag="div"
        to="/upload"
        class="item"
      >
          <i class="cloud upload icon"></i>
      </router-link>
      <div class="item" @click="$emit('refresh')">
        <i class="refresh icon"></i>
      </div>
      <div class="item" @click="$emit('erase')">
        <i class="erase icon"></i>
      </div>
    </div>
  </header>
</template>
<script>
  export default {
    name: 'Masthead',
  };
</script>
