<template>
  <div id="app">
    <div id="nav">
      <router-link to="/todos">
        Todos
      </router-link>
      <router-link to="/create-todo">
        Create New Todo
      </router-link>
    </div>
    <router-view/>
  </div>
</template>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300&display=swap');
  
  html {
    box-sizing: border-box;
    font-family: 'Manrope', sans-serif;
    color: #2c3e50;
  }

  *,
  *:before,
  *:after {
    box-sizing: inherit;
    margin: 0;
    padding: 0;
  }

  #nav {
    padding: 30px;
    text-align: center;
  }

  #nav a {
    text-decoration: none;
    font-weight: bold;
    color: #2c3e50;
    margin-left: 7px;
  }

  #nav a.router-link-exact-active {
    color: #42b983;
  }
</style>
