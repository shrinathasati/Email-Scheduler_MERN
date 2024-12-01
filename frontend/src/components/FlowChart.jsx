import ReactFlow, {
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
} from "reactflow";
import axios from "axios";
import Modal from "react-modal";
import "reactflow/dist/style.css";
import { useState, useCallback, useEffect } from "react";
import './FlowChart.css';
// Set the root element for the modal
Modal.setAppElement("#root");

// Custom styles for the modal
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "90%", // Responsive width
    maxWidth: "600px", // Max width for larger screens
    height: "auto", // Adjust height based on content
    maxHeight: "80vh", // Limit height to 80% of viewport
    overflowX: "hidden", // Prevent horizontal scrolling
    overflowY: "auto", // Allow vertical scrolling if needed
    padding: "20px", // Padding for spacing inside the modal
    borderRadius: "8px", // Rounded corners
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Shadow for depth effect
    backgroundColor: "#fff", // White background
    display: "flex",
    flexDirection: "column",
    gap: "1rem", // Space between form elements
  },
  
  // Styles for form elements
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem", // Adds space between form elements
  },
  
  label: {
    fontSize: "1rem",
    fontWeight: "500",
    marginBottom: "0.5rem", // Space between label and input
  },

  input: {
    padding: "0.75rem", // Adds padding inside input fields
    borderRadius: "8px", // Rounded corners
    border: "1px solid #ccc", // Light border color
    fontSize: "1rem", // Font size for input text
    transition: "border-color 0.3s ease", // Smooth transition for focus effect
  },
  
  inputFocus: {
    outline: "none", // Removes default outline
    borderColor: "#007bff", // Highlight border color on focus
    boxShadow: "0 0 5px rgba(0, 123, 255, 0.5)", // Focus shadow for emphasis
  },

  button: {
    padding: "0.75rem 1.5rem",
    backgroundColor: "#007bff", // Button background color
    color: "white", // White text color
    border: "none",
    borderRadius: "8px", // Rounded corners for buttons
    fontSize: "1rem",
    cursor: "pointer",
    transition: "background-color 0.3s ease", // Smooth color transition on hover
  },

  buttonHover: {
    backgroundColor: "#0056b3", // Darker blue on hover
  }
};

const FlowChart = () => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [nodeCount, setNodeCount] = useState(1);
  const [selectedNodeType, setSelectedNodeType] = useState("Lead-Source");
  const [modalIsOpen, setIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [editingNode, setEditingNode] = useState(null);

  // Callback to handle node changes
  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  // Callback to handle edge changes
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  // Function to add a new node and connect it to the previous node
  const addNode = (label, content) => {
    const newNodeId = (nodeCount + 1).toString();
    const newNode = {
      id: newNodeId,
      data: { label: `${label}\n${content}` },
      position: { x: 100, y: nodeCount * 100 },
    };
    setNodes((nds) => nds.concat(newNode));
    setNodeCount((count) => count + 1);

    const newEdge = {
      id: `${nodeCount}-${newNodeId}`,
      source: `${nodeCount}`,
      target: newNodeId,
    };
    setEdges((eds) => eds.concat(newEdge));
  };

  // Handle the addition of a new node
  const handleAddNode = () => {
    if (selectedNodeType) {
      setModalContent(selectedNodeType);
      setIsOpen(true);
      setEditingNode(null);
    } else {
      alert("Please select a valid node type.");
    }
  };

  // Handle form submission for adding/updating nodes
  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const subject = formData.get("subject");
    const text = formData.get("content");
    const delay = formData.get("delay");
    const email = formData.get("email");
    let nodeContent = "";

    if (modalContent === "Cold-Email") {
      nodeContent = `- (${subject}) ${text}`;
    } else if (modalContent === "Wait/Delay") {
      nodeContent = `- (${delay})`;
    } else {
      nodeContent = `- (${email})`;
    }

    // Update the existing node if editing, otherwise add a new node
    if (editingNode) {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === editingNode.id
            ? { ...node, data: { label: `${modalContent}\n${nodeContent}` } }
            : node
        )
      );
    } else {
      if (selectedNodeType === "Lead-Source") {
        setSelectedNodeType("Cold-Email");
      }
      addNode(modalContent, nodeContent);
    }
    setIsOpen(false);
  };

  // Render the modal content based on the selected node type
  const renderModalContent = () => {
    switch (modalContent) {
      case "Cold-Email":
        return (
          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <label htmlFor="subject">Subject:</label>
            <input
              type="text"
              name="subject"
              id="subject"
              defaultValue={editingNode?.data.label.split("- (")[1]?.split(")")[0] || ""}
              required
              className="border border-black rounded-md p-1"
            />
            <label htmlFor="content">Content:</label>
            <input
              type="text"
              name="content"
              id="content"
              defaultValue={editingNode?.data.label.split(") ")[1] || ""}
              required
              className="border border-black rounded-md p-1"
            />
            <button type="submit" className="mt-2">
              {editingNode ? "Update Cold Email" : "Add Cold Email"}
            </button>
          </form>
        );
      case "Wait/Delay":
        return (
          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <label htmlFor="delay">Delay:</label>
            <select
              name="delay"
              id="delay"
              defaultValue={
                editingNode?.data.label.split("- (")[1]?.split(" min")[0] + " min" || ""
              }
              required
            >
              {[...Array(6).keys()].map((i) => (
                <option key={i} value={`${i + 1} min`}>
                  {i + 1} min
                </option>
              ))}
            </select>
            <button type="submit" className="mt-2">
              {editingNode ? "Update Delay" : "Add Delay"}
            </button>
          </form>
        );
      case "Lead-Source":
        return (
          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <label htmlFor="email">Recipient Email:</label>
            <input
              name="email"
              id="email"
              defaultValue={editingNode?.data.label.split("- (")[1]?.split(")")[0] || ""}
              required
              className="border border-black rounded-md p-1"
            />
            <button type="submit" className="mt-2">
              {editingNode ? "Update Lead Source" : "Add Lead Source"}
            </button>
          </form>
        );
      default:
        return null;
    }
  };

  // Handle node click to open modal for editing
  const handleNodeClick = (event, node) => {
    setModalContent(node.data.label.split("\n")[0]);
    setIsOpen(true);
    setEditingNode(node);
  };

  // Handle the process start
  const handleStartProcess = async () => {
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/api/sequence/start-process`,
      {
        nodes,
        edges,
      },
      { withCredentials: true }
    );
    if (response.status === 200) {
      alert("Process started successfully");
    } else {
      alert("Error starting process");
    }
  };

  // Add the initial lead-source node on component mount
  useEffect(() => {
    handleAddNode();
  }, []);

  return (
    <div className="w-full h-full mt-4">
      <div style={{ height: '500px' , width: "1000px"}}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={handleNodeClick}
          className="rounded-md bg-[#3C5B6F]"
        >
          <Controls />
          <Background />
        </ReactFlow>
      </div>
      <div className="w-full flex items-center justify-center gap-4 mt-4">
        <select
          value={selectedNodeType}
          onChange={(e) => setSelectedNodeType(e.target.value)}
        >
          <option value="Cold-Email">Cold Email</option>
          <option value="Wait/Delay">Wait/Delay</option>
        </select>
        <button onClick={handleAddNode}>Add Node</button>
        <button onClick={handleStartProcess}>Start Process</button>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setIsOpen(false)}
        style={customStyles}
      >
        {renderModalContent()}
      </Modal>
    </div>
  );
};

export default FlowChart;
