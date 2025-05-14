"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { BACKEND_URL, LOCALE_LANGUAGE } from "@/constant/apiUrl";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

const ConsultForm = ({ title }) => {
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  // Form State
  const [formData, setFormData] = useState({
    consultation_id: "2",
    name: "",
    email: "",
    contact_number: "",
    message: "",
  });

  // Handle Input Change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Validate Form
  const isFormValid = () => {
    return (
      formData.name &&
      formData.email &&
      formData.contact_number &&
      formData.message
    );
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid()) {
      toast.success({
        title: "Error",
        description: "All fields are required!",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const formDataToSend = new FormData();
    formDataToSend.append("consultation_id", formData.consultation_id);
    formDataToSend.append("name", formData.name);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("contact_number", formData.contact_number);
    formDataToSend.append("message", formData.message);

    try {
      const response = await fetch(`${BACKEND_URL}/consultation_query`, {
        method: "POST",
        headers: {
          "Accept-Language": LOCALE_LANGUAGE,
        },
        body: formDataToSend,
      });

      const data = await response.json();

      if (response.ok) {
        toast.success({
          title: "Success",
          description:
            "Your consultation request has been submitted successfully!",
          variant: "success",
        });
        setFormData({
          consultation_id: "2",
          name: "",
          email: "",
          contact_number: "",
          message: "",
        });
      } else {
        throw new Error(
          data.message || "Something went wrong. Please try again."
        );
      }
    } catch (error) {
      toast.error({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="md:flex md:justify-center overflow-hidden">
      <form
        onSubmit={handleSubmit}
        className="max-w-4xl md:mx-auto p-6 bg-white shadow-md mx-2 rounded"
      >
        <div className="flex flex-col md:flex-row justify-between md:gap-6">
          <div className="mb-4">
            <Label className='text-primary' htmlFor="name">{t("form.fullname")}</Label>
            <Input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              placeholder={t("form.fullnameplaceholder")}
              required
              className="text-primary"
            />
          </div>
          <div className="mb-4">
            <Label className='text-primary' htmlFor="email">{t("form.email")}</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder={t("form.emailplaceholder")}
              required
              className="text-primary"
            />
          </div>
        </div>

        <div className="flex md:flex-row flex-col justify-between md:gap-6">
          <div className="mb-4 md:w-1/2">
            <Label className='text-primary' htmlFor="consultation">{t("form.consultationLabel")}</Label>
            <Input
              id="consultation"
              type="text"
              value={title}
              readOnly
              className="bg-gray-200 text-primary cursor-not-allowed"
            />
          </div>
          <div className="mb-4 md:w-1/2">
            <Label className='text-primary' htmlFor="contact_number">{t("form.phnnumber")}</Label>
            <Input
              id="contact_number"
              name="contact_number"
              type="text"
              value={formData.contact_number}
              onChange={handleInputChange}
              placeholder={t("form.phnnumberplaceholder")}
              required
              className="text-primary"
            />
          </div>
        </div>

        <div className="mb-4">
          <Label className='text-primary' htmlFor="message">{t("form.messageLabel")}</Label>
          <Textarea
            id="message"
            name="message"
            rows="4"
            value={formData.message}
            onChange={handleInputChange}
            placeholder={t("form.messagePlaceholder")}
            required
            className="text-primary"
          />
        </div>

        <div className="flex justify-center">
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white rounded-full py-2"
          >
            {loading ? t("form.submittingButton") : t("form.submitButton")}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ConsultForm;
