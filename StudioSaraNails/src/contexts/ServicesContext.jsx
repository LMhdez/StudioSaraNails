// src/contexts/ServicesContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import supabase from "../supabaseClient";

const ServicesContext = createContext([]);

export const useServices = () => useContext(ServicesContext);

export function ServicesProvider({ children, language }) {
  const [servicesObject, setServicesObject] = useState([]);

  useEffect(() => {
    let channel;

    const fetchServices = async () => {
      const { data, error } = await supabase
        .from("service_categories")
        .select(`
          id,
          name_es,
          name_en,
          services (
            id,
            title_es,
            title_en,
            description_es,
            description_en,
            price,
            image_url
          )
        `)
        .eq("active", true);

      if (error) {
        console.error("Error fetching services:", error);
        return;
      }

      const sortedData = (data || []).map((cat) => ({
        ...cat,
        services: cat.services.sort((a, b) => a.id - b.id),
      }));

      setServicesObject(sortedData);
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
  }, [language]);

  return (
    <ServicesContext.Provider value={servicesObject}>
      {children}
    </ServicesContext.Provider>
  );
}
