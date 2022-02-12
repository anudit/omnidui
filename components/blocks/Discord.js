import React from "react";
import { DiscordIcon } from "@/public/icons";
import { Flex, Text } from "@chakra-ui/react";

export default function DiscordBlock() {

    return(
      <>
        <Flex direction="row">
          <DiscordIcon mr={2} width={6} height={6} />
          <Text fontSize="large" fontWeight="600">Discord</Text>
        </Flex>
        <Text fontSize="30px" fontWeight="100">Anudit#0000</Text>
      </>
    );
  }
