const FetchGameResults = async (req, res, axios) => {
  const { event_id } = req.params;

  const todayMonth = new Date().getMonth() + 1;
  const todayYear = new Date().getFullYear();
  const todayDate = new Date().getDate();

  const today = todayYear + "-" + todayMonth + "-" + todayDate;

  // Given date string
  const dateString = today;

  // Convert the date string to a Date object
  const givenDate = new Date(dateString);

  // Calculate the future date
  const futureDate = new Date(givenDate);
  futureDate.setDate(givenDate.getDate() + 1);

  // Calculate the passed date
  const passedDate = new Date(givenDate);
  passedDate.setDate(givenDate.getDate() + 0);

  // Format the future date as a string
  const futureDateString = futureDate.toISOString().split("T")[0]; // Format: YYYY-MM-DD

  // Format the passed date as a string
  const passedDateString = passedDate.toISOString().split("T")[0]; // Format: YYYY-MM-DD

  try {
    const response = await axios
      .get(
        `${process.env.GAMES_API_URL}?l=1&u=${process.env.GAMES_API_USER}&p=${process.env.GAMES_API_PASSWORD}&eid=${event_id}&edt=${futureDateString}stc=0&sdt=${passedDateString}`
      )
      .catch((error) => console.log("error"));
    // console.log(response.data);
    return res.json({ game: !response.data ? [] : response.data });
  } catch (error) {
    // console.log(error);
    return []; // Or handle errors more gracefully
  }
};

export default FetchGameResults;
