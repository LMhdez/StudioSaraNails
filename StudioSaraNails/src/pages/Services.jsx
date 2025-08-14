// src/pages/ServicesPage.jsx
import { useServices } from "../contexts/ServicesContext";
import TopBar from "../components/TopBar";
import ServiceCard from "../components/ServiceCard";
import WaveDivider from "../components/WaveDivider";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import "../styles/Services.css";

export default function ServicesPage() {
	const navigate = useNavigate();
	const { i18n } = useTranslation();
	const servicesObject = useServices();

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
