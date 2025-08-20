import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import CustomSelect from "./CustomSelect";
import toast from "react-hot-toast";
import TrashIcon from "../assets/TrashIcon";

export default function ServiceForm({
  defaultValues = {},
  categories = [],
  onSubmit,
  saving,
  t,
  i18n,
  onDelete
}) {
  const [selectedCategory, setSelectedCategory] = useState(
    defaultValues.category_id || ""
  );
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(defaultValues.image_url || "");

  const schema = yup.object({
    title_es: yup.string().required(),
    title_en: yup.string().required(),
    description_es: yup.string().required(),
    description_en: yup.string().required(),
    price: yup.number().positive().required(),
    image_url: yup.string().url().nullable(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const handleFileChange = (file) => {
    setSelectedFile(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const internalSubmit = (data) => {
    if (!selectedCategory) {
      toast.error(t("services.categoryRequired"));
      return;
    }
    onSubmit({ ...data, selectedCategory, selectedFile });
  };

  return (
    <form onSubmit={handleSubmit(internalSubmit)} className="form-container">
      <div>
        <label>{t("services.titleEs")}</label>
        <input {...register("title_es")} className="input" />
        {errors.title_es && <p className="error">{errors.title_es.message}</p>}
      </div>

      <div>
        <label>{t("services.titleEn")}</label>
        <input {...register("title_en")} className="input" />
        {errors.title_en && <p className="error">{errors.title_en.message}</p>}
      </div>

      <div>
        <label>{t("services.descriptionEs")}</label>
        <textarea {...register("description_es")} className="input" />
        {errors.description_es && (
          <p className="error">{errors.description_es.message}</p>
        )}
      </div>

      <div>
        <label>{t("services.descriptionEn")}</label>
        <textarea {...register("description_en")} className="input" />
        {errors.description_en && (
          <p className="error">{errors.description_en.message}</p>
        )}
      </div>

      <div>
        <label>{t("services.price")}</label>
        <input type="number" step="0.01" {...register("price")} className="input" />
        {errors.price && <p className="error">{errors.price.message}</p>}
      </div>

      <div>
        <label>{t("services.category")}</label>
        <CustomSelect
          options={categories.map((cat) => ({
            value: cat.id,
            label: i18n.language === "es" ? cat.name_es : cat.name_en,
          }))}
          value={selectedCategory}
          onChange={(val) => setSelectedCategory(val)}
          placeholder={t("form.select")}
        />
        {!selectedCategory && (
          <p className="error">{t("services.categoryRequired")}</p>
        )}
      </div>

      <div className= "images-prompt">
        <label>{t("services.image")}</label>
        
        {previewImage && (
          <img
            src={previewImage}
            alt="Preview"
            className="mt-2 w-32 h-32 object-cover"
          />
        )}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => e.target.files[0] && handleFileChange(e.target.files[0])}
        />
      </div>

      <div className="button-group">
        <button
          type="button"
          className="button-delete"
          onClick={onDelete}
          disabled={saving}
        >
          <TrashIcon className="w-4 h-4 " />
          {t("form.buttons.delete")}
        </button>
        <button type="submit" className="button-submit" disabled={saving}>
          {saving ? t("services.saving") : t("form.buttons.save")}
        </button>
        
      </div>
    </form>
  );
}
