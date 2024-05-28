const FetchGames = async (res, axios) => {
  const todayMonth = new Date().getMonth() + 1;
  const todayYear = new Date().getFullYear();
  const todayDate = new Date().getDate();

  const today = todayYear + "-" + todayMonth + "-" + todayDate;

  try {
    let daysToAdd = 0; // Change this value to the desired number of days
    if (new Date().getDay() === 1) {
      daysToAdd = 8;
    } else if (new Date().getDay() === 2) {
      daysToAdd = 7;
    } else if (new Date().getDay() === 3) {
      daysToAdd = 6;
    } else if (new Date().getDay() === 4) {
      daysToAdd = 5;
    } else if (new Date().getDay() === 5) {
      daysToAdd = 4;
    } else if (new Date().getDay() === 6) {
      daysToAdd = 3;
    } else if (new Date().getDay() === 0) {
      daysToAdd = 2;
    }

    // Given date string
    const dateString = today;

    // Convert the date string to a Date object
    const givenDate = new Date(dateString);

    // Calculate the future date
    const futureDate = new Date(givenDate);
    futureDate.setDate(givenDate.getDate() + daysToAdd);

    // Format the future date as a string
    const futureDateString = futureDate.toISOString().split("T")[0]; // Format: YYYY-MM-DD

    const response = await axios
      .get(
        `${process.env.GAMES_API_URL}?l=1&u=${process.env.GAMES_API_USER}&p=${process.env.GAMES_API_PASSWORD}&edt=${futureDateString}&lid=${selectedLeagueIDs}&bid=17,43,144&btgrp`
      )
      .catch((error) => console.log(error));
    return res.json({ games: !response ? [] : response.data });
  } catch (error) {
    console.log(error.message);
    return []; // Or handle errors more gracefully
  }
};

export default FetchGames;
