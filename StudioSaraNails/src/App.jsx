import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Schedule from "./pages/Schedule";
import { Toaster } from "react-hot-toast";
import Services from "./pages/Services";

function App() {
	return (
		<>
		<Router>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/schedule" element={<Schedule />} />
				<Route path="/services" element={<Services />} />
			</Routes>
		</Router>
		<Toaster/>
		</>
	);
}

export default App;
