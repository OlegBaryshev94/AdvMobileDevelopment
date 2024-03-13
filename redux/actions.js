import { ADD_TODO, DELETE_TODO, EDIT_TODO } from "./actionTypes";

let nextTodoId = 0;

export const addTodo = (task, status = 'due') => ({
  type: ADD_TODO,
  payload: {
    id: ++nextTodoId,
    task,
    status
  }
});


export const deleteTodo = id => ({
  type: DELETE_TODO,
  payload: {
    id
  }
});

export const editTodo = (id, newData) => ({
  type: EDIT_TODO,
  payload: {
    id,
    newData
  }
});
