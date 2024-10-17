import { Component, inject, OnInit, signal } from '@angular/core';
import { Todo } from './models/todos';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  template: `

    <h1>{{title}}</h1>

    <div class="wrapper">

      <input type="text" #inputRef (keydown.enter)="AddTodo(inputRef)" placeholder="Add a new To do">

      <ul class="todo-list">

        @for (todo of todos() ; track todo.id) {

            <li>
              <input type="checkbox" [checked]="todo.completed" (click)="ToggleTodo(todo)">
              <span>{{todo.title}}</span>
              <button class="btn-delete" (click)="RemoveTodo(todo)">❌</button>
            </li>

        }
      </ul>

    </div>

   
  `,
  styles: [  
  ],
})
export class AppComponent implements OnInit {
  title = 'Angular To do List...';

  todos= signal<Todo[]>([])
  http=inject(HttpClient)

 ngOnInit(): void {
   this.http.get<Todo[]>('http://localhost:3000/todos').
   subscribe(res=>{this.todos.set(res)})
 }


 //Logica aggiunta ToDo Logica

  AddTodo=(input:HTMLInputElement)=>{

    this.http.post<Todo>('http://localhost:3000/todos', {
    title:input.value,
    completed:false
  })
  .subscribe(newTodo=>{
  input.value!== '' ?  this.todos.update(todos=>[...todos,newTodo]) : alert('devi inserire un valore');
  input.value='';
  })

  }

  //logica rimozione Todo

  RemoveTodo=(todoToRemove:Todo)=>{

    this.http.delete<Todo>(`http://localhost:3000/todos/${todoToRemove.id} `)
    .subscribe(()=>{
      this.todos.update(todos=>todos.filter(todo=>todo.id !== todoToRemove.id))
    })

  }

  //switch tra checked true e false nel database

  ToggleTodo(todoToToggle: Todo) {
    this.http.patch<Todo>(`http://localhost:3000/todos/${todoToToggle.id}`, {
      ...todoToToggle,
      completed:!todoToToggle.completed
    })
    .subscribe(res=>{
      this.todos.update(todos=>{
        return todos.map(t=> t.id === todoToToggle.id? res:t)
      })
    })
      

  }




}
