import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Schedule from "./pages/Schedule";
import Services from "./pages/Services";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ServicesProvider } from "./contexts/ServicesContext";
import { useTranslation } from "react-i18next";
import Contact from "./pages/Contact";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import AdminHome from "./pages/AdminHome";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import { AuthProvider } from "./contexts/UserContext";
import ServiceEdit from "./pages/ServiceEdit";
import ServiceCreate from "./pages/ServiceCreate";

const queryClient = new QueryClient();

function App() {
	const { i18n } = useTranslation();

	return (
		<QueryClientProvider client={queryClient}>
			<AuthProvider>
				<ServicesProvider language={i18n.language}>
					<Router>
						<Routes>
							<Route path="/" element={<Home />} />
							<Route path="/schedule" element={<Schedule />} />
							<Route path="/services" element={<Services />} />
							<Route path="/contact" element={<Contact />} />
							<Route path="/login" element={<Login />} />
							<Route
								path="/admin"
								element={
									<ProtectedRoute>
										<AdminHome />
									</ProtectedRoute>
								}
							/>
							<Route
								path="/forgot-password"
								element={<ForgotPassword />}
							/>
							<Route
								path="/reset-password"
								element={<ResetPassword />}
							/>
							<Route
								path="/services/:id"
								element={<ServiceEdit />}
							/>
							<Route
								path="/services/new"
								element={<ServiceCreate />}
							/>
						</Routes>
					</Router>
					<Toaster />
				</ServicesProvider>
			</AuthProvider>
		</QueryClientProvider>
	);
}

export default App;
