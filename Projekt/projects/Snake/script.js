let direction = "right";
let lengthSnake = 3;
let head = [6, 5];
let goSnake = 0;

//licznik
const counter = document.querySelector(".counter");
counter.innerHTML = 0;

//snake
document.body.addEventListener("keydown", function (e) {
  const key = e.which;
  //console.log(key);

  if (key === 39 && direction != "left") {
    direction = "right";
    e.preventDefault();
  } else if (key === 40 && direction != "top") {
    direction = "bottom";
    e.preventDefault();
  } else if (key === 38 && direction != "bottom") {
    direction = "top";
    e.preventDefault();
  } else if (key === 37 && direction != "right") {
    direction = "left";
    e.preventDefault();
  }
});

async function snake() {
  const tab = generateMAP(20);

  render(tab);
  document.body.addEventListener("keydown", function (e) {
    clearInterval(goSnake);
    goSnake = setInterval(function () {
      //findPart(1, tab);
      try {
        head = move(head[0], head[1], tab);
      } catch {
        clearInterval(goSnake);
        if (!alert("PRZEGRAŁEŚ")) {
          window.location.reload();
        }
      }
      render(tab);
    }, 100);
  });
}

//console.table(tab);
snake();

//zmienne

function move(hx, hy, arr) {
  function incrementSnake(cutTail) {
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr[i].length; j++) {
        if (cutTail && arr[i][j] === lengthSnake) {
          arr[i][j] = 0;
        }
        if (arr[i][j] > 0) {
          arr[i][j]++;
        }
      }
    }
    if (!cutTail) {
      lengthSnake++;
      setApplePosition(arr);
      counter.innerHTML = lengthSnake - 3;
    }
  }

  if (direction === "right" && [0, -2].includes(arr[hy][hx + 1])) {
    incrementSnake(arr[hy][hx + 1] === 0);
    arr[hy][hx + 1] = 1;
    return [hx + 1, hy];
  } else if (direction === "left" && [0, -2].includes(arr[hy][hx - 1])) {
    incrementSnake(arr[hy][hx - 1] === 0);
    arr[hy][hx - 1] = 1;
    return [hx - 1, hy];
  } else if (direction === "top" && [0, -2].includes(arr[hy - 1][hx])) {
    incrementSnake(arr[hy - 1][hx] === 0);
    arr[hy - 1][hx] = 1;
    return [hx, hy - 1];
  } else if (direction === "bottom" && [0, -2].includes(arr[hy + 1][hx])) {
    incrementSnake(arr[hy + 1][hx] === 0);
    arr[hy + 1][hx] = 1;
    return [hx, hy + 1];
  } else throw new Error();
}

//pozycja jabłka
function setApplePosition(arr) {
  function randomNumber() {
    return Math.round(Math.random() * 17 + 1);
  }

  let positionX;
  let positionY;
  do {
    positionX = randomNumber();
    positionY = randomNumber();
  } while (arr[positionY][positionX] !== 0);

  arr[positionY][positionX] = -2;
}

//Wygenerowana tablica
function generateMAP(N) {
  const arr = [];
  for (let i = 0; i < N; i++) {
    arr[i] = [];
    for (let j = 0; j < N; j++) {
      if (i === 0 || i === N - 1 || j === 0 || j === N - 1) {
        arr[i][j] = -1;
      } else arr[i][j] = 0;
    }
  }

  arr[5][4] = 3;
  arr[5][5] = 2;
  arr[5][6] = 1;
  setApplePosition(arr);

  return arr;
}

// Wygenerowana mapa html
function render(arr) {
  const container = document.querySelector(".map-container");
  container.innerHTML = "";
  for (let i = 0; i < arr.length; i++) {
    const divRowElement = document.createElement("div");
    divRowElement.classList.add("row");
    container.appendChild(divRowElement);

    for (let j = 0; j < arr.length; j++) {
      const divColumnElement = document.createElement("div");
      //console.log(arr.length);
      //granica
      if (arr[i][j] === -1) {
        divColumnElement.classList.add("column", "border");
      }
      // głowa
      else if (arr[i][j] === 1 && arr[i][j - 1] === 2) {
        divColumnElement.classList.add("column", "head-right");
      } else if (arr[i][j] === 1 && arr[i][j + 1] === 2) {
        divColumnElement.classList.add("column", "head-left");
      } else if (arr[i][j] === 1 && arr[i - 1][j] === 2) {
        divColumnElement.classList.add("column", "head-bottom");
      } else if (arr[i][j] === 1 && arr[i + 1][j] === 2) {
        divColumnElement.classList.add("column", "head-top");
      }

      //ogon
      else if (arr[i][j] === lengthSnake && arr[i][j + 1] === lengthSnake - 1) {
        divColumnElement.classList.add("column", "tail-left");
      } else if (
        arr[i][j] === lengthSnake &&
        arr[i][j - 1] === lengthSnake - 1
      ) {
        divColumnElement.classList.add("column", "tail-right");
      } else if (
        arr[i][j] === lengthSnake &&
        arr[i + 1][j] === lengthSnake - 1
      ) {
        divColumnElement.classList.add("column", "tail-top");
      } else if (
        arr[i][j] === lengthSnake &&
        arr[i - 1][j] === lengthSnake - 1
      ) {
        divColumnElement.classList.add("column", "tail-bottom");
      }

      // tułów
      else if (
        arr[i][j] > 1 &&
        arr[i][j] < lengthSnake &&
        ((arr[i][j + 1] === arr[i][j] - 1 && arr[i][j - 1] === arr[i][j] + 1) ||
          (arr[i][j - 1] === arr[i][j] - 1 && arr[i][j + 1] === arr[i][j] + 1))
      ) {
        divColumnElement.classList.add("column", "body-r-l");
      } else if (
        arr[i][j] > 1 &&
        arr[i][j] < lengthSnake &&
        ((arr[i + 1][j] === arr[i][j] - 1 && arr[i - 1][j] === arr[i][j] + 1) ||
          (arr[i - 1][j] === arr[i][j] - 1 && arr[i + 1][j] === arr[i][j] + 1))
      ) {
        divColumnElement.classList.add("column", "body-t-b");
      }

      //zakręty
      else if (
        arr[i][j] > 1 &&
        arr[i][j] < lengthSnake &&
        ((arr[i][j + 1] === arr[i][j] - 1 && arr[i - 1][j] === arr[i][j] + 1) ||
          (arr[i][j + 1] === arr[i][j] + 1 && arr[i - 1][j] === arr[i][j] - 1))
      ) {
        divColumnElement.classList.add("column", "corner-l-b");
      } else if (
        arr[i][j] > 1 &&
        arr[i][j] < lengthSnake &&
        ((arr[i][j - 1] === arr[i][j] - 1 && arr[i - 1][j] === arr[i][j] + 1) ||
          (arr[i][j - 1] === arr[i][j] + 1 && arr[i - 1][j] === arr[i][j] - 1))
      ) {
        divColumnElement.classList.add("column", "corner-r-b");
      } else if (
        arr[i][j] > 1 &&
        arr[i][j] < lengthSnake &&
        ((arr[i][j + 1] === arr[i][j] - 1 && arr[i + 1][j] === arr[i][j] + 1) ||
          (arr[i][j + 1] === arr[i][j] + 1 && arr[i + 1][j] === arr[i][j] - 1))
      ) {
        divColumnElement.classList.add("column", "corner-l-t");
      } else if (
        arr[i][j] > 1 &&
        arr[i][j] < lengthSnake &&
        ((arr[i][j - 1] === arr[i][j] - 1 && arr[i + 1][j] === arr[i][j] + 1) ||
          (arr[i][j - 1] === arr[i][j] + 1 && arr[i + 1][j] === arr[i][j] - 1))
      ) {
        divColumnElement.classList.add("column", "corner-r-t");
      }

      // plansza
      else if (arr[i][j] === 0) {
        divColumnElement.classList.add("column");
      }

      // jabłko
      else if (arr[i][j] === -2) {
        divColumnElement.classList.add("column", "apple");

        //pozostałe
      } else divColumnElement.classList.add("column", "dwa");

      divRowElement.appendChild(divColumnElement);
    }
  }
}
