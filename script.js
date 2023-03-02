const inputSearch = document.querySelector("input");
const inputList = document.querySelector(".dropdown__list");
const users = document.querySelector(".dropdown__users");

users.addEventListener("click", function (event) {
  let target = event.target;
  if (!target.classList.contains("btn-close")) {
    return;
  }

  target.parentElement.remove();
});

users.removeEventListener("click", function (event) {
  let target = event.target;
  if (!target.classList.contains("btn-close")) {
    return;
  }

  target.parentElement.remove();
});

inputList.addEventListener("click", function (event) {
  let target = event.target;
  if (!target.classList.contains("dropdown-content")) {
    return;
  }

  addChosen(target);
  inputSearch.value = "";
  removePredictions();
});

inputList.removeEventListener("click", function (event) {
  let target = event.target;
  if (!target.classList.contains("dropdown-content")) {
    return;
  }

  addChosen(target);
  inputSearch.value = "";
  removePredictions();
});

function removePredictions() {
  inputList.innerHTML = "";
}

function showPredictions(repositories) {
  for (let repositoriesIndex = 0; repositoriesIndex < 5; repositoriesIndex++) {
    let name = repositories.items[repositoriesIndex].name;
    let owner = repositories.items[repositoriesIndex].owner.login;
    let stars = repositories.items[repositoriesIndex].stargazers_count;

    let dropdownContent = `<div class="dropdown-content" data-owner="${owner}" data-stars="${stars}">${name}</div>`;
    inputList.innerHTML += dropdownContent;
  }
}

function addChosen(target) {
  let name = target.textContent;
  let owner = target.dataset.owner;
  let stars = target.dataset.stars;

  users.innerHTML += `<div class="chosen">Name: ${name}<br>Owner: ${owner}<br>Stars: ${stars}<button class="btn-close" type="button" title=""></button></div>`;
}

async function getPredictions() {
  const urlSearchRepo = new URL("https://api.github.com/search/repositories");
  let repoPart = inputSearch.value;
  if (repoPart == "") {
    removePredictions();
    return;
  }

  urlSearchRepo.searchParams.append("q", repoPart);
  try {
    let response = await fetch(urlSearchRepo);
    if (response.ok) {
      let repo = await response.json();
      showPredictions(repo);
    } else {
      return null;
    }
  } catch (error) {
    alert("Пользователей не найдено");
    console.log(error);
  }
}

function debounce(fn, timeout) {
  let timer = null;

  return (...args) => {
    clearTimeout(timer);
    return new Promise((resolve) => {
      timer = setTimeout(() => resolve(fn(...args)), timeout);
    });
  };
}

//??
const getPredictionsDebounce = debounce(getPredictions, 400);
inputSearch.addEventListener("input", getPredictionsDebounce);

console.clear();
