import { Header } from "shared-components/build/components/header/Header";
import { Footer } from "shared-components/build/components/footer/Footer";
import Home from "./components/page/Home/Home";

import { useHistory } from "react-router-dom";

function App() {
  const header = {
    name: "BC Parks",
    history: useHistory(),
  };
  return (
    <main>
      <Header header={header} />
      <Home />
      <Footer />
    </main>
  );
}

export default App;
