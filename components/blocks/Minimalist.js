import React from "react";
import { AppleIcon } from "@/public/icons";
import { Flex, Text } from "@chakra-ui/react";

export default function MinimalistBlock() {

    return(
      <>
        <Flex direction="row" alignItems="center">
          <AppleIcon mr={2} width={4} height={4} mb={1} />
          <Text fontSize="large" fontWeight="600" color="#fff">Apple</Text>
        </Flex>
        <Text fontSize="30px" fontWeight="100" color="#fff">Minimalist</Text>
      </>
    );
  }
