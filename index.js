const userList = document.querySelector('.user-list');

const myForm = document.getElementById('person-form');
myForm.addEventListener('submit', submitHandler);

function getFormData() {
  const formData = new FormData(myForm);
  const dataObject = Object.fromEntries(formData);
  return dataObject;
}

async function renderAllUsers() {
  userList.innerHTML = '';
  const usersArray = await fetchUsers();

  if (usersArray.length > 0) {
    for (let i = 0; i < usersArray.length; i += 1) {
      const userData = usersArray[i];
      const elem = document.createElement('div');
      elem.classList.add('user-entry');
      elem.id = userData.id;
      elem.innerHTML = `
      <b>Name:</b><br>
      --${userData.name}<br>
      <b>Age:</b><br>
      --${userData.age}<br>
      <b>Hobbies:</b>
      `;
      const hobbyList = document.createElement('ol');
      hobbyList.classList.add('hobby-list');
      for (const hobby of userData.hobbies) {
        const hobbyElem = document.createElement('li');
        hobbyElem.classList.add('hobby');
        hobbyElem.innerText = hobby;
        hobbyList.appendChild(hobbyElem);
      }

      const btn = document.createElement('button');
      btn.innerText = 'id';
      btn.addEventListener('click', () => alert(userData.id));

      const deleteBtn = document.createElement('button');
      deleteBtn.innerText = 'delete';
      deleteBtn.addEventListener('click', () => deleteHandler(userData.id));

      elem.appendChild(hobbyList);
      elem.appendChild(btn);
      elem.appendChild(deleteBtn);
      elem.onmouseenter = () => elem.classList.add('hover');
      elem.onmouseleave = () => elem.classList.remove('hover');
      userList.appendChild(elem);
    }
  }
}

// READ
async function fetchUsers() {
  const url = new URL('http://127.0.0.1:3000/person');
  const response = await fetch(url, { method: 'GET' });

  if (response.ok) {
    console.log(response);
    const usersArr = await response.json();
    console.log(usersArr);
    return usersArr;
  }
  const txt = await response.text();
  alert('OOPS: ' + response.statusText + '\n' + txt);
  return;
}

// {
//   id: 'bafd3785-b64a-449e-b61f-a07bd979b025' ( UUID );
//   name: string;
//   age: number;
//   hobbies: string[];
// }

// CREATE & PUT
async function submitHandler(e) {
  e.preventDefault();
  const person = getFormData();
  person.age = parseInt(person.age);
  person.hobbies = person.hobbies.split(',').map((hobby) => hobby.trim());

  const { id, ...dto } = person;

  const url = new URL(id ? `http://127.0.0.1:3000/person/${id}` : 'http://127.0.0.1:3000/person');
  const response = await fetch(url, {
    method: id ? 'PUT' : 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    mode: 'cors',
    body: JSON.stringify(dto)
  });

  if (response.ok) {
    renderAllUsers();
  } else {
    const message = await response.text();
    alert(message);
  }
}

// DELETE
async function deleteHandler(id) {
  console.log('delele >>>>> ', id);
  const url = new URL(`http://127.0.0.1:3000/person/${id}`);
  await fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  deletedUser = document.getElementById(id);
  deletedUser.classList.add('shrink');
  deletedUser.classList.remove('hover');
  deletedUser.ontransitionend = () => deletedUser.parentNode.removeChild(deletedUser);
}
