import { Spinner, Box, Button, Flex, Image, Link, Stack, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { AiFillGithub } from "react-icons/ai";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Link as RouterLink, useNavigate } from "react-router-dom";

import "leaflet/dist/leaflet.css";
import { usePioneer } from "lib/context/Pioneer";

const locationsData = [
  {
    terminalId: 1,
    terminalName: "Terminal A",
    rate: "$1.01 USD/DAI",
    location: [51.505, -0.09],
  },
  {
    terminalId: 2,
    terminalName: "Terminal B",
    rate: "$.94 USD/DAI",
    location: [51.51, -0.1],
  },
  // Add more location objects as needed
];

const MapWithPins = () => {
  const { state } = usePioneer();
  const { api } = state;
  const [locations, setLocations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    onStart();
  }, [api]);

  const onStart = async () => {
    try {
      if(api){
        // Make REST calls to fetch the locations data
        const terminals = await api.BanklessInfo();
        // eslint-disable-next-line no-console
        console.log("terminals: ", terminals.data);
        setLocations(terminals.data);
        // setLocations(locationsData);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleLPProvideClick = (terminalName:string) => {
    navigate(`/lp/${terminalName}`);
  };

  if (!api) {
    return <Spinner size="xl" />;
  }

  return (
    <Box textAlign="center">
      <MapContainer
        center={[51.505, -0.09]}
        zoom={13}
        style={{ height: "400px" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        />
        {locations.map((location) => (
          <Marker position={location.location} key={location.terminalId}>
            <Popup>{location.terminalName}</Popup>
          </Marker>
        ))}
      </MapContainer>
      <Stack spacing={4} marginTop={4}>
        {locations.map((terminal) => (
          <Box
            key={terminal.terminalName}
            borderWidth="1px"
            borderRadius="md"
            padding={4}
          >
            <Text fontWeight="bold">{terminal.terminalName}</Text>
            <Text>tradePair: {terminal.tradePair}</Text>
            <Text>Rate: {terminal.rate}</Text>
            <Text>atmAddress: {terminal.pubkey}</Text>
            <Text>usd: {terminal.TOTAL_CASH}</Text>
            <Text>dai: {terminal.TOTAL_DAI}</Text>
            <Button colorScheme="teal" mt={2} onClick={() => handleLPProvideClick(terminal.terminalName)}>
              LP Provide
            </Button>
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

export default MapWithPins;
