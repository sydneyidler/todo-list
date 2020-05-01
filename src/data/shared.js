
export const transformTitle = (title) => {
  const titleArr = title.split('-');
  for(let i = 0; i < titleArr.length; i++) {
    titleArr[i] = titleArr[i].charAt(0).toUpperCase() + titleArr[i].substr(1);
  }
  return titleArr.join(' ');
}

export const transformBackTitle = (title) => {
  return title.toLowerCase().split(' ').join('-');
}

export const isTitleUniqueAndNotEmpty = async (title, exception) => {
  let todos = await getTodosFromDb();

  if(title === '')
    return false;

  const index = todos.findIndex(todo => todo.title === title);
  if(index !== -1 && index !== exception)
    return false;

  return true;
}

export const isStepsNotEmpty = (todoSteps) => {
  if(todoSteps.length < 1)
    return false;
  
  const index = todoSteps.findIndex(step => step.name === '');
  if(index !== -1)
    return false;
  
  return true;
}

const getDb = async () => {
  return new Promise((resolve, reject) => {
    let request = window.indexedDB.open('Todos', '1.0');

    request.onerror = e => {
      console.log('Error opening db', e);
      reject('Error');
    };

    request.onsuccess = e => {
      resolve(e.target.result);
    }

    request.onupgradeneeded = e => {
      console.log('onupgradeneeded');
      let db = e.target.result;
      db.createObjectStore('todos', { keyPath: 'title' });
    }
  });
}

export const getTodosFromDb = async () => {
  let db = await getDb();
  return new Promise((resolve) => {
    let trans = db.transaction('todos', 'readonly');
    trans.oncomplete = () => {
      resolve(todos);
    };

    let store = trans.objectStore('todos');
    let todos = [];

    store.openCursor().onsuccess = e => {
      let cursor = e.target.result;
      if (cursor) {
        todos.push(cursor.value);
        cursor.continue();
      }
    }
  });
}

export const addTodo = async (todo) => {
  await addTodoToDb(todo);
}

const addTodoToDb = async (todo) => {
  let db = await getDb();
  return new Promise((resolve) => {
    let trans = db.transaction('todos', 'readwrite');
    trans.oncomplete = () => {
      resolve();
    };

    let store = trans.objectStore('todos');
    store.add(todo);
  });
}

export const deleteTodo = async (title) => {
  await deleteTodoFromDb(title);
}

const deleteTodoFromDb = async (title) => {
  let db = await getDb();
  return new Promise((resolve) => {
    let trans = db.transaction('todos', 'readwrite');
    trans.oncomplete = () => {
      resolve();
    }

    let store = trans.objectStore('todos');
    store.delete(title);
  });
}

export const updateTodo = async (todo, todoTitle) => {
  await updateTodoInDb(todo, todoTitle);
} 

const updateTodoInDb = async (todo, todoTitle) => {
  let db = await getDb();
  return new Promise((resolve) => {
    let trans = db.transaction('todos', 'readwrite');
    trans.oncomplete = () => {
      resolve();
    }

    let store = trans.objectStore('todos');
    store.put(todo, todoTitle);
  });
}