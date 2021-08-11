import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { createApp } from 'vue';
import App from './components/App.vue';
import router from './router';

const app = createApp(App);
app.use(router);
// Wait for the router to be ready before mounting the app
router
  .isReady()
  .then(() => {
    app.component('FontAwesomeIcon', FontAwesomeIcon).mount('#app');
  })
  .catch((err) => {
    throw err;
  });

if (import.meta.hot) {
  import.meta.hot.accept();
  import.meta.hot.dispose(() => {
    app.unmount();
  });
}
