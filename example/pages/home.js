import { html, useEffect, store, useState } from '../../z.js';

export default function Home() {
  // const name = 'Kizz';
  // const userNameChannel = store.addChannel('userName', 'Kizz');
  const [userName, setUserName] = useState('userName', 'kizz');
  console.log('userName initial state: ', userName);

  const handleChange = (e) => {
    console.log('todo completion value::', e.target.checked);
  };

  const handleUserName = (e) => {
    // setUserName(e.target.value);
    console.log('setter', setUserName);
    console.log('New username:', e.target.value);
  };

  const homeHtml = html(`
<section class='home todos container'>
  <div class='flex'>
    <h1 id='userName'>Your Todos, ${userName}</h1>
    <div class='input-group flex-simple'>
      <p>type username:</p>
      <input class='input username' type='text' value='Kizz' onInput={${handleUserName}} />
    </div>
  </div>
  <header class='todo-bar flex'>
    <div class='input-group flex-simple'>
      <input class='add-todo input' type='text' placeholder='add new...' />
      <button class='add-todo button enter'>Enter</button>
      <button class='add-todo button clear'>Clear</button>
      <button class='add-todo button search'>Search</button>
    </div>
  </header>
  <div class='flex'>
    <p>Showing:</p>
    <div class='button-group flex-simple'>
      <button class='active'>All</button>
      <button>Completed</button>
      <button>Archived</button>
    </div>
  </div>
  <ol class='todos-list'>
    <li class='flex'>
      <div class='flex-simple'>
        <input type="checkbox" onChange={${handleChange}} />
        <span>task 1</span>
      </div>
      <div class='flex-simple'>
        <button class='edit button'>edit</button>
        <button class='delete button'>delete</button>
        <button class='archive button'>archive</button>
      </div>
    </li>
  </ol>
</section>`);

  useEffect(
    (data) => {
      console.log('username changed, so useEffect called with data:', data);
      let userNameElement = homeHtml.querySelector('#userName');
      userNameElement.innerText = data.name;
    },
    ['userName']
  );

  return homeHtml;
}
