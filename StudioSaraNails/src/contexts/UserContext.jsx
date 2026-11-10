import { createContext, useContext, useEffect, useState } from "react";
import supabase from "../supabaseClient";

const UserContext = createContext();

export function AuthProvider({ children }) {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const isAdmin = user?.app_metadata?.role === "admin";

	useEffect(() => {
		let mounted = true;

		const getSession = async () => {
			const { data, error } = await supabase.auth.getSession();
			if (!mounted) return;
			if (!error) setUser(data.session?.user ?? null);
			setLoading(false);
		};

		getSession();

		const { data: listener } = supabase.auth.onAuthStateChange(
			(_event, session) => {
				setUser(session?.user ?? null);
				setLoading(false);
			}
		);

		return () => {
			mounted = false;
			listener.subscription.unsubscribe();
		};
	}, []);

	const logout = async () => {
		await supabase.auth.signOut();
		setUser(null);
	};

	return (
		<UserContext.Provider value={{ user, isAdmin, loading, logout }}>
			{children}
		</UserContext.Provider>
	);
}

export const useAuth = () => useContext(UserContext);
