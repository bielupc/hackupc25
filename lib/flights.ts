// TODO: passar origin, destination  i data com a parametres

export const getFlights = async () => {
  const args = {
    origin: 'BCN',
    destination: 'CDG',
    date: {
      year: 2025,
      month: 5,
      day: 15,
    },
  }
  const { origin, destination, date } = args;
  const response = await fetch('/api/skyscanner', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query_legs: [
        {
          origin_place_id: { iata: origin },
          destination_place_id: { iata: destination },
          date: { year: date.year, month: date.month, day: date.day },
        },
      ],
      adults: 1,
    }),
  });

  const data = await response.json();
  console.log('Flight data:', data);
};
