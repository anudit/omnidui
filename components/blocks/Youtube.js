import React from "react";
import { YoutubeIcon } from "@/public/icons";
import { Flex, Text } from "@chakra-ui/react";

export default function VideoBlock() {
    return(
        <>
            <Flex direction="row" w="100%" justifyContent="center" my={1}>
            <YoutubeIcon mr={2} width={6} height={6} />
            <Text fontSize="large" fontWeight="600">Youtube</Text>
            </Flex>
            <iframe width="inherit" height="100%" src="https://www.youtube.com/embed/QH2-TGUlwu4" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
        </>
    );
}
