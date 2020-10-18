import React, { Component } from 'react'
import './App.css'
import firebase from './config/firebase'
import Header from './components/Header'
import Footer from './components/Footer'

class App extends Component {
  constructor() {
    console.log('constructor()')
    super()
    this.state = { todos: [], value: '' }
  }

  add_todos = () => {
    console.log('add_todos()')
    if (this.state.value !== '') {
      var key = firebase.database().ref('/').child('todos').push().key
      var date = new Date();
      var dateFormat = `${date.getDate()}-${date.getMonth()}-${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
      let data = { title: this.state.value, dateCreated: dateFormat, key: key }
      firebase.database().ref('todos/' + key).set(data)

      this.setState({
        todos: [...this.state.todos, data],
        value: ''
      })
    } else {
      alert('Error: Enter value')
    }
  }
  2
  edit_todos = (localKey) => {
    console.log('edit_todos()')
    this.state.todos[localKey].edit = true
    this.setState({
      todos: this.state.todos
    })
  }

  handleChange = (e, localKey) => {
    console.log('handleChange()')
    this.state.todos[localKey].title = e.target.value
    this.setState({
      todos: this.state.todos
    })
  }

  update_todos = (localKey, key) => {
    console.log('update_todos()')
    this.state.todos[localKey].edit = false
    firebase.database().ref('todos/' + key).set(this.state.todos[localKey])
    this.setState({
      todos: this.state.todos
    })
  }

  delete_todos = (key, localKey) => {
    console.log('delete_todos()')
    console.log(key)
    firebase.database().ref('todos/' + key).remove()
    this.state.todos.splice(localKey, 1)
    this.setState({
      todos: this.state.todos
    })
  }

  componentDidMount() {
    console.log('componentDidMount()')
    firebase.database().ref("todos").on("value", snapshot => {
      let todos = [];
      snapshot.forEach(snap => {
        todos.push(snap.val());
      });
      this.setState({ todos: todos });
    });
  }

  render() {
    console.log('render()')
    let { todos, value } = this.state
    return (
      <div>
        <Header />
        <div className='p-1 bg-primary text-center'>
          <input className='mb-1 h2 text-center' value={value} onChange={(e) => this.setState({ value: e.target.value })} type="text" placeholder="Enter value" />
          <br />
          <input style={{ fontSize: '22px', width: '394px' }} className="text-center btn btn-warning" onClick={this.add_todos} type="button" value="Add Todo" />
        </div>
        <br />
        <div style={{ marginBottom: '60px' }} className='container'>
          <table>
            <thead>
              <tr>
                <th rowSpan='2'>No</th>
                <th rowSpan='2'>Todos</th>
                <th colSpan='2'>Actions</th>
                <th rowSpan='2'>Created Date &amp; Time</th>
              </tr>
              <tr>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {todos.map((data, key) => {
                return <tr key={key}>
                  <td>{key + 1}</td>
                  <td>{data.edit ? <input onChange={(e) => this.handleChange(e, key)} value={data.title} style={{ width: '100%' }} type="text" /> : data.title}</td>
                  {data.edit ?
                    <td className='deleteOrEditClass' onClick={() => this.update_todos(key, data.key)}>Update</td> :
                    <td className='deleteOrEditClass' onClick={() => this.edit_todos(key)}>Edit</td>
                  }

                  <td className='deleteOrEditClass' onClick={() => this.delete_todos(data.key, key)}>Delete</td>
                  <td>{data.dateCreated}</td>
                </tr>
              })}
            </tbody>
          </table>
        </div>
        <Footer />
      </div>
    )
  }
}

export default App;
