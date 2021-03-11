import React, {Component} from 'react';

import AppHeader from '../app-header';
import SearchPanel from '../search-panel';
import TodoList from '../todo-list';
import ItemStatusFilter from '../item-status-filter'
import ItemAddForm from '../item-add-form';

import './app.css';

export default class App extends Component {

  maxId = 100;

  state = {
    todoData : [
      this.createTodoItem('Drink Coffee'),
      this.createTodoItem('Make Awesome App'),
      this.createTodoItem('Have a lunch'),
    ],
    term: '',
    filter: 'all'
  };

  createTodoItem(label){
    return {
      label,
      important: false,
      done: false, 
      id: this.maxId++
    }
  }

  deleteItem = (id) => {
    this.setState(( {todoData}) => {
      const idx = todoData.findIndex((el) => el.id === id);
      const before = todoData.slice(0,idx);
      const after = todoData.slice(idx + 1);
      const newArray = [...before, ...after]
      return {
        todoData: newArray,
      };
    });
  };
  
  addItem = (text) => {
    const newItem = this.createTodoItem(text);
    this.setState(({todoData}) => {
      const arr = [...todoData, newItem];
      return {
        todoData: arr,
      };
    });
  };

  onToggleImportant = (id) => {
    this.setState(({todoData}) => {
      return {
        todoData: this.toggleProperty(todoData, id, 'important')
      }
    });
  }

  onToggleDone = (id) => {
    this.setState(({todoData}) => {
      return {
        todoData: this.toggleProperty(todoData, id, 'done')
      }
    });
  }

  toggleProperty(arr, id, propName) {
    const idx = arr.findIndex((el) => el.id === id);
    const oldItem = arr[idx];
    const newItem = {...oldItem, [propName]: !oldItem[propName]};
    return [
      ...arr.slice(0,idx),
      newItem,
      ...arr.slice(idx+1)
    ];
  }

  search = (items, term) => {
    if(term.length === 0) {
      return items;
    }

    return items.filter((el) => {
      return el.label.toLowerCase().indexOf(term.toLowerCase()) > -1;
    });
  }

  filter = (items, filter) => {
    switch(filter) {
      case 'all':
        return items;
      case 'active':
        return items.filter((el) => !el.done);
      case 'done':
        return items.filter((el) => el.done);
      default:
        return items;
    }
  }

  onSearchChange = (term) => {
    this.setState({term})
  }

  onFilterChange = (filter) => {
    this.setState({filter})
  }

  render() {
    const {todoData, term, filter} = this.state;
    const visibleItems = this.filter(this.search(todoData, term, filter),filter);
    const doneCount = todoData.filter((el) => el.done).length;
    const todoCount = todoData.length - doneCount;

    return (
      <div className="todo-app">
        <AppHeader toDo={todoCount} done={doneCount} />
        <div className="top-panel d-flex">
          <SearchPanel onSearchChange = {this.onSearchChange}/>
          <ItemStatusFilter filter = {filter}
            onFilterChange = {this.onFilterChange}/>
        </div>

        <TodoList
        todos={visibleItems}
        onDeleted = {this.deleteItem}
        onToggleDone = {this.onToggleDone}
        onToggleImportant = {this.onToggleImportant} />
        <ItemAddForm onItemAdded = {this.addItem}/>
      </div>
    );
  }
};

