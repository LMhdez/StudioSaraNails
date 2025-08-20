import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import supabase from "../supabaseClient";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import ServiceForm from "../components/ServiceForm";
import TopBar from "../components/TopBar";
import WaveDivider from "../components/WaveDivider";
import "../styles/ServiceEdit.css";

export default function ServiceEdit() {
	const { id } = useParams();
	const navigate = useNavigate();
	const { t, i18n } = useTranslation();

	const [loading, setLoading] = useState(true);
	const [categories, setCategories] = useState([]);
	const [defaultValues, setDefaultValues] = useState({});
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

	// Fetch service by ID
	useEffect(() => {
		const fetchService = async () => {
			setLoading(true);
			const { data, error } = await supabase
				.from("services")
				.select("*")
				.eq("id", id)
				.single();

			if (error) {
				toast.error(t("services.loadError"));
				console.error(error);
			} else {
				setDefaultValues(data);
			}
			setLoading(false);
		};
		fetchService();
	}, [id, t]);

	const handleSubmit = async ({
		selectedCategory,
		selectedFile,
		...formData
	}) => {
		setSaving(true);

		let image_url = defaultValues.image_url || "";

		try {
			// 1. Handle new file upload
			if (selectedFile) {
				const category = categories.find(
					(c) => c.id === selectedCategory
				);
				if (!category) throw new Error("Category not found");

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

				const { data: publicData } = supabase.storage
					.from("images")
					.getPublicUrl(filePath);
				image_url = publicData.publicUrl;

				// Delete old image if exists
				if (defaultValues.image_url) {
					const oldPath = new URL(
						defaultValues.image_url
					).pathname.replace("/storage/v1/object/public/images/", "");
					await supabase.storage.from("images").remove([oldPath]);
				}
			}

			// 2. Move existing image if category changed
			else if (
				defaultValues.image_url &&
				selectedCategory !== defaultValues.category_id
			) {
				const oldUrl = defaultValues.image_url;
				const oldPath = new URL(oldUrl).pathname.replace(
					"/storage/v1/object/public/images/",
					""
				);

				const category = categories.find(
					(c) => c.id === selectedCategory
				);
				if (!category) throw new Error("Category not found");

				const slug = category.name_en
					.toLowerCase()
					.replace(/\s+/g, "_");
				const fileExt = oldPath.split(".").pop();
				const newFileName = `${Date.now()}.${fileExt}`;
				const newPath = `services_${slug}/${newFileName}`;

				// Download old image as blob
				const res = await fetch(oldUrl);
				const blob = await res.blob();

				// Upload to new folder
				const { error: uploadError } = await supabase.storage
					.from("images")
					.upload(newPath, blob, {
						cacheControl: "3600",
						upsert: false,
					});
				if (uploadError) throw uploadError;

				const { data: publicData } = supabase.storage
					.from("images")
					.getPublicUrl(newPath);
				image_url = publicData.publicUrl;

				// Delete old image
				const { error: deleteError } = await supabase.storage
					.from("images")
					.remove([oldPath]);
				if (deleteError)
					console.error("Failed to delete old image:", deleteError);
			}

			// 3. Update service record
			const payload = {
				...formData,
				category_id: selectedCategory,
				image_url,
			};

			const { error } = await supabase
				.from("services")
				.update(payload)
				.eq("id", id);
			if (error) throw error;

			toast.success(t("services.updateSuccess"));
			navigate("/services");
		} catch (error) {
			console.error(error);
			toast.error(t("services.updateError"));
		} finally {
			setSaving(false);
		}
	};

	const handleDelete = async () => {
		const confirm = window.confirm(t("services.deleteConfirm"));
		if (!confirm) return;

		setSaving(true);

		try {
			// First, delete the image from storage if it exists
			if (defaultValues.image_url) {
				// Extract the file path from the public URL
				const url = new URL(defaultValues.image_url);
				const filePath = url.pathname.replace(
					"/storage/v1/object/public/images/",
					""
				);

				const { error: deleteError } = await supabase.storage
					.from("images")
					.remove([filePath]);

				if (deleteError) throw deleteError;
			}

			// Then delete the service from the database
			const { error } = await supabase
				.from("services")
				.delete()
				.eq("id", id);

			if (error) throw error;

			toast.success(t("services.deleteSuccess"));
			navigate("/services");
		} catch (error) {
			console.error(error);
			toast.error(t("services.deleteError"));
		} finally {
			setSaving(false);
		}
	};

	if (loading) return <p>{t("loading")}</p>;

	return (
		<>
			<TopBar />
			<div className="service-edit-page">
				<h2 className="form-title">{t("services.editTitle")}</h2>
				<ServiceForm
					defaultValues={defaultValues}
					categories={categories}
					onSubmit={handleSubmit}
					saving={saving}
					t={t}
					i18n={i18n}
					onDelete={handleDelete}
				/>
				<WaveDivider />
			</div>
		</>
	);
}
