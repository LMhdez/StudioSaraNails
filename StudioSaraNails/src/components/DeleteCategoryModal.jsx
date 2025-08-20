import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import TrashIcon from "../assets/TrashIcon.jsx";

export default function DeleteCategoryModal({ categoryName, onClose, onConfirm }) {
	const { t } = useTranslation();
	const modalRef = useRef(null);

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (modalRef.current && !modalRef.current.contains(event.target)) {
				onClose();
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () =>
			document.removeEventListener("mousedown", handleClickOutside);
	}, [onClose]);

	return (
		<div className="modal-overlay">
			<div ref={modalRef} className="modal-container">
				<div className="modal-header">
					<button onClick={onClose} className="modal-close-button">
						x
					</button>
				</div>
				<p>{t("categories.deleteConfirm", { categoryName })}</p>
				<div className="button-group">
					<button onClick={onClose} className="button-cancel">
						{t("form.buttons.cancel")}
					</button>
					<button onClick={onConfirm} className="button-submit ">
						<TrashIcon /> {t("form.buttons.delete")}
					</button>
				</div>
			</div>
		</div>
	);
}
