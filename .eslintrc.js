/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: ["sznm/react", "plugin:react/jsx-runtime"],
  rules: {
    // Allow console logs
    "react/destructuring-assignment": "off",
    "no-console": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    "jsx-a11y/anchor-is-valid": "off",
    "no-plusplus": "off",
    // Disable unused variable errors for specific variables
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        varsIgnorePattern: "chakra|Stack|CircularProgress|Drawer|DrawerOverlay|DrawerContent|DrawerHeader|DrawerBody|Tabs|TabList|TabPanels|Tab|TabPanel|AvatarBadge|Box|Button|Flex|HStack|IconButton|Link|Menu|Image|MenuButton|MenuDivider|Icon|MenuItem|MenuList|Spacer|Text|useDisclosure|Accordion|AccordionItem|AccordionButton|AccordionIcon|AccordionPanel|SimpleGrid|Card|CardHeader|Heading|CardBody|CardFooter|Modal|ModalOverlay|ModalContent|ModalHeader|ModalCloseButton|ModalBody|ModalFooter|React|Balance|hover|setHover",
        argsIgnorePattern: "^_",
      },
    ],
    // Disable redeclaration errors for Balance
    "@typescript-eslint/no-redeclare": [
      "error",
      {
        ignoreDeclarationMerge: true,
      },
    ],
    // Disable explicit any warnings
    "@typescript-eslint/no-explicit-any": "off",
    // Disable destructuring assignment errors for balance
    // Disable onStart missing dependency warning
    "react-hooks/exhaustive-deps": [
      "warn",
      {
        additionalHooks: "(onStart)",
      },
    ],
  },
};
