function getAllCookies() {
  return document.cookie
    .split(";")
    .reduce(
      (ac, str) =>
        Object.assign(ac, { [str.split("=")[0].trim()]: str.split("=")[1] }),
      {}
    );
}

class Results {
  addResult(width, height, bombsCount, nick, time) {
    const result = {
      time,
      nick,
      width,
      height,
      bombsCount,
    };

    const id = new Date().getTime();

    document.cookie =
      id +
      "=" +
      JSON.stringify(result) +
      "; expires=Fri, 31 Dec 9999 23:59:59 GMT";

    this.render(width, height, bombsCount);
  }

  render(width, height, bombsCount) {
    const addcontainer = document.querySelector(
      ".result-container table tbody"
    );
    addcontainer.innerHTML = "";
    const cookies = getAllCookies();
    //console.log(cookies);
    //console.log(cookies);

    const tabcookies = Object.values(cookies)
      .filter(Boolean)
      .map(JSON.parse)
      .filter(function (result) {
        return (
          width === result.width &&
          height === result.height &&
          bombsCount === result.bombsCount
        );
      })
      .sort(function (a, b) {
        if (a.time > b.time) {
          return 1;
        }
        return -1;
      })
      .slice(0, 10)
      .forEach(function (result) {
        addcontainer.innerHTML += `<tr> <td> ${result.nick} </td> <td> ${
          Math.round((result.time * 100) / 1000) / 100
        }s</td></tr>`;
      });

    //console.log(tabcookies);
  }
}

// https://developer.mozilla.org/pl/docs/Web/JavaScript/Reference/Global_Objects/Array
