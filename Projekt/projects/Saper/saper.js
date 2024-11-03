const timerElement = document.querySelector(".timer");

let timer;

function startTimer() {
  let counterTime = 0;
  timerElement.innerHTML = "grasz: " + counterTime + " [s]";

  clearInterval(timer);
  timer = setInterval(function () {
    counterTime++;
    timerElement.innerHTML = "grasz: " + counterTime + " [s]";
  }, 1000);
}

function stopTimer() {
  clearInterval(timer);
}

function randomNumber(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

class Saper {
  constructor(element, width, height, bombsCount, onGameStarted, onGameWin) {
    this.element = element;
    this.width = width;
    this.height = height;
    this.bombsCount = bombsCount;
    this.map = [];
    this.visited = [];
    this.flags = bombsCount;
    this.onGameStarted = onGameStarted;
    this.onGameWin = onGameWin;
  }

  generateMAP() {
    this.onGameStarted();
    for (let i = 0; i < this.height; i++) {
      const row = [];
      this.map.push(row);

      for (let j = 0; j < this.width; j++) {
        row.push(0);
      }
    }
    for (let k = 0; k < this.bombsCount; k++) {
      const positonBombx = randomNumber(0, this.width - 1);
      const positonBomby = randomNumber(0, this.height - 1);

      if (this.map[positonBomby][positonBombx] === 1) {
        k--;
      } else {
        this.map[positonBomby][positonBombx] = 1;
      }
    }

    this.render();
  }

  countBombs(y, x) {
    if (this.map[y][x] === 1) {
      return -1;
    }
    let counter = 0;

    if (y > 0 && this.map[y - 1][x - 1] === 1) {
      counter++;
    }
    if (y > 0 && this.map[y - 1][x] === 1) {
      counter++;
    }
    if (y > 0 && this.map[y - 1][x + 1] === 1) {
      counter++;
    }
    if (this.map[y][x + 1] === 1) {
      counter++;
    }
    if (y < this.map.length - 1 && this.map[y + 1][x + 1] === 1) {
      counter++;
    }
    if (y < this.map.length - 1 && this.map[y + 1][x] === 1) {
      counter++;
    }
    if (y < this.map.length - 1 && this.map[y + 1][x - 1] === 1) {
      counter++;
    }
    if (this.map[y][x - 1] === 1) {
      counter++;
    }
    return counter;
    ////
  }

  render() {
    const container = document.querySelector(this.element);

    document.querySelector(".bombstofinish").innerHTML =
      "Pozostałych bomb: " + this.flags;

    function discover(y, x) {
      const bombsall = this.countBombs(y, x);
      const row = container.querySelectorAll(".row")[y];
      const column = row.querySelectorAll(".column")[x];

      if (column.classList.contains("flag") === false) {
        if (
          this.visited.find(function (visit) {
            return y === visit[0] && x === visit[1];
          })
        ) {
          return;
        }

        // wrzucamy do worka
        this.visited.push([y, x]);

        column.classList.add("empty", "offClick");
        column.classList.remove("cover");
        column.classList.remove("question");

        if (bombsall !== 0) {
          column.innerHTML = bombsall;
        }
      }

      if (bombsall > 0) {
        return;
      }

      if (y > 0) {
        if (this.map[y - 1][x] === 0) {
          discover.apply(this, [y - 1, x]);
        }
      }

      if (this.map[y][x + 1] === 0 && x < this.map[y].length - 1) {
        discover.apply(this, [y, x + 1]);
      }

      if (y < this.map.length - 1) {
        if (this.map[y + 1][x] === 0) {
          discover.apply(this, [y + 1, x]);
        }
      }

      if (this.map[y][x - 1] === 0 && x > 0) {
        discover.apply(this, [y, x - 1]);
      }

      if (
        y < this.map.length - 1 &&
        this.map[y + 1][x + 1] === 0 &&
        x < this.map[y].length - 1
      ) {
        discover.apply(this, [y + 1, x + 1]);
      }

      if (y < this.map.length - 1 && this.map[y + 1][x - 1] === 0 && x > 0) {
        discover.apply(this, [y + 1, x - 1]);
      }

      if (y > 0 && this.map[y - 1][x - 1] === 0 && x > 0) {
        discover.apply(this, [y - 1, x - 1]);
      }

      if (y > 0 && this.map[y - 1][x + 1] === 0 && x < this.map[y].length - 1) {
        discover.apply(this, [y - 1, x + 1]);
      }
    }

    function showAllBombs() {
      for (let i = 0; i < this.height; i++) {
        for (let j = 0; j < this.width; j++) {
          if (this.map[i][j] === 1) {
            const row = container.querySelectorAll(".row")[i];
            const column = row.querySelectorAll(".column")[j];
            column.classList.add("allbombs");
            column.classList.remove("cover");
            column.classList.remove("flag");
            column.classList.remove("question");
          }
        }
      }
    }

    function showAllBombsWin() {
      for (let i = 0; i < this.height; i++) {
        for (let j = 0; j < this.width; j++) {
          if (this.map[i][j] === 1) {
            const row = container.querySelectorAll(".row")[i];
            const column = row.querySelectorAll(".column")[j];
            column.classList.add("flag");
            column.classList.remove("cover");
            column.classList.remove("question");
          }
        }
      }
    }

    function stopClick() {
      container.classList.add("offClick");
    }
    // function ofClick() {
    //   container.onclick = "";
    // }

    function stopGame() {
      stopTimer();
      stopClick();
    }

    container.innerHTML = "";
    container.classList.remove("offClick");

    for (let i = 0; i < this.height; i++) {
      const divRowElement = document.createElement("div");
      divRowElement.classList.add("row");
      container.appendChild(divRowElement);

      for (let j = 0; j < this.width; j++) {
        const divColumnElement = document.createElement("div");
        divColumnElement.classList.add("column", "cover");

        divRowElement.appendChild(divColumnElement);

        const self = this;

        divColumnElement.addEventListener("contextmenu", function (event) {
          event.preventDefault();
          if (self.flags > 0) {
            //divColumnElement.onclick = "";
            if (divColumnElement.classList.contains("cover")) {
              divColumnElement.classList.add("flag");
              divColumnElement.classList.remove("cover");
              //ofClick.apply(self);
              //   divColumnElement.onclick = function changeContent() {

              //     divColumnElement.classList.add("question");

              //  }
              //divColumnElement.addEventListener("click", "")

              self.flags = self.flags - 1;
              document.querySelector(".bombstofinish").innerHTML =
                "Pozostałych bomb: " + self.flags;
            } else if (divColumnElement.classList.contains("flag")) {
              this.classList.remove("flag");
              this.classList.add("question");

              self.flags = self.flags + 1;
              document.querySelector(".bombstofinish").innerHTML =
                "Pozostałych bomb: " + self.flags;
            } else if (divColumnElement.classList.contains("question")) {
              this.classList.remove("question");
              this.classList.add("cover");
            }
          } else if (divColumnElement.classList.contains("flag")) {
            this.classList.remove("flag");
            this.classList.add("question");

            self.flags = self.flags + 1;
            document.querySelector(".bombstofinish").innerHTML =
              "Pozostałych bomb: " + self.flags;
          } else if (
            this.classList.contains("cover") &&
            self.flags === 0
          ) {
            this.classList.remove("cover");
            this.classList.add("question");
          } else if (divColumnElement.classList.contains("question")) {
            this.classList.remove("question");
            this.classList.add("cover");
          }
        });

        divColumnElement.addEventListener("click", function () {
          if (this.classList.contains("flag")){
            return
          }

          const counter = self.countBombs(i, j);
          if (counter === -1) {
            this.classList.add("hitbomb");

            stopGame.apply(self);
            showAllBombs.apply(self);
            this.classList.remove("allbombs");
            alert("PRZEGRAŁEŚ");
          } else {
            discover.apply(self, [i, j]);
            if (
              self.visited.length ===
              self.height * self.width - self.bombsCount
            ) {
              stopGame.apply(self);
              showAllBombsWin.apply(self);
              self.onGameWin();
              alert("WYGRAŁEŚ");
            }
          }
        });
      }
    }
  }
}

const buttonElement = document.querySelector(".bt");
const results = new Results();

const widthElement = document.querySelector(".width");
const heightElement = document.querySelector(".height");
const bombsElement = document.querySelector(".bombs");

let width = Number(widthElement.value);
let height = Number(heightElement.value);
let bombsCount = Number(bombsElement.value);

widthElement.addEventListener("change", function (event) {
  width = Number(event.target.value);
  results.render(width, height, bombsCount);
});

heightElement.addEventListener("change", function (event) {
  height = Number(event.target.value);
  results.render(width, height, bombsCount);
});

bombsElement.addEventListener("change", function (event) {
  bombsCount = Number(event.target.value);
  results.render(width, height, bombsCount);
});

results.render(width, height, bombsCount);

const form = document.querySelector(".form");
form.addEventListener("submit", function (event) {
  event.preventDefault();

  const nick = encodeURIComponent(document.querySelector(".nick").value);

  let timestart;

  const saper = new Saper(
    ".map-container",
    width,
    height,
    bombsCount,
    function () {
      timestart = new Date().getTime();
    },
    function () {
      const timestop = new Date().getTime();
      const timeGame = timestop - timestart;
      results.addResult(width, height, bombsCount, nick, timeGame);
    }
  );

  saper.generateMAP();
  startTimer();
});
