// src/contexts/ServicesContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import supabase from "../supabaseClient";
import { useAuth } from "./UserContext";

const ServicesContext = createContext([]);

export const useServices = () => useContext(ServicesContext);

export function ServicesProvider({ children, language }) {
	const [servicesObject, setServicesObject] = useState([]);
	const { user } = useAuth();

	useEffect(() => {
		let channel;

		const fetchServices = async () => {
			let query = supabase
				.from("service_categories")
				.select(
					`
          id,
          name_es,
          name_en,
          active,
          services (
            id,
            title_es,
            title_en,
            description_es,
            description_en,
            price,
            image_url
          )
        `
				)
				.order("id", { ascending: true });

			// If no user, only fetch active categories
			if (!user) {
				query = query.eq("active", true);
			}

			const { data, error } = await query;

			if (error) {
				console.error("Error fetching services:", error);
				return;
			}

			setServicesObject(data || []);
		};

		fetchServices();

		// Realtime subscription
		channel = supabase
			.channel("services-changes")
			.on(
				"postgres_changes",
				{ event: "*", schema: "public", table: "service_categories" },
				() => fetchServices()
			)
			.on(
				"postgres_changes",
				{ event: "*", schema: "public", table: "services" },
				() => fetchServices()
			)
			.subscribe();

		return () => {
			if (channel) supabase.removeChannel(channel);
		};
	}, [language, user]);

	return (
		<ServicesContext.Provider value={servicesObject}>
			{children}
		</ServicesContext.Provider>
	);
}
