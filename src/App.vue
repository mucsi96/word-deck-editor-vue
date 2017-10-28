<template>
  <div>
    <Masthead />
    <main>
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
main {
  margin-top: 4em;
  margin-left: 8em;
  margin-right: 8em;
}

.large.icon {
  font-size: 2em;
}
</style>
