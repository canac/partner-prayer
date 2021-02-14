import { RouteRecordRaw, createRouter, createWebHashHistory } from 'vue-router';
import PartnerDetail from './components/PartnerDetail.vue';
import PartnerSchedule from './components/PartnerSchedule.vue';

const routes: Array<RouteRecordRaw> = [{
  path: '/',
  redirect: '/schedule',
}, {
  path: '/schedule',
  name: 'PartnerSchedule',
  component: PartnerSchedule,
  children: [{
    path: 'partner/:partnerId',
    name: 'PartnerDetail',
    component: PartnerDetail,
  }],
}];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
