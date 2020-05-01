<template>
  <main>

    <!-- list of todos -->
    <ul>
      <TodoItem
      v-for="todo in todos"
      :key="todo.title"
      :todo="todo"
      @showmodal="showModal"/>
    </ul>
    <!-- list of todos -->

    <Modal v-if="isModalVisible" @decline="isModalVisible = false" @accept="deleteTodo"/>
  </main>
</template>

<script>
  import { getTodosFromDb, deleteTodo } from '@/data/shared';
  import TodoItem from '@/components/todo-item';
  import Modal from '@/components/modal';

	export default {
		name: 'TodoList',
    data () {
      return {
        todos: [],
        isModalVisible: false,
      };
    },
    components: { TodoItem, Modal },
    async created () {
      this.todos = await getTodosFromDb();
    },
    methods: {
      showModal (title) {
        this.isModalVisible = true;
        this.title = title;       
      },
      deleteTodo () {
        this.isModalVisible = false;

        deleteTodo(this.title);
        delete this.title;

        this.$router.go();
      }
    }
	}
</script>
  
<style> 
  main {
    margin-top: 10px;
  }

  main > ul {
    list-style: none;
  }
</style>