import { BrowserRouter } from "react-router";
import "./App.css";
import { Sidebar } from "./components/Sidebar/Sidebar";
import { Router } from "./navigation/Router";

function App() {
  return (
    <BrowserRouter>
      <div id="app-layout">
        <Sidebar />
        <Router />
      </div>
    </BrowserRouter>
  );
}

export default App;
