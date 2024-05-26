export const Home = () => {
  const handleClick = () => {
    console.log('clicked');
  };

  const name = 'Kizz';

  return html` <button onClick="{${handleClick}}">hello ${name}</button> `;
};

function html(strings, ...values) {
  console.log('html', strings, values);
}

console.log('Home', Home());

// {
//   content: "hello Kizz",
//   attributes: {
//     onClick: () => console.log("Button clicked!")
//   },
//   type: "button"
// }
