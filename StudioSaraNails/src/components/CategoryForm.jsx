import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import supabase from "../supabaseClient";

export default function CategoryForm({ onClose, onSubmit }) {
	const { t } = useTranslation();
	const modalRef = useRef(null);
	const [loading, setLoading] = useState(false);

	const schema = yup.object({
		name_es: yup.string().required(t("categories.nameRequired")),
		name_en: yup.string().required(t("categories.nameRequired")),
	});

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm({ resolver: yupResolver(schema) });

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

	const submitCategory = async (data) => {
		setLoading(true);
		try {
			// Don't insert here! Just call the parent
			await onSubmit(data); // parent will handle insertion
			reset();
			onClose();
		} catch (err) {
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	if (loading) return <p>{t("loading")}</p>;

	return (
		<div className="modal-overlay">
			<div ref={modalRef} className="modal-container">
				<div className="modal-header">
					<button onClick={onClose} className="modal-close-button">
						x
					</button>
				</div>

				<form
					onSubmit={handleSubmit(submitCategory)}
					className="form-container"
				>
					<h2 className="form-title">
						{t("categories.createTitle")}
					</h2>
					<div>
						<label className="label">
							{t("categories.nameEs")}
						</label>
						<input {...register("name_es")} className="input" />
						{errors.name_es && (
							<p className="error-message">
								{errors.name_es.message}
							</p>
						)}
					</div>

					<div>
						<label className="label">
							{t("categories.nameEn")}
						</label>
						<input {...register("name_en")} className="input" />
						{errors.name_en && (
							<p className="error-message">
								{errors.name_en.message}
							</p>
						)}
					</div>

					<div className="button-group">
						<button
							type="button"
							onClick={onClose}
							className="button-cancel"
						>
							{t("form.buttons.cancel")}
						</button>
						<button type="submit" className="button-submit">
							{t("form.buttons.create")}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
