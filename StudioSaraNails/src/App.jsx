import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Schedule from "./pages/Schedule";
import Services from "./pages/Services";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ServicesProvider } from "./contexts/ServicesContext";
import { EventsProvider } from "./contexts/EventsContext"; // <-- lo que hicimos antes
import { useTranslation } from "react-i18next";

const queryClient = new QueryClient();

function App() {
	const { i18n } = useTranslation();

	return (
		<QueryClientProvider client={queryClient}>
			<ServicesProvider language={i18n.language}>
				<EventsProvider role="client">
					<Router>
						<Routes>
							<Route path="/" element={<Home />} />
							<Route path="/schedule" element={<Schedule />} />
							<Route path="/services" element={<Services />} />
						</Routes>
					</Router>
					<Toaster />
				</EventsProvider>
			</ServicesProvider>
		</QueryClientProvider>
	);
}

export default App;
