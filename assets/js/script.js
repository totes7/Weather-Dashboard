// Add DOM event listener
document.addEventListener("DOMContentLoaded", function () {
  // Create and append '#today' section elements
  let todayInfo = $("<div>");
  todayInfo.css("display", "flex");
  let todayH2 = $("<h2>");
  todayH2.addClass("fw-bold");
  let icon = $("<img>");
  icon.css("margin-left", "15px");
  todayInfo.append(todayH2, icon);
  let todayTemp = $("<p>");
  let todayWind = $("<p>");
  let todayHumidity = $("<p>");
  $("#today").append(todayInfo, todayTemp, todayWind, todayHumidity);

  // Load history buttons
  let btnHistory = [];
  let savedBtns = localStorage.getItem("SavedButtons");
  if (savedBtns) {
    btnHistory = JSON.parse(savedBtns);
  }

  createButtons();

  // Display weather plus forecast
  function displayWeather(searchInput) {

    $("#forecast").empty();

    let APIKey = "70f1a1888e6f161d93f2afb8a17a7782";
    let queryURL =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      searchInput +
      "&appid=" +
      APIKey +
      "&units=metric";

    // Update local storage
    if (!btnHistory.includes(searchInput)) {
      btnHistory.push(searchInput);
    }

    createButtons();

    $("#search-input").val("");

    fetch(queryURL)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        todayH2.text(`${data.name} (${dayjs().format("DD/MM/YYYY")})`);
        let iconCode = data.weather[0].icon;
        let iconUrl = "http://openweathermap.org/img/w/" + iconCode + ".png";
        icon.attr("src", iconUrl);
        todayTemp.text(`Temperature: ${data.main.temp}C°`);
        todayWind.text(`Wind: ${data.wind.speed}m/s`);
        todayHumidity.text(`Humidity: ${data.main.humidity}%`);

        // Create and append '#forecast' section elements
        let forecastHeader = $("<div>");
        forecastHeader.addClass("col-12 h3 fw-bold text-start");
        forecastHeader.text("5-Day Forecast:");
        $("#forecast").append(forecastHeader);
        for (let i = 0; i < 5; i++) {
          let newDiv = $("<div>");
          newDiv.attr("id", `day-${i + 1}`);
          newDiv.addClass("col-lg-2 col-sm-12 text-white");
          newDiv.css({
            "background-color": "#17434f",
            margin: "10px auto",
            padding: "10px",
          });
          let forecastInfo = $("<div>");
          let forecastH4 = $("<h4>");
          forecastH4.attr("id", `h4-${i + 1}`);
          let icon = $("<img>");
          icon.attr("id", `i-${i + 1}`);
          forecastInfo.append(forecastH4, icon);
          let forecastTemp = $("<p>");
          forecastTemp.attr("id", `t-${i + 1}`);
          let forecastWind = $("<p>");
          forecastWind.attr("id", `w-${i + 1}`);
          let forecastHumidity = $("<p>");
          forecastHumidity.attr("id", `h-${i + 1}`);
          newDiv.append(
            forecastInfo,
            forecastTemp,
            forecastWind,
            forecastHumidity
          );
          $("#forecast").append(newDiv);
        }

        let forecastAPIKey = "70f1a1888e6f161d93f2afb8a17a7782";

        let forecastQueryURL =
          "https://api.openweathermap.org/data/2.5/forecast?q=" +
          searchInput +
          "&cnt=5&appid=" +
          forecastAPIKey +
          "&units=metric";

        fetch(forecastQueryURL)
          .then(function (response) {
            return response.json();
          })
          .then(function (data) {
            for (let j = 0; j < data.list.length; j++) {
              $(`#h4-${j + 1}`).text(
                dayjs()
                  .add(j + 1, "day")
                  .format("DD/MM/YYYY")
              );
              let fIconCode = data.list[j].weather[0].icon;
              let fIconUrl =
                "http://openweathermap.org/img/w/" + fIconCode + ".png";
              $(`#i-${j + 1}`).attr("src", fIconUrl);
              $(`#t-${j + 1}`).text(`Temp: ${data.list[j].main.temp}C°`);
              $(`#w-${j + 1}`).text(`Wind: ${data.list[j].wind.speed}m/s`);
              $(`#h-${j + 1}`).text(`Humidity: ${data.list[j].main.humidity}%`);
            }
          });
      });
  }

  // Create and append buttons
  function createButtons() {
    localStorage.setItem("SavedButtons", JSON.stringify(btnHistory));
    
    $("#history").empty();

    for (let i = 0; i < btnHistory.length; i++) {
      
      let newBtn = $("<button>");
      newBtn.addClass("btn btn-secondary");
      newBtn.css({
        "background-color": "#9e9eaa",
        "margin-top": "10px",
        color: "black",
      });
      newBtn.text(btnHistory[i]);
      $("#history").append(newBtn);
    }
  }

  // Search button event listener
  $("#search-button").on("click", function(event) {
    event.preventDefault();

    let searchInput = $("#search-input").val();

    displayWeather(searchInput);
  });

  // History buttons event listener
  $('#history').on('click', '.btn-secondary', function(event) {
    event.preventDefault();

    let btnCity = $(this).text()

    displayWeather(btnCity);
  })
});
