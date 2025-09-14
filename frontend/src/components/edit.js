import React, { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";

export default function Edit() {
  const [form, setForm] = useState({
    name: "",
    position: "",
    level: "",
  });
  const [isNew, setIsNew] = useState(true);
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      const id = params.id?.toString() || undefined;
      if (!id) return;
      setIsNew(false);

      try {
        const response = await fetch(`${process.env.REACT_APP_API || ""}/api/record/${params.id.toString()}`);
        
        if (!response.ok) {
          const message = `An error has occurred: ${response.statusText}`;
          console.error(message);
          return;
        }

        const record = await response.json();
        if (!record) {
          console.warn(`Record with id ${id} not found`);
          navigate("/");
          return;
        }

        setForm(record);
      } catch (error) {
        console.error("Error fetching record:", error);
      }
    }

    fetchData();
  }, [params.id, navigate]);

  // Update state when form fields change
  function updateForm(jsonObj) {
    return setForm((prev) => {
      return { ...prev, ...jsonObj };
    });
  }

  // Handle form submission
  async function onSubmit(e) {
    e.preventDefault();
    const person = { ...form };

    try {
      let response;
      
      if (isNew) {
        // Create new record
        response = await fetch(`${process.env.REACT_APP_API || ""}/api/record`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(person),
        });
      } else {
        // Update existing record
        response = await fetch(`${process.env.REACT_APP_API || ""}/api/record/${params.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(person),
        });
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Record saved:", result);
      
      // Navigate back to record list
      navigate("/");
    } catch (error) {
      console.error("Error saving record:", error);
      alert("Failed to save record. Please try again.");
    }
  }

  return (
    <Container className="mt-4">
      <Row>
        <Col md={8} lg={6} className="mx-auto">
          <h3>{isNew ? "Create New Record" : "Update Record"}</h3>
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
                {isNew ? "Create Record" : "Update Record"}
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