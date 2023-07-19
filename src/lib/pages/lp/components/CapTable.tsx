import React, { useEffect, useState } from "react";
import { usePioneer } from "lib/context/Pioneer";
import { Spinner, Text } from "@chakra-ui/react";

const CapTable = (terminalName:any) => {
  const { state } = usePioneer();
  const { api } = state;
  const [owners, setOwners] = useState([]);

  const onStart = async () => {
    try {
      // Mock ownership data for testing
      const mockOwners = [
        {
          address: "0x123456789",
          percent: 30,
        },
        {
          address: "0xabcdef123",
          percent: 40,
        },
        {
          address: "0x987654321",
          percent: 30,
        },
      ];
      console.log("terminalName: ", terminalName);
      console.log("terminalName: ", terminalName.terminalName);
      // get private info
      let terminalInfo = await api.TerminalPrivate({
        terminalName: terminalName.terminalName,
      });
      terminalInfo = terminalInfo.data;
      console.log("terminalInfo: ", terminalInfo);
      console.log("terminalInfo: ", terminalInfo.terminalInfo);
      console.log("captable: ", terminalInfo?.terminalInfo?.captable);


      setOwners(terminalInfo?.terminalInfo?.captable);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    onStart();
  }, []);

  if (!api) {
    return <Spinner size="xl" />;
  }

  return (
    <div>
      {terminalName.terminalName}
      {owners.map((owner) => (
        <div key={owner.address}>
          <Text>Address: {owner.address}</Text>
          <Text>Percent: {owner.percentage}%</Text>
        </div>
      ))}
    </div>
  );
};

export default CapTable;
