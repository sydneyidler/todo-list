<template>
	<div class="new-todo">
  <h2>Create New Todo</h2>

  <!-- error message -->
  <p v-show="error">Rules:</p>
  <ol v-show="error">
    <li>You can't have 2 todos with the same title</li>
    <li>All inputs mustn't be empty</li>
  </ol>
  <!-- error message -->

  <!-- create todo form -->
    <div class="todo-form">
      <label for="todo-title">
        Type Todo Title:
      </label>
      <input type="text" v-model="newTodo.title" id="todo-title" required>
      <label for="new-step">
        Type New Step:
      </label>
      <input type="text" v-model="newStep" id="new-step" required>
    </div>

    <!-- todo steps -->
    <font-awesome-icon icon="plus" class="icon" title="Add" @click="handleAddStep"/>
    <div class="todo-steps">
      <label v-show="newTodo.todoSteps.length">
        Todo Steps:
      </label>
      <ol>
        <li v-for="step in newTodo.todoSteps" :key="step.name">
          <p>{{ step.name }}</p>
        </li>
      </ol>
    </div>
    <!-- todo steps -->

    <button @click="handleAddTodo">
      Add Todo
    </button>
  </div>
  <!-- create todo form -->

</template>

<script>
  import { addTodo, transformBackTitle, isTitleUniqueAndNotEmpty } from '@/data/shared';

	export default {
		name: 'CreateNewTodo',
    data () {
      return {
        newTodo: {
          title: '',
          todoSteps: [],
          isCompleted: false,
        },
        newStep: '',
        error: false,
      };
    },
    methods: {
      handleAddStep () {
        if(this.newStep !== '')
          this.newTodo.todoSteps.push({ name: this.newStep, isStepCompleted: false });
        else
          this.error = true;

        this.newStep = '';
      },
      async handleAddTodo () {
        const transformedBackTitle = transformBackTitle(this.newTodo.title);

        if(this.newTodo.todoSteps.length > 0 && await isTitleUniqueAndNotEmpty(transformedBackTitle)) {
          this.newTodo.title = transformedBackTitle;
          addTodo(this.newTodo);
          this.$router.push({ name: 'todo-list' });
        } else {
          this.error = true;
        }
      }
    },
	}
</script>

<style scoped>
  @import '../assets/styles/new-todo-style.css';
</style>