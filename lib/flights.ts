const getFlights = async () => {
    try {
      const response = await fetch('/flights_api');
      const data = await response.json();
  
      if (!response.ok) {
        console.error('Error fetching flights:', data);
        return;
      }
  
      console.log(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };
  