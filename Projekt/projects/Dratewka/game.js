class Game {
  inHand = null;

  dragonParts = [];

  currentlocation = this.getLocationbyID(47);

  getLocationbyID(id) {
    const found = locations.find((location) => location.id === id);
    return found;
  }

  getItemID(id) {
    const found = items.find((item) => item.id === id);
    return found;
  }

  getItembyName(name) {
    const found = this.currentlocation.items
      .map(this.getItemID)
      .find((item) => item.name === name);
    return found;
  }

  removeItemFromLocationbyID(id) {
    this.currentlocation.items.splice(
      this.currentlocation.items.indexOf(id),
      1
    );
  }
  addItemToLocationbyID(id) {
    this.currentlocation.items.push(id);
  }

  ////////////////////////////////////////////////////////////////////////////////////////////
  focus() {
    document.addEventListener("click", function () {
      if (document.querySelector(".input") != undefined) {
        document.querySelector(".input").focus();
      }
    });
  }
  //Funkcje wyświetlania treści

  //Funkcje ogólne
  hideinputs() {
    if (
      (document.querySelector(".input") ||
        document.querySelector(".labelforinp")) != undefined
    ) {
      document.querySelector(".input").style.display = "none";

      document.querySelector(".labelforinp").style.display = "none";
    }
  }

  seekinputs() {
    if (
      (document.querySelector(".input") ||
        document.querySelector(".labelforinp")) != undefined
    ) {
      document.querySelector(".input").style.display = "";
      document.querySelector(".labelforinp").style.display = "";
    }
  }

  //clear input
  clearInp() {
    document.querySelector(".input").disabled = true;
    document.querySelector(".input").value = null;
    setTimeout(function () {
      document.querySelector(".input").blur();
      document.querySelector(".input").value = null;
      document.querySelector(".input").disabled = false;
      document.querySelector(".input").focus();
    }, 150);
  }

  // V i G
  hideSeekVG() {
    this.hideinputs();
    document.getElementById("textdir").style.display = "none";
    document.getElementById("itemsinfo").style.display = "none";
    document.getElementById("itemsbag").style.display = "none";
    const self = this;

    document.body.addEventListener("keypress", function clearView(e) {
      //console.log(e);
      document.body.removeEventListener("keypress", clearView);
      //console.log(e);
      document.getElementById("infoinput").remove();
      document.getElementById("textdir").style.display = "";
      document.getElementById("itemsinfo").style.display = "";
      document.getElementById("itemsbag").style.display = "";

      self.seekinputs();

      self.clearInp();
    });
  }

  // TAKE, DROP i OTHER
  hideSeekTakeDrop() {
    this.hideinputs();
    const self = this;
    setTimeout(function () {
      self.seekinputs();
      document.getElementById("infoinput").remove();
      document.querySelector(".input").focus();
      self.render();
    }, 1500);
  }

  //USE
  hideSeekUse() {
    this.hideinputs();
    const self = this;
    setTimeout(function () {
      self.seekinputs();
      if (
        (document.querySelector(".input") ||
          document.querySelector(".labelforinp")) != undefined
      ) {
        document.getElementById("infoinput").remove();

        document.querySelector(".input").focus();

        self.render();
      }
    }, 3000);
  }

  // INFO USE
  infoUse(trade) {
    if (trade.message.length === 1) {
      infoinput.innerHTML = trade.message;
      //console.log(trade.message);
    } else {
      function displayMessage(messages, i = 0) {
        infoinput.innerHTML = messages[i];

        if (messages[i + 1]) {
          setTimeout(() => {
            displayMessage(messages, i + 1);
          }, 1000);
        }
      }

      displayMessage(trade.message);
    }
  }

  ////////////////////////////////////////////////////////////////////////////////////////////
  run() {
    this.startIntro();

    const container = document.querySelector(".container");
    const input = document.querySelector(".input");

    input.addEventListener("keyup", (e) => {
      if (e.key !== "Enter") {
        return;
      }

      const infoinput = document.createElement("p");
      infoinput.id = "infoinput";
      container.appendChild(infoinput);

      let direction = input.value.toUpperCase();

      if (direction === "NORTH" || direction === "N") {
        direction = "NORTH";
      } else if (direction === "SOUTH" || direction === "S") {
        direction = "SOUTH";
      } else if (direction === "WEST" || direction === "W") {
        direction = "WEST";
      } else if (direction === "EAST" || direction === "E") {
        direction = "EAST";
      } else if (direction === "VOCABULARY" || direction === "V") {
        infoinput.innerHTML =
          "NORTH or N, SOUTH or S <br/> WEST or W, EAST or E <br/> TAKE (object) or T (object) <br/> DROP (object) or D (object) <br/> USE (object) or U (object) <br/> GOSSIPS or G, VOCABULARY or V <br/> Press any key";
        this.hideSeekVG();
      } else if (direction === "GOSSIPS" || direction === "G") {
        infoinput.innerHTML =
          "The  woodcutter lost  his home key... <br/> The butcher likes fruit... The cooper <br/> is greedy... Dratewka plans to make a <br/> poisoned  bait for the dragon...  The <br/> tavern owner is buying food  from the <br/> pickers... Making a rag from a bag... <br/> Press any key";
        this.hideSeekVG();

        //TAKE
      } else if (direction.match(/^T\s([A-Za-z])*$/gi) || direction.match(/^TAKE\s([A-Za-z])*$/gi)) {
        const [, name] = direction.split(" ");
        const itemtake = this.getItembyName(name);
        if (!itemtake) {
          infoinput.innerHTML = "There isn't anything like that here";
        } else if (!itemtake.takeable) {
          infoinput.innerHTML = "You can't carry it";
        } else if (this.inHand) {
          infoinput.innerHTML = "You are carrying something";
        } else {
          this.inHand = itemtake;
          infoinput.innerHTML = "You are taking " + itemtake.showname;
          this.removeItemFromLocationbyID(itemtake.id);
        }

        this.hideSeekTakeDrop();

        //DROP
      } else if (direction.match(/^D\s([A-Za-z])*$/gi) || direction.match(/^DROP\s([A-Za-z])*$/gi)) {
        const [, name] = direction.split(" ");
        if (
          this.inHand &&
          this.inHand.name === name &&
          this.currentlocation.items.length < 3
        ) {
          infoinput.innerHTML = "You are about to drop " + name;
          this.addItemToLocationbyID(this.inHand.id);
          this.inHand = null;
        } else if (this.currentlocation.items.length >= 3) {
          infoinput.innerHTML = "You can't store any more here";
        } else if (this.inHand && this.inHand.name !== name) {
          infoinput.innerHTML = "You are not carrying it";
        } else {
          infoinput.innerHTML = "You are not carrying anything";
        }

        this.hideSeekTakeDrop();

        //USE - z zakończeniem gry
      } else if ((direction.match(/^U\s([A-Za-z])*$/gi) && this.inHand) || (direction.match(/^USE\s([A-Za-z])*$/gi) && this.inHand)) {
        const [, name] = direction.split(" ");
        const trade = this.currentlocation.trade.find(
          ({ from }) => from === this.inHand.id
        );
        //console.log(trade);
        if (this.inHand.id === 36 && this.inHand && this.inHand.name === name) {
          document.querySelector(".input").remove();
          document.body.innerHTML = "";

          const audio = new Audio("./audio/hejnal2.mp3");
          audio.play();

          const mute = document.createElement("div");
          mute.id = "mute";
          document.body.appendChild(mute);

          mute.addEventListener("click", function unmute() {
            if (audio.muted === true) {
              audio.muted = false;
              this.style.backgroundImage = "url('./img/unmute.png')";
            } else {
              audio.muted = true;
              this.style.backgroundImage = "url('./img/mute.png')";
            }
          });

          const endgame = document.createElement("div");

          endgame.id = "endgame";
          document.body.style.backgroundColor = "#00eaff";
          document.body.appendChild(endgame);
          //console.log(this.dragonParts);
        } else if (
          this.inHand.id !== 36 &&
          this.inHand &&
          this.inHand.name === name &&
          trade != undefined &&
          this.inHand.id === trade.from
        ) {
          const item = this.getItemID(trade.to);
          //console.log(item);
          //console.log(this.inHand);
          if (
            this.inHand.id !== 36 &&
            this.inHand.id !== 33 &&
            item.takeable &&
            !(this.dragonParts[0] === 30)
          ) {
            this.inHand = item;

            this.infoUse(trade);

            /////////////////////////////////////////////////////////////
            //sheep
          } else if (
            this.inHand.id === 33 &&
            this.dragonParts[0] === 30 &&
            item.takeable
          ) {
            this.inHand = item;
            this.infoUse(trade);
          } else if (this.dragonParts.length === 5 && this.inHand.id !== 33) {
            this.inHand = null;
            trade.message.push(
              "Your fake sheep is full of poison and ready to be eaten by the dragon"
            );
            this.infoUse(trade);
            this.inHand = this.getItemID(37);
            this.dragonParts = [];
            //console.log("test");

            document.querySelector(".input").focus();
            //////////////////////////////////////////////////////////
          } else if (this.inHand.id === 37) {
            this.inHand = null;
            this.infoUse(trade);
            this.dragonParts.push(item.id);

            this.currentlocation.image = "./img/death-dragon.bmp";
          } else if (this.inHand.id === 34) {
            this.inHand = item;
            this.infoUse(trade);
          } else if (this.inHand.id === 35) {
            this.inHand = item;
            this.infoUse(trade);
          } else if (this.inHand.id !== 33) {
            const self = this;
            self.dragonParts.push(item.id);
            this.inHand = null;
            this.infoUse(trade);
            //----/////////////////////////////////////////////////////////////////////////////////////////////////////
          } else {
            infoinput.innerHTML = "Nothing happened";
          }
        } else if (
          (this.inHand.id === 36 && this.inHand && this.inHand.name === name) ||
          (this.inHand &&
            this.inHand.name === name &&
            this.inHand.id != trade) ||
          (trade === undefined && this.inHand.id !== 36) ||
          (this.inHand.id === 33 && !(this.dragonParts[0] === 30))
        ) {
          infoinput.innerHTML = "Nothing happened";
          //console.log(this.inHand);
          //console.log(this.dragonParts);
        } else {
          infoinput.innerHTML = "You aren't carrying anything like that";
        }
        this.hideSeekUse();
      } else {
        infoinput.innerHTML = "Try another word or V for vocabulary";

        this.hideSeekUse();
      }
      ////////////////////////////////////////////////////////////////////////////////////////////

      // przemieszczanie po planszy
      const id = this.currentlocation.directions[direction];
      if (
        id === undefined &&
        (direction === "NORTH" ||
          direction === "N" ||
          direction === "SOUTH" ||
          direction === "S" ||
          direction === "WEST" ||
          direction === "W" ||
          direction === "EAST" ||
          direction === "E")
      ) {
        this.hideinputs();
        const infodirect = document.createElement("p");
        infodirect.innerHTML = "You can't go that way";
        infodirect.id = "infodirect";
        container.appendChild(infodirect);
        const self = this;
        setTimeout(function () {
          self.seekinputs();
          document.querySelector(".input").focus();
          document.getElementById("infodirect").remove();
        }, 1000);
      } else if (id === 41 && !(this.dragonParts[0] === 30)) {
        this.messageLocalization = [
          "You can't go that way...",
          "The dragon sleeps in a cave!",
        ];

        function displayMessage(messages, i = 0) {
          infoinput.innerHTML = messages[i];

          if (messages[i + 1]) {
            setTimeout(() => {
              displayMessage(messages, i + 1);
            }, 1500);
          }
        }

        displayMessage(this.messageLocalization);

        this.hideSeekUse();
      } else if (id === 41 && this.dragonParts[0] === 30) {
        this.currentlocation = this.getLocationbyID(id);
        this.hideSeekTakeDrop();
        if (direction === "WEST" || direction === "W") {
          infoinput.innerHTML = "You are going west...";
        }
        setTimeout(() => {
          this.render();
        }, 1500);
      } else if (id) {
        this.currentlocation = this.getLocationbyID(id);
        this.hideSeekTakeDrop();
        if (direction === "WEST" || direction === "W") {
          infoinput.innerHTML = "You are going west...";
        } else if (direction === "EAST" || direction === "E") {
          infoinput.innerHTML = "You are going east...";
        } else if (direction === "NORTH" || direction === "N") {
          infoinput.innerHTML = "You are going north...";
        } else if (direction === "SOUTH" || direction === "S") {
          infoinput.innerHTML = "You are going south...";
        }
        setTimeout(() => {
          this.render();
        }, 1500);
      }

      input.value = "";
    });
  }

  ///////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////
  //Intro
  startIntro() {
    const container = document.querySelector(".container");
    container.innerHTML = "";
    document.querySelector(".input").style.display = "none";
    document.querySelector(".labelforinp").style.display = "none";
    document.body.style.backgroundColor = "#1b5207";
    document.body.style.color = "#73bc31";
    const pressstart = document.createElement("h1");
    pressstart.innerHTML = "Press any key to start";
    pressstart.id = "pressstart";
    container.appendChild(pressstart);
    const self = this;

    window.addEventListener(
      "contextmenu",
      function (e) {
        // do something here...
        e.preventDefault();
        if (
          (document.querySelector(".input") ||
            document.querySelector(".labelforinp")) != undefined
        ) {
          document.querySelector(".input").focus();
        }
      },
      false
    );
    window.addEventListener(
      "mousedown",
      function (e) {
        // do something here...
        e.preventDefault();
        if (
          (document.querySelector(".input") ||
            document.querySelector(".labelforinp")) != undefined
        ) {
          document.querySelector(".input").focus();
        }
      },
      false
    );

    document.body.addEventListener("keypress", function pressToStart() {
      document.body.removeEventListener("keypress", pressToStart);
      document.getElementById("pressstart").remove();
      self.intro();
    });
  }
  ////////////////////////////////////////////////////////////////////////////////////////////
  intro() {
    const container = document.querySelector(".container");
    container.innerHTML = "";
    const audio = new Audio("./audio/hejnal2.mp3");
    audio.play();

    const mute = document.createElement("div");
    mute.id = "mute";
    document.body.appendChild(mute);

    mute.addEventListener("click", function unmute() {
      if (audio.muted === true) {
        audio.muted = false;
        this.style.backgroundImage = "url('./img/unmute.png')";
      } else {
        audio.muted = true;
        this.style.backgroundImage = "url('./img/mute.png')";
      }
    });

    const firstpicture = document.createElement("div");

    firstpicture.id = "firstpicture";
    document.body.style.backgroundColor = "#012c03";
    document.body.appendChild(firstpicture);

    setTimeout(function () {
      document.body.style.backgroundColor = "#1b5207";
      document.getElementById("firstpicture").remove();

      const firstintro = document.createElement("h1");
      firstintro.innerHTML =
        "This is based on a true story not a legend ;-) Dratewka the Shoemaker was a boy who lived in a small village close to Cracov in Poland during the middle ages. One day a terrifying dragon arrived in the town, living in the cave at the foot of the Wawel Castle mountain. The dragon began terrorizing the people and animals in and around the town. The fearless knights were unable to defeat the beast head on. Dratewka himself had no weapons but he used his skills and cunning to kill the dragon. He proved his feat by making shoes from the dragon’s skin!";
      firstintro.id = "firstintro";
      document.body.appendChild(firstintro);
    }, 2000);

    setTimeout(function () {
      document.getElementById("firstintro").remove();

      const secondintro = document.createElement("h1");
      secondintro.innerHTML =
        "Now it is your turn to follow in Dratewka’s footsteps… Happy dragon slaying! Later you can visit Cracov city and famous dragon cave.<br/><br/>Story by Kaz, original design and program by Scalak and Kaz, most pictures stolen from different sources by Kaz. Thanks for support to Tezz, Mono, Larek and Jurgi. Attari rules forever! <br/><br/>atarionline.pl 2022";
      secondintro.id = "secondintro";
      document.body.appendChild(secondintro);
    }, 8000);

    const self = this;
    setTimeout(function () {
      document.body.style.backgroundColor = "";
      document.body.style.color = "";
      self.seekinputs();
      document.getElementById("secondintro").remove();
      document.getElementById("mute").remove();
      audio.pause();
      self.render();
      document.querySelector(".input").focus();
    }, 12000);
  }
  ////////////////////////////////////////////////////////////////////////////////////////////
  render() {
    this.focus();
    const container = document.querySelector(".container");
    container.innerHTML = "";
    //Nagłówek - nazwa lokalizacji
    const title = document.createElement("p");
    title.id = "title";
    title.innerHTML = this.currentlocation.description;

    // Obrazek lokalizacji
    const image = document.createElement("img");
    image.src = this.currentlocation.image;
    image.style.backgroundColor = this.currentlocation.color;
    image.id = "image";

    //Kompas
    const compass = document.createElement("div");
    compass.id = "compass";

    //Kierunki - text
    const textdir = document.createElement("p");
    textdir.id = "textdir";
    textdir.innerHTML = `You can go ${Object.keys(
      this.currentlocation.directions
    ).join(", ")}`;

    //Kierunki - kwadraty do kompasu
    if (this.currentlocation.directions.hasOwnProperty("NORTH") === false) {
      const hidenorth = document.createElement("div");
      hidenorth.id = "hidenorth";
      container.appendChild(hidenorth);
    }
    if (this.currentlocation.directions.hasOwnProperty("SOUTH") === false) {
      const hidesouth = document.createElement("div");
      hidesouth.id = "hidesouth";
      container.appendChild(hidesouth);
    }
    if (this.currentlocation.directions.hasOwnProperty("WEST") === false) {
      const hidewest = document.createElement("div");
      hidewest.id = "hidewest";
      container.appendChild(hidewest);
    }
    if (this.currentlocation.directions.hasOwnProperty("EAST") === false) {
      const hideeast = document.createElement("div");
      hideeast.id = "hideeast";
      container.appendChild(hideeast);
    }

    //Dostępne przedmioty - text
    const itemsinfo = document.createElement("p");
    itemsinfo.id = "itemsinfo";

    //console.log(this.currentlocation.items.length);
    //console.log(this.currentlocation.directions);
    itemsinfo.innerHTML = "You see ";
    if (this.currentlocation.items.length > 0 || this.dragonParts.length > 0) {
      for (let i = 0; i < this.currentlocation.items.length; i++) {
        if (
          i < this.currentlocation.items.length &&
          itemsinfo.innerHTML !== "You see "
        ) {
          itemsinfo.innerHTML +=
            ", " + this.getItemID(this.currentlocation.items[i]).showname;
        } else {
          itemsinfo.innerHTML += this.getItemID(
            this.currentlocation.items[i]
          ).showname;
        }
      }
    }
    if (this.currentlocation.dragonParts) {
      for (let i = 0; i < this.dragonParts.length; i++) {
        const item = this.getItemID(this.dragonParts[i]).showname;
        if (i < this.dragonParts.length && itemsinfo.innerHTML !== "You see ") {
          itemsinfo.innerHTML += ", " + item;
        } else {
          itemsinfo.innerHTML += item;
        }
      }
    }

    if (
      (this.currentlocation.items.length === 0 &&
        this.dragonParts.length === 0) ||
      (this.currentlocation.items.length === 0 &&
        !this.currentlocation.dragonParts)
    ) {
      itemsinfo.innerHTML = "You see nothing";
    }

    //Przedmiot w ręce gracza - text
    const itemsbag = document.createElement("p");
    itemsbag.id = "itemsbag";
    if (!this.inHand) {
      itemsbag.innerHTML = "You are carrying nothing";
    } else {
      itemsbag.innerHTML = "You are carrying " + this.inHand.showname;
    }

    //Dodawanie do kontenera
    container.appendChild(title);
    container.appendChild(image);
    container.appendChild(compass);
    container.appendChild(textdir);
    container.appendChild(itemsinfo);
    container.appendChild(itemsbag);
  }
}
