# Z parser

The parser behind z js framework jsx in broswer templating, born from rudimentary fork of [jsx2json parser](https://github.com/stolksdorf/jsx2json).

`z-parser` parses JSX into usable JSON.

example of jsx syntax

```jsx
<div id="app">
  <h1 className="title">Hello, React!</h1>
  <p>This is a example of JSX.</p>
  <ul>
    <li>Item 1</li>
    <li>Item 2</li>
    <li>Item 3</li>
  </ul>
  <input type="text" value="Initial value" />
  <button onClick={() => console.log('Clicked!')}>Click me</button>
</div>
```

### features

- No dependacies
- Props without values are defaulted to true
- Handles custom tag types
- Passing in multiple root tags will result in an array.
- Handles object-based tag types, eg. `<Nav.Item>`
- Can parse object or functional props with the `useEval` option

### use

```jsx
import { jsx } from './jsx2json/index.js';
const result = jsx(`<button disabled>Hello</button>`)

//Result
{
 type : 'button',
 props : {
  disabled : true
 },
 children : ['Hello']
}

```

### using eval

if you would like to parse javascript-based parameters, you can use the `useEval` option. *Note:* Not only is using `eval` dangerous if you aren't controlling the input, but the result of `jsx` may not be pure JSON.

```jsx
jsx(`<button onClick={()=>alert('hey!')} style={{top : '4px', color : 'white'}} />`);

//Result
{
 type : 'button',
 props : {
  onClick : ()=>{
   alert('hey!')
  },
  style : {
   top : '4px',
   color : 'white'
  }
 },
 children : []
}
```

### complex use case

```jsx
const result = jsx(`
 <Nav.Item className='test'>
  Hello <a href='/test'>you</a>
 </Nav.Item>
 <button disabled onClick={()=>alert('pressed!')}>Press me</button>
`, {useEval : true});
```

*Result*

```js
[
 {
  type: 'Nav.Item',
  props : {
   className : 'test'
  },
  children : [
   'Hello',
   {
    type : 'a',
    props : {
     href : '/test'
    },
    children : ['you']
   }
  ]
 },
 {
  type : 'button',
  props : {
   disabled : true,
   onClick : ()=>{alert('pressed!')}
  },
  children : [ 'Press me' ]
 }
]
```

## gathered resources for further development and research

Jsx2json: <https://github.com/stolksdorf/jsx2json>

Acorn: <https://github.com/acornjs/acorn-jsx>

Acorn: <https://github.com/acornjs/acorn>

Acorn Jsx: <https://www.npmjs.com/package/acorn-jsx-walk>

Acorn Walk: <https://github.com/acornjs/acorn/blob/master/acorn-walk/README.md>

JSX Vanilla: <https://github.com/AdeonMaster/jsx-vanilla>

<https://stackoverflow.com/questions/65342217/acorn-jsx-walk-nodes-with-particular-type>
<https://snyk.io/advisor/npm-package/acorn-walk/functions/acorn-walk.bas>