import React from "react";
import { Link } from "react-router-dom";
import { Flex } from "@chakra-ui/react";
import "../components/style.css";

export const Navigation = () => {
  return (
    <Flex
      columns={[1, 2]}
      p={2}
      mb={10}
      wrap="wrap"
      direction={["column", "row"]}
      align="center"
      justify="center"
      gap={4}
      bg="#373A40"
      color="white"
    >
      <Link to="/" className="nav-link">
        Home
      </Link>

      <Link to="/event/1" className="nav-link">
        Event
      </Link>
    </Flex>
  );
};
