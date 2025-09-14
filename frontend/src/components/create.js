import React, { useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function Create() {
  const [form, setForm] = useState({
    name: "",
    position: "",
    level: "",
  });
  const navigate = useNavigate();

  // Update state when form fields change
  function updateForm(jsonObj) {
    return setForm((prev) => {
      return { ...prev, ...jsonObj };
    });
  }

  // Handle form submission
  async function onSubmit(e) {
    e.preventDefault();
    
    // Create a new person object
    const person = { ...form };

    try {
      const response = await fetch(`${process.env.REACT_APP_API || ""}/api/record`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(person),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Record created:", result);
      
      // Clear form
      setForm({ name: "", position: "", level: "" });
      
      // Navigate back to record list
      navigate("/");
    } catch (error) {
      console.error("Error creating record:", error);
      alert("Failed to create record. Please try again.");
    }
  }

  return (
    <Container className="mt-4">
      <Row>
        <Col md={8} lg={6} className="mx-auto">
          <h3>Create New Record</h3>
          <Form onSubmit={onSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                value={form.name}
                onChange={(e) => updateForm({ name: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Position</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter position"
                value={form.position}
                onChange={(e) => updateForm({ position: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Level</Form.Label>
              <Form.Select
                value={form.level}
                onChange={(e) => updateForm({ level: e.target.value })}
                required
              >
                <option value="">Select a level</option>
                <option value="Intern">Intern</option>
                <option value="Junior">Junior</option>
                <option value="Senior">Senior</option>
                <option value="Lead">Lead</option>
                <option value="Manager">Manager</option>
              </Form.Select>
            </Form.Group>

            <div className="d-flex gap-2">
              <Button variant="primary" type="submit">
                Create Record
              </Button>
              <Button variant="secondary" onClick={() => navigate("/")}>
                Cancel
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}