import Vue from 'vue';
import VueRouter from 'vue-router';
import PageNotFound from '../views/page-not-found';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    redirect: '/todos'
  },
  {
    path: '/todos',
    name: 'todo-list',
    component: () => import(/* webpackChunkName: "todo-list" */ '../views/todo-list.vue'),
  },
  {
    path: '/create-todo',
    name: 'create-todo',
    component: () => import(/* webpackChunkName: "create-todo" */ '../views/create-new-todo.vue'),
  },
  {
    path: '/edit-todo-:title',
    name: 'edit-todo',
    component: () => import(/* webpackChunkName: "edit-todo" */ '../views/edit-todo.vue'),
    props: true,
  },
  {
    path: '*',
    name: 'page-not-found',
    component: PageNotFound,
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
