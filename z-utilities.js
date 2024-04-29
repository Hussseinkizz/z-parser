// Define re-usable functions

export const useRouter = () => {
  // some routing logic here
  const getParam = (param) => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has(param)) {
      return urlParams.get(param);
    } else {
      console.warn(`Param: ${param} not found in current url!`);
      return null;
    }
  };

  return {
    history: window.history,
    location: window.location,
    goTo: (route) => (window.location.href = route),
    goBack: () => window.history.back(),
    goForward: () => window.history.forward(),
    getParam: getParam,
  };
};

export const bindInputElement = (inputElement, callback) => {
  inputElement.addEventListener('input', (e) => {
    if (e.target.value.trim() !== '') {
      callback(e.target.value);
    }
  });
};

export const bindSelectOptions = (selectElement, callback) => {
  let options = selectElement.querySelectorAll('option');
  options.forEach((option) => {
    option.addEventListener('click', () => {
      if (option.value.trim() !== '') {
        callback(option.value);
      }
    });
  });
};

function useNavigate(route) {
  window.location.href = route;
  return window.location.href;
}

const _getContent = (component) => {
  return typeof component === 'function' ? component() : component;
};

// some utility functions
// todo: provide makeHtml for list items or multiple elements, handle security flaws with innerHtml
export function makeHtml(htmlStringOrFunction) {
  const template = document.createElement('template');
  template.innerHTML = _getContent(htmlStringOrFunction);
  return template.content.firstElementChild;
}

function formatCurrency(amount) {
  let formatter = Intl.NumberFormat('us', {
    notation: 'standard',
  });
  return formatter.format(amount);
}

function makeFrame(id, urlPath) {
  let newIframe = document.createElement('iframe');
  newIframe.id = id;
  newIframe.src = urlPath;
  newIframe.style.height = '100%';
  newIframe.style.width = '100%';
  newIframe.style.border = 'none';
  newIframe.classList.add('iframe-view');
  return newIframe;
}

function scrollToElement(Element) {
  Element.scrollIntoView({
    behavior: 'smooth', // or 'auto' for instant scrolling
    block: 'start', // scroll to the top of the element
    inline: 'nearest', // scroll to the nearest edge of the element
  });
}

function focusNextTab() {
  // Get the currently focused element
  let currentElement = document.activeElement;

  // Get all elements with a greater tabindex
  let tabItems = Array.from(document.querySelectorAll('[tabindex]')).filter(
    function (element) {
      return element.tabIndex > currentElement.tabIndex;
    }
  );

  // Sort the tabbable elements in ascending order
  tabItems.sort(function (a, b) {
    return a.tabIndex - b.tabIndex;
  });

  // Focus on the first element in the sorted list
  if (tabItems.length > 0) {
    tabItems[0].focus();
  }
}

function isUserOnline() {
  return navigator.onLine;
}

// renders givent component into given element
const render = (elementID, component) => {
  let newContent = _getContent(component);

  let element = document.getElementById(elementID);
  element.innerHTML = '';
  element.innerHTML = newContent;
};

// replaces given element with new component, - should remove old one!
const replace = (elementID, component) => {
  let newContent = _getContent(component);

  let element = document.getElementById(elementID);
  element.innerHTML = '';
  element.innerHTML = newContent;
};

// appends an element to a given position in respect to passed in element
const append = (order, elementID, component) => {
  let element = document.getElementById(elementID);

  let newContent = _getContent(component);

  if (order === 'after:') {
    element.appendChild(_makeHtml(newContent));
  } else {
    // append new content element to before the current in elements
  }
};

// shows a loader component for given duration
const showLoader = (component, duration) => {
  let newContent = _getContent(component);
  let newContentHtml = _makeHtml(newContent);
  newContentHtml.classList.add('z-loader');
  ZParent.appendChild(newContentHtml);

  // remove element after given time
  setTimeout(() => {
    let target = document.querySelector('.z-loader');
    target.style.display = 'none';
  }, duration);
};

// try html templating
const html = (component) => {
  let newContent = _getContent(component);
  return newContent;
};

export const handleClickOutside = (trigger, element, callback) => {
  // Stop the click event propagation
  trigger.addEventListener('click', (e) => e.stopPropagation());
  const onClickOutside = (event) => {
    if (element && !element.contains(event.target)) {
      callback(event);
    }
  };
  document.addEventListener('click', onClickOutside);
};

export function formatNumber(number) {
  const formatter = Intl.NumberFormat('en', { notation: 'standard' });
  const formattedNumber = formatter.format(number);
  return formattedNumber;
}

export function getNowDate() {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const date = new Date();
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return {
    humanized: `${year}-${month}-${day}`,
    date: `${year}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${day
      .toString()
      .padStart(2, '0')}`,
  };
} // output: "2023-February-13" or "2023-02-13"

export function humanizeDate(dateString) {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const _date = dateString.split('-');
  const _day = _date[2];
  const _month = months[Number(_date[1].charAt(1)) - 1];
  const _year = _date[0];

  return `${_day}-${_month}-${_year}`;
} // output: "13-February-2024" when given "2023-02-13"

export function getNowDateFull() {
  const date = new Date();

  // const options = {
  //   day: "numeric",
  //   month: "long",
  //   year: "numeric",
  //   hour: "numeric",
  //   minute: "numeric",
  //   hour12: true,
  // };

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  }).format(date);
  // console.log(formattedDate); // output: "3 April 2023 2:13 AM"
  return formattedDate;
}

export function _dateFormater(date) {
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    // hour: 'numeric',
    // minute: 'numeric',
    // hour12: true,
  }).format(date);
  // console.log(formattedDate); // output: "3 April 2023 2:13 AM"
  return formattedDate;
}

export function _sortNames(array) {
  const sortedItems = [...array].sort((a, b) => a.name.localeCompare(b.name));
  return sortedItems;
}

// Example usage:
// const sortedArray = _sortNames([{ name: 'John' }, { name: 'Alice' }, { name: 'Bob' }]);
// console.log(sortedArray);
// Output: [{ name: 'Alice' }, { name: 'Bob' }, { name: 'John' }]

export function _getLocalImageUrl(imageFile) {
  // first release image memory, just in case to avoid memory leaks
  URL.revokeObjectURL(imageFile);
  const imageUrl = URL.createObjectURL(imageFile);
  return imageUrl;
}

export function generateUniqueId(keyword = '', length = 6) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '1234567890';
  let id = keyword;
  const timestamp = Date.now(); // Get the current timestamp in milliseconds
  const randomChar = characters.charAt(
    Math.floor(Math.random() * characters.length)
  );
  const randomNum = numbers.charAt(Math.floor(Math.random() * numbers.length));

  // Generate random letters for the specified length
  if (!keyword) {
    for (let i = 0; i < length; i++) {
      id += characters.charAt(Math.floor(Math.random() * characters.length));
    }
  }

  // Append the timestamp and a random character to the ID
  id += `_${timestamp}${randomChar}${randomNum}`;

  return id;
}

export function getPastYears(upto = 5) {
  const currentYear = new Date().getFullYear();
  const pastYears = [];
  for (let i = 0; i < upto; i++) {
    pastYears.push(currentYear - i);
  }
  return pastYears;
}

export function checkViewPort(
  query = 'md',
  queryType = 'max',
  onChange = null
) {
  // sizes adapted from tailwind preset: https://tailwindcss.com/docs/responsive-design
  let sizes = {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    hd: '1536px',
  };

  if (!sizes[query]) {
    console.error('Invalid query argument, use any of sm,md,lg,xl or hd!');
    return null;
  }
  let mediaString = `(${queryType}-width: ${sizes[query]})`;
  const mediaQuery = window.matchMedia(mediaString);

  if (onChange) {
    mediaQuery.addEventListener('change', onChange);
  }
  return mediaQuery.matches;
}

// todo finish and test this validator

// const checkEmptyValues = (
//   data = {},
//   exclusionList = [],
//   parseErrorCallback
// ) => {
//   const keyValuePairs = Object.entries(data);

//   keyValuePairs.forEach(([key, value]) => {
//     if (value && typeof value === 'object') {
//       checkEmptyValues(value);
//     } else if (value && Array.isArray(value)) {
//       value.forEach((element) => {
//         if (element && typeof element === 'object') {
//           let newObject = Object.fromEntries(Object.entries(element));
//           checkEmptyValues(newObject);
//         }
//       });
//     }
//     parseValue(key, value);
//   });

//   function parseValue(key, value) {
//     if (value === null || value === undefined || isNaN(value)) {
//       parseErrorCallback(key, value);
//       return null;
//     }
//     return true;
//   }
// };

// const sampleObject = {
//   name: 'John',
//   age: 30,
//   address: {
//     city: 'Awesomeville',
//     country: 'Wonderland',
//   },
//   hobbies: [
//     'reading',
//     'coding',
//     { type: 'outdoor', activities: ['hiking', 'camping'] },
//   ],
//   job: null,
// };

// checkEmptyValues(sampleObject, [], (key, value) =>
//   console.log(`${key} is not filled, has value: ${value}`)
// );
