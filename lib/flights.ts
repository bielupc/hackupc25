// TODO: passar origin, destination  i data com a parametres

export const getFlightCost = async (args) => {

  /*
  
  {destination: 'Maui, Hawaii', placeCode: 'OGG', explanation: 'Maui embodies the relaxed, vacation-ready vibe fro…resque moments filled with photography at sunset.', activities: Array(3)}
  destination
  : 
  "Maui, Hawaii"
  explanation: 
  "Maui embodies the relaxed, vacation-ready vibe from the images and preferences. It offers stunning sunset views, vibrant beach activities, and opportunities for exploration through its picturesque landscapes. With warm weather, plenty of swimmable beaches, and a laid-back atmosphere perfect for casual summer attire, Maui is ideal for group members looking to unwind and enjoy picturesque moments filled with photography at sunset."
  placeCode: "OGG"
  */
  console.log("trying to get flights") 
  const { origin, destination, date} = args;

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
          date: { year: date.split('-')[0], month: parseInt(date.split('-')[1], 10), day: parseInt(date.split('-')[2].split('T')[0], 10) },
        },
      ],
      adults: 1,
    }),
  });

  // console.log('Flight data:', data);

  return response;
};
