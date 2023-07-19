import {
  Box,
  Button,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Spinner,
  Text,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { usePioneer } from "lib/context/Pioneer";
import Sessions from "./components/Sessions";
import CapTable from "./components/CapTable";

const LP = () => {
  const { terminalName } = useParams<{ terminalName: string }>();
  const { state } = usePioneer();
  const { api, wallet, app } = state;
  const [sessionId, setSessionId] = useState<string>("");
  const [atmAddress, setAtmAddress] = useState<string>("");
  const [amount, setAmount] = useState<number>(10);
  const [rate, setRate] = useState<number>("");
  const [usd, setUsd] = useState<number>("");
  const [dai, setDai] = useState<number>("");

  const onSend = async () => {
    try {
      const ASSET = "DAI";
      const balance = app.balances.filter((e: any) => e.symbol === ASSET);
      console.log("balance: ", balance);
      if (!balance) Alert(`No balance for asset ${ASSET}`);
      const TEST_AMOUNT = amount.toString(); // Use the selected amount
      // user selects balance to send
      const selectedBalance = balance[0];
      const send = {
        blockchain: "ethereum",
        network: "ETH", // eww
        context: selectedBalance.context,
        asset: selectedBalance.symbol,
        contract: selectedBalance.contract,
        balance: selectedBalance.balance,
        address: atmAddress,
        amount: TEST_AMOUNT,
        noBroadcast: false,
      };

      const tx = {
        type: "sendToAddress",
        payload: send,
      };

      console.log("tx: ", tx);
      let invocation = await app.build(tx);
      console.log("invocation: ", invocation);

      // sign
      invocation = await app.sign(invocation, wallet);
      // eslint-disable-next-line no-console
      console.log("invocation: ", invocation);

      // get txid
      const payload = {
        noBroadcast: false,
        sync: true,
        invocationId: "placeholder",
      };
      invocation.broadcast = payload;
      const resultBroadcast = await app.broadcast(invocation);
      console.log("resultBroadcast: ", resultBroadcast);
    } catch (error) {
      console.error(error);
    }
  };

  const startSession = async () => {
    try {
      if (api) {
        // Make REST calls to fetch the locations data
        console.log("terminalName: ", terminalName);

        // get address
        const pubkey = app.pubkeys.filter((e: any) => e.symbol === "ETH");
        console.log("pubkey: ", pubkey);
        const myAddress = pubkey[0].address;
        console.log("myAddress: ", myAddress);

        const body = {
          terminalName,
          address: myAddress,
          type: "lpAddAsym",
        };
        console.log("body: ", body);
        const sessionInfo = await api.StartSession(body);
        // eslint-disable-next-line no-console
        console.log("sessionInfo: ", sessionInfo.data);
        if (sessionInfo.data.sessionId) {
          setSessionId(sessionInfo.data.sessionId);
          setAtmAddress(sessionInfo.data.pubkey);
        }
        // setLocations(locationsData);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onStart = async () => {
    try {
      if (api) {
        // Make REST calls to fetch the locations data
        const terminals = await api.BanklessInfo();
        // eslint-disable-next-line no-console
        console.log("terminals: ", terminals.data);
        // fitler by terminalName
        let terminal = terminals.data.filter(
          (e: any) => e.terminalName === terminalName
        );
        // eslint-disable-next-line prefer-destructuring
        terminal = terminal[0];
        console.log("terminal: ", terminal);
        console.log("terminal: ", terminal.pubkey);
        setAtmAddress(terminal.pubkey);
        setRate(terminal.rate);
        setUsd(terminal.TOTAL_CASH);
        setDai(terminal.TOTAL_DAI);
        // setLocations(locationsData);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    onStart();
  }, [api]);

  if (!api) {
    return <Spinner size="xl" />;
  }

  return (
    <Box
      borderWidth="1px"
      borderRadius="md"
      padding={4}
      maxWidth="300px"
      margin="auto"
    >
      <Tabs isLazy>
        <TabList>
          <Tab>LP</Tab>
          <Tab>Sessions</Tab>
          <Tab>Cap Table</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Text fontSize="xl" fontWeight="bold" textAlign="center" mb={4}>
              terminalName: {terminalName}
            </Text>
            <Text fontSize="xl" fontWeight="bold" textAlign="center" mb={4}>
              terminalName: {terminalName}
            </Text>
            <Text fontSize="xl" fontWeight="bold" textAlign="center" mb={4}>
              rate: {rate ? rate : "0"}
            </Text>
            <Text fontSize="xl" fontWeight="bold" textAlign="center" mb={4}>
              USD: {usd ? usd : "0"}
            </Text>
            <Text fontSize="xl" fontWeight="bold" textAlign="center" mb={4}>
              DAI: {dai ? dai : "0"}
            </Text>
            <Text fontSize="xl" fontWeight="bold" textAlign="center" mb={4}>
              address: {atmAddress}
            </Text>
            {sessionId ? (
              <div>
                <Box>
                  sessionId: <small>{sessionId}</small>
                </Box>
                <Text>Select amount: ${amount}</Text>
                <Slider
                  defaultValue={amount}
                  min={10}
                  max={100}
                  step={1}
                  onChange={(value) => setAmount(value)}
                  mb={4}
                >
                  <SliderTrack>
                    <SliderFilledTrack />
                  </SliderTrack>
                  <SliderThumb />
                </Slider>
                <Button onClick={onSend}>Send DAI</Button>
              </div>
            ) : (
              <div>
                <Button
                  onClick={startSession}
                  color="green"
                  size="lg"
                  width="100%"
                  mb={4}
                >
                  Begin LP add Session
                </Button>
                <Button
                  onClick={startSession}
                  color="teal"
                  size="lg"
                  width="100%"
                  mb={4}
                >
                  Begin LP withdrawal Session
                </Button>
              </div>
            )}
          </TabPanel>
          <TabPanel>
            <Sessions terminalName={terminalName}/>
          </TabPanel>
          <TabPanel>
            <CapTable terminalName={terminalName}/>
          </TabPanel>
        </TabPanels>
      </Tabs>

    </Box>
  );
};

export default LP;
