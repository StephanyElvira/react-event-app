import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Textarea,
  Button,
  useToast,
  VStack,
  Select,
} from "@chakra-ui/react";

export const ModalForm = ({ isOpen, onClose, onAddEvent }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    startTime: "",
    endTime: "",
    location: "",
    createdBy: "",
    categoryIds: [],
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const toast = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, usersRes] = await Promise.all([
          fetch("http://localhost:3000/categories"),
          fetch("http://localhost:3000/users"),
        ]);

        if (!categoriesRes.ok || !usersRes.ok)
          throw new Error("Failed to load data");

        const [categoriesData, usersData] = await Promise.all([
          categoriesRes.json(),
          usersRes.json(),
        ]);

        setCategories(categoriesData);
        setUsers(usersData);
      } catch (error) {
        toast({
          title: "Error",
          description: error.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    };

    if (isOpen) fetchData();
  }, [isOpen, toast]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "createdBy" ? Number(value) : value,
    }));
  };

  const handleCategoryChange = (categoryId) => {
    setFormData((prev) => {
      const updatedCategories = prev.categoryIds.includes(categoryId)
        ? prev.categoryIds.filter((id) => id !== categoryId)
        : [...prev.categoryIds, categoryId];

      return { ...prev, categoryIds: updatedCategories };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          createdBy: formData.createdBy || [],
          categoryIds: formData.categoryIds || [],
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add event");
      }

      const newEvent = await response.json();
      onAddEvent(newEvent);
      toast({
        title: "Event added.",
        description: "Your event has been successfully added.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setFormData({
        title: "",
        description: "",
        image: "",
        startTime: "",
        endTime: "",
        categories: "",
      });
      onClose();
    } catch (err) {
      toast({
        title: "Error",
        description: err.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="5xl"
      scrollBehavior="outside"
    >
      <ModalOverlay
        bg="blackAlpha.300"
        backdropFilter="blur(10px) hue-rotate(90deg)"
      />
      <ModalContent>
        <ModalHeader>Add a New Event</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit}>
          <ModalBody>
            <FormControl isRequired>
              <FormLabel>Title</FormLabel>
              <Input
                name="title"
                value={formData.title}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl isRequired mt={4}>
              <FormLabel>Description</FormLabel>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl isRequired mt={4}>
              <FormLabel>Image URL</FormLabel>
              <Input
                name="image"
                value={formData.image}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl isRequired mt={4}>
              <FormLabel>Location</FormLabel>
              <Input
                name="location"
                value={formData.location}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl isRequired mt={4}>
              <FormLabel>Start Time</FormLabel>
              <Input
                name="startTime"
                type="datetime-local"
                value={formData.startTime}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl isRequired mt={4}>
              <FormLabel>End Time</FormLabel>
              <Input
                name="endTime"
                type="datetime-local"
                value={formData.endTime}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl isRequired mt={4}>
              <FormLabel>Created By</FormLabel>
              <Select
                name="createdBy"
                value={formData.createdBy}
                onChange={handleChange}
                placeholder="Select Creator"
              >
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Categories</FormLabel>
              <VStack align="start" spacing={2}>
                {categories.map((category) => (
                  <Checkbox
                    key={category.id}
                    isChecked={formData.categoryIds?.includes(category.id)}
                    onChange={() => handleCategoryChange(category.id)}
                  >
                    {category.name}
                  </Checkbox>
                ))}
              </VStack>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="teal" type="submit" isLoading={loading}>
              Add Event
            </Button>
            <Button variant="ghost" ml={3} onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};
