import { createContext, useContext, useEffect, useState } from "react";
import supabase from "../supabaseClient";

const UserContext = createContext();

export function AuthProvider({ children }) {
	const [user, setUser] = useState(null);
	const isAdmin = user?.app_metadata?.role === "admin";

	useEffect(() => {
		let mounted = true;

		const getSession = async () => {
			const { data, error } = await supabase.auth.getSession();
			if (!error && mounted) setUser(data.session?.user ?? null);
		};

		getSession();

		const { data: listener } = supabase.auth.onAuthStateChange(
			(_event, session) => {
				setUser(session?.user ?? null);
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
		<UserContext.Provider value={{ user, isAdmin, logout }}>
			{children}
		</UserContext.Provider>
	);
}

export const useAuth = () => useContext(UserContext);
