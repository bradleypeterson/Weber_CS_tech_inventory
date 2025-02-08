import "./App.css";
import { Sidebar } from "./components/Sidebar/Sidebar";
import { Router } from "./navigation/Router";

function App() {
  return (
    <div id="app-layout">
      <Sidebar />
      <Router />
    </div>
  );
}

export default App;
