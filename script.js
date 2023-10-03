let LIST_USERS_API = "https://64340de21c5ed06c958dd2da.mockapi.io/users";
let listUsers = document.querySelector(".list");
let input = document.querySelector(".form input");
let addBtn = document.querySelector(".form button");
let inputValue = input.value;

input.addEventListener("keyup", (e) => {
  inputValue = e.target.value;
});

addBtn.addEventListener("click", () => {
  const dataPost = {
    name: input.value,
    id: new Date().getTime(),
  };

  fetch(LIST_USERS_API, {
    method: "POST",
    body: JSON.stringify(dataPost),
    headers: {
      "content-type": "application/json",
    },
  })
    .then((data) => data.json())
    .then(() => getUsersRequest());
});
function editUser(id, data) {
  return fetch(`${LIST_USERS_API}/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
    headers: {
      "content-type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((responseData) => {
      console.log("Данные после редактирования:", responseData);
      return responseData;
    });
}

function getUsersRequest() {
  fetch(LIST_USERS_API)
    .then((data) => data.json())
    .then((data) => {
      listUsers.innerHTML = "";

      data.map((user) => {
        const item = document.createElement("div");
        item.classList.add("item");
        let h3 = document.createElement("h3");
        h3.textContent = user.name || "";
        let button = document.createElement("button");
        button.textContent = "Delete";
        let edit_btn = document.createElement("button");
        edit_btn.textContent = "Edit";
        let btns = document.createElement("div");
        btns.classList.add("btns");

        item.append(h3);
        item.append(btns);
        btns.append(edit_btn);
        btns.append(button);

        button.addEventListener("click", () => {
          fetch(`${LIST_USERS_API}/${user.id}`, {
            method: "DELETE",
          })
            .then((data) => data.json())
            .then(() => getUsersRequest());
        });

        edit_btn.addEventListener("click", () => {
          const editDiv = document.createElement("div");
          const editInput = document.createElement("input");
          const saveBtn = document.createElement("button");
          const cancelBtn = document.createElement("button");
          editInput.classList.add("editInput");

          editInput.value = user.name || "";

          saveBtn.textContent = "Сохранить";
          saveBtn.addEventListener("click", () => {
            const newName = editInput.value;
            if (newName !== "") {
              editUser(user.id, { name: newName }).then(() =>
                getUsersRequest()
              );
              editDiv.remove();
            }
          });

          cancelBtn.textContent = "Отмена";
          cancelBtn.addEventListener("click", () => {
            editDiv.remove();
          });

          editDiv.append(editInput);
          editDiv.append(saveBtn);
          editDiv.append(cancelBtn);

          h3.style.display = "none";
          btns.style.display = "none";
          item.append(editDiv);
        });

        listUsers.append(item);
      });
    });
}

getUsersRequest();
