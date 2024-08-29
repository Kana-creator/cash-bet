const FetchGames = async (res, axios) => {
  console.log(process.env.GAMES_API_PASSWORD);

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

    // &bid=17,43,144
    // &cid=2,7,8
    // &edt=${futureDateString}
    // &btgrp=1x2,OU,DC,HSH,HTFT,BTS,OE,DNB,EH,TGBTS,IOU,RTG

    const missingCountries =
      "2,9,11,15,17,32,40,46,48,52,55,63,66,70,71,72,77,78,81,82,83,85,86,87,88,92,94,96,97,98,99,102,203,104,105,106,109,110,111,114,117,120,121,122,123,124,125,127,128,129,130,131,132,133,134,135,137,138,139,141,142,143,145,147,148,155,157,158,159,161,162,163,164,165,166,168,169,170,171,172,273,175,176,177,178,179,180,181,182,183,184,185,186,187,188,191,193,194,195,196,197,198,200";

    const selectedCountryIDs =
      "5,7,8,10,12,18,20,24,23,25,33,34,35,36,42,44,45,47,50,51,57,62,61,65,64,75,74,69,80,76,79,115,140";

    const selectedLeagueIDs =
      "225,70,66,1157,199,314,314,165,80,148,61,141,110,171,47,188,179,1637,206, 161,124,90,404,512,158,204,372,1104,313,167,182,52,213,107,5,6,181,58,21087,432";

    const response = await axios
      .get(
        `${process.env.GAMES_API_URL}?l=1&u=${process.env.GAMES_API_USER}&p=${process.env.GAMES_API_PASSWORD}&edt=${futureDateString}&lid&bid&cid=${selectedCountryIDs}`
      )
      .catch((error) => console.log(error));
    return res.json({ games: !response ? [] : response.data });
  } catch (error) {
    // console.log(error.message);
    return []; // Or handle errors more gracefully
  }
};

export default FetchGames;
