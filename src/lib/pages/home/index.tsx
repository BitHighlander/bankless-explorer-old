import {
  Grid,
  Box,
  Avatar,
  VStack,
  IconButton,
  useDisclosure,
  Button,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Heading,
  List,
  ListItem,
  Divider,
} from "@chakra-ui/react";
import React from "react";
import {
  FaUserPlus,
  FaInbox,
  FaMicrophone,
  FaHeadset,
  FaChevronDown,
} from "react-icons/fa";

import MapWithPins from "./components/MapWithPins";

const Home = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef<HTMLButtonElement>(null);


  return (
    <div>
      <MapWithPins></MapWithPins>
    </div>
  );
};

export default Home;
