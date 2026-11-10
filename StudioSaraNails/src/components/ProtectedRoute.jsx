import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/UserContext";

export default function ProtectedRoute({ children }) {
	const { user, loading } = useAuth();

	if (loading) return <p className="text-center mt-10">...</p>;
	if (!user) return <Navigate to="/login" replace />;
	if (user.app_metadata?.role !== "admin") {
		return <Navigate to="/" replace />;
	}

	return children;
}
