import Flower from "../assets/flower.png";
export default function HomeTitle({ title, lastWord }) {
	return (
		<>
			<div className="flowers-container">
				<img src={Flower} alt="" />
				<img src={Flower} alt="" />
			</div>
			<h2>
				{title} <span className="last-word">{lastWord}</span>
			</h2>
		</>
	);
}
