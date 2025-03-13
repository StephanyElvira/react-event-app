import { useState, useEffect } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import {
  Flex,
  Box,
  Text,
  Button,
  Avatar,
  Image,
  Heading,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  HStack,
  Badge,
  useDisclosure,
  useToast,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
} from "@chakra-ui/react";
import { EditModalForm } from "../components/EditModalForm";

export const loader = async ({ params }) => {
  try {
    const [eventRes, usersRes, categoriesRes] = await Promise.all([
      fetch(
        `https://my-json-server.typicode.com/StephanyElvira/react-event-app/events/${params.eventId}`
      ),
      fetch(
        "https://my-json-server.typicode.com/StephanyElvira/react-event-app/users"
      ),
      fetch(
        "https://my-json-server.typicode.com/StephanyElvira/react-event-app/categories"
      ),
    ]);

    if (!eventRes.ok || !usersRes.ok || !categoriesRes.ok) {
      throw new Error("Failed to fetch data");
    }

    const [event, users, categories] = await Promise.all([
      eventRes.json(),
      usersRes.json(),
      categoriesRes.json(),
    ]);

    const createdByUser =
      users.find((user) => user.id === event.createdBy) || {};
    const createdByName = createdByUser.name || "Unknown";
    const createdByImage = createdByUser.image || null;

    const eventCategories = event.categoryIds
      ? event.categoryIds.map(
          (categoryId) =>
            categories.find((cat) => cat.id === categoryId)?.name || "Unknown"
        )
      : [];

    return { ...event, createdByName, createdByImage, eventCategories };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const EventPage = () => {
  const loadedEvent = useLoaderData();
  const [event, setEvent] = useState(loadedEvent);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();
  const toast = useToast();
  const navigate = useNavigate();
  useEffect(() => {
    {
      window.scrollTo(0, 0);
    }
  }, []);

  const handleEventUpdate = (updatedEvent) => {
    setEvent(updatedEvent);
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:3000/events/${event.id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete event");

      toast({
        title: "Event Deleted",
        description: "The event has been successfully removed.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      navigate("/");
    } catch (err) {
      toast({
        title: "Error",
        description: err.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box minH="75vh" display="flex" justifyContent="center" pb={10} px={5}>
      <Card maxW="2xl" align="center" borderTopRadius={50} variant="elevated">
        <CardHeader
          align="center"
          w="full"
          bg="#DC5F00"
          borderTopRadius={50}
          borderBottom="1px solid black"
        >
          <Heading size="md" textTransform="uppercase" color="white">
            {event.title}
          </Heading>
          <Text>{event.description}</Text>
        </CardHeader>
        <Image
          objectFit="cover"
          w="100%"
          src={event.image}
          alt={event.title}
          borderBottom="1px solid gray"
        />
        <CardBody>
          {event.eventCategories ? (
            <HStack justify="center" spacing={2} mt={2} mb={3}>
              {event.eventCategories.map((category) => (
                <Badge
                  key={category}
                  colorScheme="orange"
                  px={2}
                  py={1}
                  fontSize="sm"
                >
                  {category}
                </Badge>
              ))}
            </HStack>
          ) : null}

          <Text fontSize="sm">
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
          <Text fontSize="sm">
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
          <Text as="i" fontSize="sm">
            {event.location}
          </Text>
          <Flex
            direction={["column", "row"]}
            align="center"
            justify="center"
            w="full"
            gap={3}
            mt={5}
          >
            <Avatar
              size="lg"
              src={event.createdByImage}
              name={event.createdByName}
              align="center"
              border=" 3px solid orange"
            />

            <Text as="sub" color="gray" fontWeight="bold">
              Created By: {event.createdByName}
            </Text>
          </Flex>
        </CardBody>

        <CardFooter
          gap={3}
          justify="space-between"
          flexWrap="wrap"
          sx={{
            "& > button": {
              minW: "136px",
            },
          }}
        >
          <Button flex="1" onClick={onOpen} colorScheme="orange">
            Edit
          </Button>

          <Button flex="1" onClick={onDeleteOpen} colorScheme="blackAlpha">
            Delete
          </Button>
        </CardFooter>
      </Card>

      <EditModalForm
        isOpen={isOpen}
        onClose={onClose}
        eventData={event}
        onEventUpdate={handleEventUpdate}
      />

      <AlertDialog isOpen={isDeleteOpen} onClose={onDeleteClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Event
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure? This action cannot be undone.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button onClick={onDeleteClose}>Cancel</Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};
