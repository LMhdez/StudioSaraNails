import "../styles/ServiceCard.css";

export default function ServiceCard({
	imageUrl,
	title,
	description,
	tagText,
	onClick,
}) {
	return (
		<div className="service-card" onClick={onClick}>
			<div className="service-card-image">
				<img src={imageUrl} alt={title} className="service-card-img" />
			</div>
			<div className="service-card-content">
				<p className="service-card-title">{title}</p>
				<p className="service-card-description">{description}</p>
			</div>
			<div className="service-card-tag">{tagText}</div>
		</div>
	);
}
