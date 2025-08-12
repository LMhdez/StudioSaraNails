import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Schedule from "./pages/Schedule";
import { Toaster } from "react-hot-toast";

function App() {
	return (
		<>
		<Router>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/schedule" element={<Schedule />} />
			</Routes>
		</Router>
		<Toaster/>
		</>
	);
}

export default App;
