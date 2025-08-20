import { createContext, useContext, useEffect, useState } from "react";
import supabase from "../supabaseClient";

const UserContext = createContext();

export function AuthProvider({ children }) {
	const [user, setUser] = useState(null);

	useEffect(() => {
		// Get current session
		const getSession = async () => {
			const { data } = await supabase.auth.getSession();
			setUser(data.session?.user ?? null);
		};
		getSession();

		// Listen for changes
		const { data: listener } = supabase.auth.onAuthStateChange(
			(_event, session) => {
				setUser(session?.user ?? null);
			}
		);

		return () => {
			listener.subscription.unsubscribe();
		};
	}, []);

	const logout = async () => {
		await supabase.auth.signOut();
		setUser(null);
	};

	return (
		<UserContext.Provider value={{ user, logout }}>
			{children}
		</UserContext.Provider>
	);
}

export const useAuth = () => useContext(UserContext);
