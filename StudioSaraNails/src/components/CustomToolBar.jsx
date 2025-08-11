import moment from "moment";

function CustomToolbar({ label, onNavigate, date }) {
	const today = moment().startOf("day");
	const currentDate = moment(date).startOf("day");

	const isBackDisabled = currentDate.isSame(today);

	return (
		<div className="rbc-toolbar">
			<div className="rbc-btn-group">
				<button
					onClick={() => onNavigate("PREV")}
					disabled={isBackDisabled}
					className="rbc-btn"
				>
					{"<"}
				</button>
				<button onClick={() => onNavigate("TODAY")} className="rbc-btn">
					Today
				</button>
				<button onClick={() => onNavigate("NEXT")} className="rbc-btn">
					{">"}
				</button>
			</div>
			<span className="rbc-toolbar-label">{label}</span>
		</div>
	);
}

export default CustomToolbar;
