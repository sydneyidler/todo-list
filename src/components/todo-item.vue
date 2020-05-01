<template>
	<li class="todo-item" :class="[todoClone.isCompleted ? 'item-completed' : '']" @click="handleItemClick">
		<h2 class="todo-title">
      {{ transformedTitle }}  
    </h2>

    <!-- icons -->
    <div class="icons">
      <router-link 
      :to="{ name: 'edit-todo', params: {title: todoClone.title} }"
      title="Edit">
      <font-awesome-icon icon="edit" class="icon"/>
      </router-link>
      <font-awesome-icon @click.stop="$emit('showmodal', todoClone.title)" icon="trash" class="icon" id="delete" title="Delete"/>
    </div>
    <!-- icons -->

		<!-- todo details -->
		<ol v-show="showMore">
			<li v-for="step in todoClone.todoSteps" :key="step.name">
				<span>{{ step.name }}</span>
				<input @change="handleCheckBox" type="checkbox" v-model="step.isStepCompleted">
			</li>
		</ol>
		<!-- todo details -->
	</li>
</template>

<script>
  import cloneDeep from 'lodash.clonedeep';
  import { transformTitle, updateTodo } from '@/data/shared';

  export default {
    name: 'TodoItem',
    data () {
      return {
        todoClone: cloneDeep(this.todo),
        showMore: false,
      };
    },
    props: {
      todo: {
        type: Object,
        default: () => {}
      }
    },
    computed: {
      transformedTitle () {
        return transformTitle(this.todoClone.title);
      }
    },
    methods: {
      handleItemClick (event) {
        if(event.target.tagName === 'INPUT')
          return;

        this.showMore = !this.showMore;
      },

      handleCheckBox () {
        const index = this.todoClone.todoSteps.findIndex(step => step.isStepCompleted === false);
        if(index === -1)
          this.todoClone.isCompleted = true;
        else 
          this.todoClone.isCompleted = false;
        updateTodo(this.todoClone);
      },
    }
  }
</script>

<style scoped>
  @import '../assets/styles/todo-item-style.css';
</style>