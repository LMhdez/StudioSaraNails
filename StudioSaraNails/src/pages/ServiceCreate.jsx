import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../supabaseClient";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import ServiceForm from "../components/ServiceForm";
import TopBar from "../components/TopBar";
import WaveDivider from "../components/WaveDivider";
import "../styles/ServiceEdit.css";

export default function ServiceCreate() {
	const navigate = useNavigate();
	const { t, i18n } = useTranslation();
	const [categories, setCategories] = useState([]);
	const [saving, setSaving] = useState(false);

	// Fetch categories
	useEffect(() => {
		const fetchCategories = async () => {
			const { data, error } = await supabase
				.from("service_categories")
				.select("id, name_es, name_en");
			if (error) console.error(error);
			else setCategories(data || []);
		};
		fetchCategories();
	}, []);

	const handleSubmit = async ({
		selectedCategory,
		selectedFile,
		...formData
	}) => {
		if (!selectedCategory) {
			toast.error(t("services.categoryRequired"));
			return;
		}

		setSaving(true);

		let image_url = "";
		if (selectedFile) {
			try {
				const category = categories.find(
					(c) => c.id === selectedCategory
				);
				const slug = category.name_en
					.toLowerCase()
					.replace(/\s+/g, "_");
				const fileExt = selectedFile.name.split(".").pop();
				const fileName = `${Date.now()}.${fileExt}`;
				const filePath = `services_${slug}/${fileName}`;

				const { error: uploadError } = await supabase.storage
					.from("images")
					.upload(filePath, selectedFile, {
						cacheControl: "3600",
						upsert: false,
					});
				if (uploadError) throw uploadError;

				const { data, error: urlError } = supabase.storage
					.from("images")
					.getPublicUrl(filePath);
				if (urlError) throw urlError;

				image_url = data.publicUrl;
			} catch (err) {
				console.error(err);
				toast.error(t("services.uploadError"));
				setSaving(false);
				return;
			}
		}

		const payload = {
			...formData,
			category_id: selectedCategory,
			image_url,
		};

		const { error } = await supabase.from("services").insert([payload]);
		setSaving(false);

		if (error) {
			toast.error(t("services.createError"));
			console.error(error);
		} else {
			toast.success(t("services.createSuccess"));
			navigate("/services");
		}
	};

	return (
		<>
			<TopBar />
			<div className="service-edit-page">
				<h2 className="form-title">{t("services.createTitle")}</h2>
				<ServiceForm
					categories={categories}
					onSubmit={handleSubmit}
					saving={saving}
					t={t}
					i18n={i18n}
				/>
				<WaveDivider />
			</div>
		</>
	);
}
