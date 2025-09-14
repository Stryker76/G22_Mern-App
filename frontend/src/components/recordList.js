import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Table, Button, Container, Alert, Spinner } from "react-bootstrap";

const Record = (props) => (
  <tr>
    <td>{props.record.name}</td>
    <td>{props.record.position}</td>
    <td>{props.record.level}</td>
    <td>
      <Link className="btn btn-link" to={`/edit/${props.record._id}`}>Edit</Link> |{" "}
      <Button
        className="btn btn-link"
        variant="danger"
        size="sm"
        onClick={() => {
          props.deleteRecord(props.record._id);
        }}
      >
        Delete
      </Button>
    </td>
  </tr>
);

export default function RecordList() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch records from the database
  useEffect(() => {
    async function getRecords() {
      try {
        const response = await fetch(`${process.env.REACT_APP_API || ""}/api/record/`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const records = await response.json();
        setRecords(records);
      } catch (error) {
        console.error("Error fetching records:", error);
        setError("Failed to load records. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    getRecords();
  }, []);

  // Delete a record
  async function deleteRecord(id) {
    if (!window.confirm("Are you sure you want to delete this record?")) {
      return;
    }

    try {
      await fetch(`${process.env.REACT_APP_API || ""}/api/record/${id}`, {
        method: "DELETE",
      });

      const newRecords = records.filter((el) => el._id !== id);
      setRecords(newRecords);
    } catch (error) {
      console.error("Error deleting record:", error);
      alert("Failed to delete record. Please try again.");
    }
  }

  // Map out the records on the table
  function recordList() {
    return records.map((record) => {
      return (
        <Record
          record={record}
          deleteRecord={() => deleteRecord(record._id)}
          key={record._id}
        />
      );
    });
  }

  if (loading) {
    return (
      <Container className="mt-4">
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-2">Loading records...</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Record List</h3>
        <Link className="btn btn-primary" to="/create">
          Create New Record
        </Link>
      </div>
      
      {records.length === 0 ? (
        <Alert variant="info">
          No records found. <Link to="/create">Create your first record</Link>.
        </Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Name</th>
              <th>Position</th>
              <th>Level</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>{recordList()}</tbody>
        </Table>
      )}
    </Container>
  );
}