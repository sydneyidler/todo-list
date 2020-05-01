<template>
  <div class="new-todo">
    <h2>Edit Todo</h2>
    
    <!-- error message -->
    <p v-show="error">Rules:</p>
    <ol v-show="error">
      <li>You can't have 2 todos with the same title</li>
      <li>All inputs mustn't be empty</li>
    </ol>
    <!-- error message -->
    
    <!-- edit form -->
    <font-awesome-icon icon="reply" class="icon" title="Undo Last Change" @click="undoLastChange"/>
    <font-awesome-icon icon="share" class="icon" title="Repeat Last Change" @click="repeatLastChange"/>
    <label for="todo-title">
      Todo Title:
    </label>
    <input type="text" v-model="todoClone.title" @input="handleTodoChange" id="todo-title" required>
    <label >
      Todo Steps:
      <font-awesome-icon icon="plus" class="icon" title="Add" @click="addEmptyStep"/>
    </label>
    <ol>
      <li v-for="step in todoClone.todoSteps" :key="step.index">
        <input type="text" v-model="step.name" @input="handleTodoChange">
        <font-awesome-icon icon="minus" class="icon" title="Delete" @click="deleteStep(step)"/>
      </li>
    </ol>
    <!-- edit form -->

    <!-- buttons -->
    <div class="todo-buttons">
      <button @click="isCancelEditModalVisible = true">
        Cancel Edit
      </button>
      <button @click="saveChanges">
        Save Changes
      </button>
      <button @click="isDeleteModalVisible = true">
        Delete Todo
      </button>
    </div>
    <!-- buttons -->

    <Modal v-if="isCancelEditModalVisible" @decline="isCancelEditModalVisible = false" @accept="cancelEdit"/>
    <Modal v-if="isDeleteModalVisible" @decline="isDeleteModalVisible = false" @accept="deleteTodo"/>
  </div>
</template>

<script>
  import Modal from '@/components/modal';
  import { deleteTodo, addTodo, getTodosFromDb, transformTitle, transformBackTitle, isTitleUniqueAndNotEmpty, isStepsNotEmpty } from '@/data/shared';
  import cloneDeep from 'lodash.clonedeep';

  export default {
    name: 'EditTodo',
    data () {
      return {
        todos: [],
        todoTitle: '',
        changes: [],
        todoClone: {},
        changesPointer: 0,
        error: false,
        isDeleteModalVisible: false,
        isCancelEditModalVisible: false,
      };
    },
    components: { Modal },
    props: {
      title: {
       type: String,
       default: '',
       required: true,
     }
    },
    async created () {
      this.todos = await getTodosFromDb();
      const index = this.todos.findIndex(todo => todo.title === this.title);

      if(index === -1)
        this.$router.push({ name: 'page-not-found' });
      else {
        this.todoTitle = this.todos[index].title;
        this.todoClone = cloneDeep(this.todos[index]);
        this.todoClone.title = transformTitle(this.todoClone.title);
        for(let i = 0; i < this.todoClone.todoSteps.length; i++) {
          this.todoClone.todoSteps[i] = { index: i, ...this.todoClone.todoSteps[i] };
        }
        this.changes.push(cloneDeep(this.todoClone));
      }
    },
    methods: {
      cancelEdit () {
        this.$router.push({ name: 'todo-list' });
      },

      async saveChanges () {
        const transformedBackTitle = transformBackTitle(this.todoClone.title);
        const todoIndex = this.todos.findIndex(todo => todo.title === this.title);

        if(await isTitleUniqueAndNotEmpty(transformedBackTitle, todoIndex) && isStepsNotEmpty(this.todoClone.todoSteps)) {
          await deleteTodo(this.todoTitle);
          this.todoClone.title = transformedBackTitle;
          addTodo(this.todoClone);
          this.$router.push({ name: 'todo-list' }); 
        } else {
          this.error = true;
        }
      },

      deleteTodo () {
        const index = this.todos.findIndex(todo => todo.title === this.title);
        deleteTodo(this.todos[index].title);
        this.$router.push({ name: 'todo-list' });
      },

      handleTodoChange () {
        if(this.changesPointer < this.changes.length - 1) {
          this.changes.splice(this.changesPointer + 1, this.changes.length - this.changesPointer - 1);
        }

        this.changes.push(cloneDeep(this.todoClone));
        this.changesPointer++;

        if(this.changes.length > 20) {
          this.changes.shift();
          this.changesPointer--;
        }
      },

      undoLastChange () {
        if(this.changesPointer > 0)
          this.changesPointer--;
        this.todoClone = cloneDeep(this.changes[this.changesPointer]);
      },

      repeatLastChange () {
        if(this.changesPointer < this.changes.length - 1)
          this.changesPointer++;
        this.todoClone = cloneDeep(this.changes[this.changesPointer]);
      },

      deleteStep (step) {
        const stepIndex = this.todoClone.todoSteps.findIndex(item => item.name === step.name);
        this.todoClone.todoSteps.splice(stepIndex, 1);
      },

      addEmptyStep () {
        this.todoClone.todoSteps.push({ index: this.todoClone.todoSteps.length, name: '', isStepCompleted: false });
      }
    },
  }
</script>

<style>
  @import '../assets/styles/new-todo-style.css';
</style>