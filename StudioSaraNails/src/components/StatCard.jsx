import "../styles/StatCard.css";

export default function StatCard({
	title,
	value,
	icon,
	variant = "stat-pending",
}) {
	return (
		<div className={`stat-card ${variant}`}>
			{icon && <div className="icon">{icon}</div>}
			<div>
				<p className="title">{title}</p>
				<p className="value">{value}</p>
			</div>
		</div>
	);
}
