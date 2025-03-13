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
  Textarea,
  Button,
  useToast,
  Checkbox,
  CheckboxGroup,
  VStack,
  Select,
} from "@chakra-ui/react";

import { useState, useEffect } from "react";

export const EditModalForm = ({
  isOpen,
  onClose,
  eventData,
  onEventUpdate,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    startTime: "",
    endTime: "",
    categoryIds: [],
    createdBy: "",
  });
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
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

  useEffect(() => {
    if (eventData) {
      setFormData(eventData);
    }
  }, [eventData]);

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
      const response = await fetch(
        `http://localhost:3000/events/${eventData.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: formData.title,
            description: formData.description,
            image: formData.image,
            startTime: formData.startTime,
            endTime: formData.endTime,
            categoryIds: formData.categoryIds || [],
            createdBy: formData.createdBy,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to update vent");

      const updatedEvent = await response.json();
      onEventUpdate(updatedEvent);
      toast({
        title: "Event Updated",
        description: "Your event has been successfully updated.",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
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
      size="3xl"
      scrollBehavior="outside"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Event</ModalHeader>
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
              <FormLabel>Change Creator</FormLabel>
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
              <CheckboxGroup colorScheme="teal">
                <VStack align="start">
                  {categories.map((category) => (
                    <Checkbox
                      key={category.id}
                      isChecked={formData.categoryIds.includes(category.id)}
                      onChange={() => handleCategoryChange(category.id)}
                    >
                      {category.name}
                    </Checkbox>
                  ))}
                </VStack>
              </CheckboxGroup>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" type="submit" isLoading={loading}>
              Save Changes
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
