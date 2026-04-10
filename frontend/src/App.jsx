import { useEffect, useState } from "react";
import api from "./services/api";
import NavBar from "./components/static/NavBar";
import Footer from "./components/static/Footer";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    api.get("/test").then((response) => {
      setMessage(response.data?.message ?? "");
    });
  }, []);

  return (
    <div>
      <NavBar />
      <h1>Test API</h1>
      <p>{message}</p>
      <Footer />
    </div>
  );
}

export default App;
