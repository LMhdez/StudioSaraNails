import { useServices } from "../contexts/ServicesContext";
import TopBar from "../components/TopBar";
import ServiceCard from "../components/ServiceCard";
import WaveDivider from "../components/WaveDivider";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import "../styles/Services.css";
import { useAuth } from "../contexts/UserContext";
import { useState } from "react";
import toast from "react-hot-toast";
import supabase from "../supabaseClient";
import CategoryForm from "../components/CategoryForm";
import DeleteCategoryModal from "../components/DeleteCategoryModal";

export default function ServicesPage() {
	const navigate = useNavigate();
	const { i18n, t } = useTranslation();
	const servicesObject = useServices();
	const { user } = useAuth();
	const [loading, setLoading] = useState(false);

	const [showAddModal, setShowAddModal] = useState(false);
	const [deleteCategoryId, setDeleteCategoryId] = useState(null);
	const [deleteCategoryName, setDeleteCategoryName] = useState("");

	const handleAddCategory = async (data) => {
		setLoading(true);
		try {
			const { data: inserted, error } = await supabase
				.from("service_categories")
				.insert([
					{
						name_es: data.name_es,
						name_en: data.name_en,
						active: true,
						slug: data.name_en.toLowerCase().replace(/\s+/g, "-"),
					},
				])
				.select();

			if (error) throw error;

			toast.success(t("categories.createSuccess"));
		} catch (err) {
			toast.error(t("categories.createError"));
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	const handleDeleteCategory = async () => {
		if (!deleteCategoryId) return;
		setLoading(true);

		try {
			// 1. Fetch services in the category
			const { data: services, error: fetchError } = await supabase
				.from("services")
				.select("id, image_url")
				.eq("category_id", deleteCategoryId);

			if (fetchError) throw fetchError;

			// 2. Delete each service image from storage
			for (const srv of services) {
				if (srv.image_url) {
					try {
						const url = new URL(srv.image_url);
						const filePath = url.pathname.replace(
							"/storage/v1/object/public/images/",
							""
						);

						const { error } = await supabase.storage
							.from("images")
							.remove([filePath]);

						if (error) throw error;
					} catch (err) {
						console.error(
							"Failed to delete image:",
							srv.image_url,
							err
						);
					}
				}
			}

			// 3. Delete category (services will be deleted via cascade)
			const { error: deleteError } = await supabase
				.from("service_categories")
				.delete()
				.eq("id", deleteCategoryId);

			if (deleteError) throw deleteError;

			toast.success(t("categories.deleteSuccess"));
		} catch (err) {
			toast.error(t("categories.deleteError"));
			console.error(err);
		} finally {
			setLoading(false);
			setDeleteCategoryId(null);
			setDeleteCategoryName("");
		}
	};

	const handleToggleActive = async (categoryId, currentActive) => {
		setLoading(true);
		try {
			const { error } = await supabase
				.from("service_categories")
				.update({ active: !currentActive })
				.eq("id", categoryId);

			if (error) throw error;

			toast.success(
				!currentActive
					? t("categories.activated") // i18n key for activated
					: t("categories.deactivated") // i18n key for deactivated
			);

			servicesObject.forEach((cat) => {
				if (cat.id === categoryId) cat.active = !currentActive;
			});
		} catch (err) {
			toast.error(t("categories.updateError"));
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<TopBar />
			<div className="services-page">
				{user && (
					<div className="admin-controls">
						<button
							onClick={() => setShowAddModal(true)}
							disabled={loading}
							className="add-category-button"
						>
							{t("categories.createTitle")}
						</button>

						<button
							onClick={() => navigate("/services/new")}
							className="add-category-button"
						>
							{t("services.createTitle")}
						</button>
					</div>
				)}

				{servicesObject.map((cat) => (
					<div
						key={cat.id}
						className={`category-section ${
							cat.active ? "active" : "inactive"
						}`}
					>
						<h2>
							{i18n.language === "es" ? cat.name_es : cat.name_en}
							{user && (
								<div className="category-controls">
									<label className="switch">
										<input
											type="checkbox"
											checked={cat.active}
											onChange={() =>
												handleToggleActive(
													cat.id,
													cat.active
												)
											}
											disabled={loading}
										/>
										<span className="slider round"></span>
									</label>
									<span className="switch-label">
										{t("categories.active")}
									</span>

									<button
										onClick={() => {
											setDeleteCategoryId(cat.id);
											setDeleteCategoryName(
												i18n.language === "es"
													? cat.name_es
													: cat.name_en
											);
										}}
										className="delete-button"
										disabled={loading}
									>
										{t("form.buttons.delete")}
									</button>
								</div>
							)}
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
									onClick={
										() =>
											user
												? navigate(
														`/services/${srv.id}`
												  ) // Admin: service form
												: navigate(`/schedule`) // Client: booking page
									}
								/>
							))}
						</div>
					</div>
				))}
				<WaveDivider />
			</div>

			{showAddModal && (
				<CategoryForm
					onClose={() => setShowAddModal(false)}
					onSubmit={handleAddCategory}
				/>
			)}

			{deleteCategoryId && (
				<DeleteCategoryModal
					categoryName={deleteCategoryName}
					onClose={() => setDeleteCategoryId(null)}
					onConfirm={handleDeleteCategory}
				/>
			)}
		</>
	);
}
