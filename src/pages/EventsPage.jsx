import React from "react";
import { useLoaderData, Link } from "react-router-dom";
import {
  Heading,
  Text,
  Box,
  Image,
  Badge,
  Button,
  Card,
  CardFooter,
  CardBody,
  useDisclosure,
  SimpleGrid,
  HStack,
  Flex,
  Divider,
} from "@chakra-ui/react";

import { useState } from "react";
import { ModalForm } from "../components/ModalForm";
import { SearchEvents } from "../components/SearchEvents";
import { FilterEvents } from "../components/FilterEvents";

export const loader = async () => {
  try {
    const [eventRes, categoriesRes] = await Promise.all([
      fetch("http://localhost:3000/events"),
      fetch("http://localhost:3000/categories"),
    ]);
    if (!eventRes.ok || !categoriesRes) {
      throw new Error("Failed to load data");
    }
    const [events, categories] = await Promise.all([
      eventRes.json(),
      categoriesRes.json(),
    ]);

    return { events, categories };
  } catch (error) {
    console.error("Error fetching data:", error);
    return { events: [], categories: [] };
  }
};

export const EventsPage = () => {
  const { events, categories } = useLoaderData();
  const [eventList, setEventList] = useState(events);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [filteredEvents, setFilteredEvents] = useState(events);
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleSearch = (searchQuery) => {
    setFilteredEvents(
      eventList.filter((event) => {
        const titleMatch = event.title
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        const categoryMatch =
          !selectedCategory || event.categoryIds.includes(selectedCategory);

        return titleMatch && categoryMatch;
      })
    );
  };

  const handleFilter = (categoryId) => {
    setSelectedCategory(categoryId);
    if (!categoryId) {
      setFilteredEvents(eventList);
      return;
    }

    setFilteredEvents(
      eventList.filter((event) => event.categoryIds.includes(categoryId))
    );
  };

  const handleResetFilters = () => {
    setSelectedCategory(""); //
    setFilteredEvents(eventList); //
    document.getElementById("search-input").value = "";
  };

  const handleAddEvent = (newEvent) => {
    setEventList((prevEvents) => [...prevEvents, newEvent]);
  };

  return (
    <Box align="center" px={5}>
      <Flex gap={2} mb={3} justify="center" w="full" wrap="wrap">
        <SearchEvents onSearch={handleSearch} />
        <FilterEvents
          categories={categories}
          selectedCategory={selectedCategory}
          onFilter={handleFilter}
        />
        <Button onClick={onOpen} size="sm" colorScheme="orange">
          Add Event
        </Button>
        <Button onClick={handleResetFilters} size="sm" colorScheme="blackAlpha">
          Reset Filters
        </Button>
      </Flex>
      <ModalForm
        isOpen={isOpen}
        onClose={onClose}
        onAddEvent={handleAddEvent}
      />

      <SimpleGrid columns={[1, 2, 3, 4]} spacing={[4, 6, 8, 10]} align="start">
        {filteredEvents.map((event) => (
          <Link to={`event/${event.id}`} key={event.id}>
            <Card
              variant="elevated"
              borderTopRadius={60}
              w="100%"
              h="full"
              display="flex"
              flexDirection="column"
            >
              <Image
                src={event.image}
                alt={event.title}
                objectFit="cover"
                w="100%"
                h="200px"
                borderTopRadius={50}
              />
              <CardBody
                flex="1"
                display="flex"
                flexDirection="column"
                justifyContent="space-between"
                align="center"
                gap={3}
              >
                <Heading
                  size="lg"
                  color="#DC5F00"
                  textTransform="capitalize"
                  fontFamily="'Meow Script', serif"
                  fontWeight="regular"
                  pb={1}
                  _hover={{
                    transform: "scale(0.75)",
                    color: "gray.500",
                    fontFamily: "serif",
                    textTransform: "capitalize",
                  }}
                  transition="1.0s ease-in-out"
                >
                  {event.title}
                </Heading>
                <Text fontSize="sm" as="i" color="black">
                  {event.description}
                </Text>
                <Divider />
                <Text fontSize="xs">
                  <strong>Starting:</strong>{" "}
                  {new Date(event.startTime).toLocaleString("en-US", {
                    weekday: "short",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                    timeZone: "Europe/Berlin",
                  })}
                </Text>
                <Text fontSize="xs">
                  <strong>Ending:</strong>{" "}
                  {new Date(event.endTime).toLocaleString("en-US", {
                    weekday: "short",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                    timeZone: "Europe/Berlin",
                  })}
                </Text>
              </CardBody>

              <CardFooter justify="center">
                <HStack justify="center" spacing={2} mt={2}>
                  {event.categoryIds?.map((categoryId) => {
                    const category = categories.find(
                      (cat) => cat.id === categoryId
                    );
                    return category ? (
                      <Badge key={categoryId} colorScheme="orange">
                        {category.name}
                      </Badge>
                    ) : null;
                  })}
                </HStack>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </SimpleGrid>
    </Box>
  );
};
