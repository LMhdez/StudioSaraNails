import TopBar from "../components/TopBar";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "../i18n";
import "../styles/Services.css";

import WaveDivider from "../components/WaveDivider";

import ServiceCard from "../components/ServiceCard";
import supabase from "../supabaseClient";
import { Navigate, useNavigate } from "react-router-dom";

export default function ServicesPage() {
	const navigate = useNavigate();
	const { t, i18n } = useTranslation();
	const [servicesObject, setServicesObject] = useState([]);

	useEffect(() => {
		const fetchServices = async () => {
			const { data, error } = await supabase
				.from("service_categories")
				.select(
					`
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
				`
				)
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
	}, [i18n.language]);

	return (
		<>
			<TopBar />
			<div className="services-page">
				{servicesObject.map((cat) => (
					<div key={cat.id} className="category-section">
						<h2>
							{i18n.language === "es" ? cat.name_es : cat.name_en}
						</h2>
						<div className="services-line">
							{cat.services.map((srv) => (
								<ServiceCard
									key={srv.id}
									imageUrl={srv.image_url}
									title={
										i18n.language === "es"
											? srv.title_es
											: srv.title_en
									}
									description={
										i18n.language === "es"
											? srv.description_es
											: srv.description_en
									}
									tagText={`$${srv.price.toFixed(2)}`}
									onClick={() => navigate(`/schedule`)}
								/>
							))}
						</div>
					</div>
				))}
				<WaveDivider />
			</div>
		</>
	);
}
