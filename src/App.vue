<template>
  <div>
    <Masthead />
    <main class="ui main container">
      <div class="ui grid">
        <div class="four wide column">
          <Deck />
        </div>
        <div class="twelve wide stretched column">
          <router-view/>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import 'semantic-ui-css/semantic.css';

import Masthead from '@/components/Masthead';
import Deck from '@/components/Deck';

export default {
  name: 'app',
  components: {
    Masthead,
    Deck,
  },
};
</script>

<style scoped>
.main.container {
  margin-top: 4em;
}
</style>
