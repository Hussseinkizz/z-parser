export const Home = () => {
  const handleClick = () => {
    console.log('clicked');
  };

  const name = 'Kizz';

  return html` <button onClick="{${handleClick}}">hello ${name}</button> `;
};

function html() {}
