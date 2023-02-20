import "primereact/resources/primereact.css";
import "primeflex/primeflex.css";
import "./assets/demo/flags/flags.css";
import "./assets/demo/Demos.scss";
import "./assets/layout/layout.scss";

import { MainTable } from "./components/MainTable";

function App() {
  return (
    <div className="App">
      <MainTable/>
    </div>
  );
}

export default App;
