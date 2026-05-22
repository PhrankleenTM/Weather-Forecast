export default async function handler(req, res) {
  const city = req.query.city;

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${process.env.OPENWEATHER_API_KEY}`,
    );

    const data = await response.json();

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch weather" });
  }
}
