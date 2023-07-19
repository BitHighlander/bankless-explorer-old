import { Spinner, Box, Button, Stack, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useNavigate } from "react-router-dom";

import "leaflet/dist/leaflet.css";
import { usePioneer } from "lib/context/Pioneer";

const MapWithPins = () => {
  const { state } = usePioneer();
  const { api } = state;
  const [locations, setLocations] = useState([]);
  const navigate = useNavigate();

  const onStart = async () => {
    try {
      if (api) {
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

  useEffect(() => {
    onStart();
  }, [api]);

  const handleLPProvideClick = (terminalName: string) => {
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
            <Button
              colorScheme="teal"
              mt={2}
              onClick={() => handleLPProvideClick(terminal.terminalName)}
            >
              LP Provide
            </Button>
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

export default MapWithPins;
