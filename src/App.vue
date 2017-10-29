<template>
  <div>
    <Masthead />
    <main>
      <router-view/>
    </main>
  </div>
</template>
<script>
import 'semantic-ui-css/semantic.css';

import Masthead from '@/components/Masthead';

export default {
  name: 'app',
  components: {
    Masthead,
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
