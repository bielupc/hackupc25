import React, { useState } from 'react';
import Select from 'react-select';

const airports = [
    { label: 'Barcelona El Prat (BCN)', value: 'BCN' },
    { label: 'London Heathrow (LHR)', value: 'LHR' },
    { label: 'Los Angeles International (LAX)', value: 'LAX' },
    { label: 'Paris - Charles de Gaulle Airport (CDG)', value: 'CDG' }, // París
    { label: 'Frankfurt Airport (FRA)', value: 'FRA' }, // Frankfurt
    { label: 'Amsterdam Schiphol (AMS)', value: 'AMS' }, // Ámsterdam
    { label: 'Madrid Barajas (MAD)', value: 'MAD' }, // Madrid
    { label: 'Munich Airport (MUC)', value: 'MUC' }, // Múnich
    { label: 'Zurich Airport (ZRH)', value: 'ZRH' }, // Zurich
    { label: 'London Gatwick (LGW)', value: 'LGW' }, // Londres
    { label: 'Rome Fiumicino (FCO)', value: 'FCO' }, // Roma
    { label: 'Vienna International Airport (VIE)', value: 'VIE' }, // Viena
    { label: 'Copenhagen Airport (CPH)', value: 'CPH' }, // Copenhague
    { label: 'Berlin Brandenburg (BER)', value: 'BER' }, // Berlín
    { label: 'Brussels Airport (BRU)', value: 'BRU' }, // Bruselas
    { label: 'Lisbon Humberto Delgado Airport (LIS)', value: 'LIS' }, // Lisboa
    { label: 'Oslo Gardermoen Airport (OSL)', value: 'OSL' }, // Oslo
    { label: 'Stockholm Arlanda Airport (ARN)', value: 'ARN' }, // Estocolmo
    { label: 'Dublin Airport (DUB)', value: 'DUB' }, // Dublín
    { label: 'Athens Eleftherios Venizelos (ATH)', value: 'ATH' }, // Atenas
    { label: 'Prague Václav Havel Airport (PRG)', value: 'PRG' }, // Praga
    { label: 'Warsaw Chopin Airport (WAW)', value: 'WAW' }, // Varsovia
    { label: 'Budapest Ferenc Liszt Airport (BUD)', value: 'BUD' }, // Budapest
    { label: 'Hamburg Airport (HAM)', value: 'HAM' }, // Hamburgo
    { label: 'Milan Malpensa (MXP)', value: 'MXP' }, // Milán
    { label: 'Barcelona Reus Airport (REU)', value: 'REU' }, // Reus (cerca de Barcelona)
    { label: 'Nice Côte d\'Azur Airport (NCE)', value: 'NCE' }, // Niza
    { label: 'Manchester Airport (MAN)', value: 'MAN' }, // Manchester
  ];
  
interface AirportAutocompleteProps {
onAirportSelect: (iataCode: string) => void;
}
  
const AirportAutocomplete = ({ onAirportSelect }: AirportAutocompleteProps) => {
const [selectedAirport, setSelectedAirport] = useState(null);

const handleChange = (selectedOption: any) => {
    setSelectedAirport(selectedOption);
    onAirportSelect(selectedOption?.value);
};

return (
    <Select
  value={selectedAirport}
  onChange={handleChange}
  options={airports}
  className="rounded-lg"
  placeholder="E.g. Barcelona El Prat (BCN)"
  menuPortalTarget={document.body}
  menuPosition="fixed"
  styles={{
    menu: (provided) => ({
      ...provided,
      zIndex: 9999, 
    }),
  }}
/>
  
);
};

export default AirportAutocomplete;