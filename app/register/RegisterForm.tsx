"use client";

import { BACKEND_URL, LOCALE_LANGUAGE } from "@/constant/apiUrl";
import { CheckCircle, XCircle } from "lucide-react";
import Head from "next/head";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";

// Interfaces for type safety
interface CourseDetail {
  id: string;
  title: string;
  category: string;
  specialization: string;
  available_cities: { id: string; name: string; slug: string }[];
  available_dates: { id: string; date: string }[];
}

interface Participant {
  fullName: string;
  email: string;
  jobTitle: string;
  phone: string;
  mobile: string;
}

interface FormErrors {
  city?: string;
  date?: string;
  language?: string;
  fullname?: string;
  email?: string;
  jobtitle?: string;
  phone?: string;
  mobile?: string;
  company?: string;
  address?: string;
  country?: string;
  participants?: Array<Partial<Participant>>;
}

export default function RegisterForm() {
  // State definitions
  const searchParams = useSearchParams();
  const [slug, setSlug] = useState<string>("");
  const [detail, setDetail] = useState<{ data: CourseDetail } | null>(null);
  const [category, setCategory] = useState<string>("");
  const [specialization, setSpecialization] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [language, setLanguage] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [modal, setModal] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [participantType, setParticipantType] = useState<"Company" | "Person">(
    "Company"
  );
  const [fullname, setFullname] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [jobtitle, setJobTitle] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [mobile, setMobile] = useState<string>("");
  const [company, setCompany] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [participants, setParticipants] = useState<Participant[]>([
    { fullName: "", email: "", jobTitle: "", phone: "", mobile: "" },
  ]);

  // Regex for validation
  const phoneRegex = /^\+?[0-9]{10,15}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const countries = [
    "Afghanistan",
    "Albania",
    "Algeria",
    "American Samoa",
    "Andorra",
    "Angola",
    "Anguilla",
    "Antarctica",
    "Antigua and Barbuda",
    "Argentina",
    "Armenia",
    "Aruba",
    "Australia",
    "Austria",
    "Azerbaijan",
    "Bahamas (the)",
    "Bahrain",
    "Bangladesh",
    "Barbados",
    "Belarus",
    "Belgium",
    "Belize",
    "Benin",
    "Bermuda",
    "Bhutan",
    "Bolivia (Plurinational State of)",
    "Bonaire, Sint Eustatius and Saba",
    "Bosnia and Herzegovina",
    "Botswana",
    "Bouvet Island",
    "Brazil",
    "British Indian Ocean Territory (the)",
    "Brunei Darussalam",
    "Bulgaria",
    "Burkina Faso",
    "Burundi",
    "Cabo Verde",
    "Cambodia",
    "Cameroon",
    "Canada",
    "Cayman Islands (the)",
    "Central African Republic (the)",
    "Chad",
    "Chile",
    "China",
    "Christmas Island",
    "Cocos (Keeling) Islands (the)",
    "Colombia",
    "Comoros (the)",
    "Congo (the Democratic Republic of the)",
    "Congo (the)",
    "Cook Islands (the)",
    "Costa Rica",
    "Croatia",
    "Cuba",
    "Curaçao",
    "Cyprus",
    "Czechia",
    "Côte d'Ivoire",
    "Denmark",
    "Djibouti",
    "Dominica",
    "Dominican Republic (the)",
    "Ecuador",
    "Egypt",
    "El Salvador",
    "Equatorial Guinea",
    "Eritrea",
    "Estonia",
    "Eswatini",
    "Ethiopia",
    "Falkland Islands (the) [Malvinas]",
    "Faroe Islands (the)",
    "Fiji",
    "Finland",
    "France",
    "French Guiana",
    "French Polynesia",
    "French Southern Territories (the)",
    "Gabon",
    "Gambia (the)",
    "Georgia",
    "Germany",
    "Ghana",
    "Gibraltar",
    "Greece",
    "Greenland",
    "Grenada",
    "Guadeloupe",
    "Guam",
    "Guatemala",
    "Guernsey",
    "Guinea",
    "Guinea-Bissau",
    "Guyana",
    "Haiti",
    "Heard Island and McDonald Islands",
    "Holy See (the)",
    "Honduras",
    "Hong Kong",
    "Hungary",
    "Iceland",
    "India",
    "Indonesia",
    "Iran (Islamic Republic of)",
    "Iraq",
    "Ireland",
    "Isle of Man",
    "Israel",
    "Italy",
    "Jamaica",
    "Japan",
    "Jersey",
    "Jordan",
    "Kazakhstan",
    "Kenya",
    "Kiribati",
    "Korea (the Democratic People's Republic of)",
    "Korea (the Republic of)",
    "Kuwait",
    "Kyrgyzstan",
    "Lao People's Democratic Republic (the)",
    "Latvia",
    "Lebanon",
    "Lesotho",
    "Liberia",
    "Libya",
    "Liechtenstein",
    "Lithuania",
    "Luxembourg",
    "Macao",
    "Madagascar",
    "Malawi",
    "Malaysia",
    "Maldives",
    "Mali",
    "Malta",
    "Marshall Islands (the)",
    "Martinique",
    "Mauritania",
    "Mauritius",
    "Mayotte",
    "Mexico",
    "Micronesia (Federated States of)",
    "Moldova (the Republic of)",
    "Monaco",
    "Mongolia",
    "Montenegro",
    "Montserrat",
    "Morocco",
    "Mozambique",
    "Myanmar",
    "Namibia",
    "Nauru",
    "Nepal",
    "Netherlands (the)",
    "New Caledonia",
    "New Zealand",
    "Nicaragua",
    "Niger (the)",
    "Nigeria",
    "Niue",
    "Norfolk Island",
    "Northern Mariana Islands (the)",
    "Norway",
    "Oman",
    "Pakistan",
    "Palau",
    "Palestine, State of",
    "Panama",
    "Papua New Guinea",
    "Paraguay",
    "Peru",
    "Philippines (the)",
    "Pitcairn",
    "Poland",
    "Portugal",
    "Puerto Rico",
    "Qatar",
    "Republic of North Macedonia",
    "Romania",
    "Russian Federation (the)",
    "Rwanda",
    "Réunion",
    "Saint Barthélemy",
    "Saint Helena, Ascension and Tristan da Cunha",
    "Saint Kitts and Nevis",
    "Saint Lucia",
    "Saint Martin (French part)",
    "Saint Pierre and Miquelon",
    "Saint Vincent and the Grenadines",
    "Samoa",
    "San Marino",
    "Sao Tome and Principe",
    "Saudi Arabia",
    "Senegal",
    "Serbia",
    "Seychelles",
    "Sierra Leone",
    "Singapore",
    "Sint Maarten (Dutch part)",
    "Slovakia",
    "Slovenia",
    "Solomon Islands",
    "Somalia",
    "South Africa",
    "South Georgia and the South Sandwich Islands",
    "South Sudan",
    "Spain",
    "Sri Lanka",
    "Sudan (the)",
    "Suriname",
    "Svalbard and Jan Mayen",
    "Sweden",
    "Switzerland",
    "Syrian Arab Republic",
    "Taiwan",
    "Tajikistan",
    "Tanzania, United Republic of",
    "Thailand",
    "Timor-Leste",
    "Togo",
    "Tokelau",
    "Tonga",
    "Trinidad and Tobago",
    "Tunisia",
    "Turkey",
    "Turkmenistan",
    "Turks and Caicos Islands (the)",
    "Tuvalu",
    "Uganda",
    "Ukraine",
    "United Arab Emirates (the)",
    "United Kingdom of Great Britain and Northern Ireland (the)",
    "United States Minor Outlying Islands (the)",
    "United States of America (the)",
    "Uruguay",
    "Uzbekistan",
    "Vanuatu",
    "Venezuela (Bolivarian Republic of)",
    "Viet Nam",
    "Virgin Islands (British)",
    "Virgin Islands (U.S.)",
    "Wallis and Futuna",
    "Western Sahara",
    "Yemen",
    "Zambia",
    "Zimbabwe",
    "Åland Islands",
  ];
  // Handlers
  const handleParticipantTypeChange = (type: "Company" | "Person") => {
    setParticipantType(type);
  };

  const handleInputChange = (
    index: number,
    field: keyof Participant,
    value: string
  ) => {
    const updatedParticipants = [...participants];
    updatedParticipants[index][field] = value;
    setParticipants(updatedParticipants);
  };

  const addParticipant = () => {
    setParticipants([
      ...participants,
      { fullName: "", email: "", jobTitle: "", phone: "", mobile: "" },
    ]);
  };

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    // Course information validation
    if (!city) {
      newErrors.city = "Please select a city";
      isValid = false;
    }
    if (!selectedDate) {
      newErrors.date = "Please select a date";
      isValid = false;
    }
    if (!language) {
      newErrors.language = "Please select a language";
      isValid = false;
    }

    // Personal information validation
    if (!fullname.trim()) {
      newErrors.fullname = "Full name is required";
      isValid = false;
    }
    if (!email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }
    if (!jobtitle.trim()) {
      newErrors.jobtitle = "Job title is required";
      isValid = false;
    }
    if (!phone.trim()) {
      newErrors.phone = "Phone number is required";
      isValid = false;
    } else if (!phoneRegex.test(phone)) {
      newErrors.phone = "Please enter a valid phone number";
      isValid = false;
    }
    if (!mobile.trim()) {
      newErrors.mobile = "Mobile number is required";
      isValid = false;
    } else if (!phoneRegex.test(mobile)) {
      newErrors.mobile = "Please enter a valid mobile number";
      isValid = false;
    }
    if (!company.trim()) {
      newErrors.company = "Company name is required";
      isValid = false;
    }
    if (!address.trim()) {
      newErrors.address = "Address is required";
      isValid = false;
    }
    if (!country || country === "Select Country") {
      newErrors.country = "Please select a country";
      isValid = false;
    }

    // Participants validation for Company type
    if (participantType === "Company") {
      const participantsErrors: Array<Partial<Participant>> = [];
      participants.forEach((participant, index) => {
        const participantErrors: Partial<Participant> = {};
        if (!participant.fullName.trim()) {
          participantErrors.fullName = "Full name is required";
          isValid = false;
        }
        if (!participant.email.trim()) {
          participantErrors.email = "Email is required";
          isValid = false;
        } else if (!emailRegex.test(participant.email)) {
          participantErrors.email = "Please enter a valid email address";
          isValid = false;
        }
        if (!participant.jobTitle.trim()) {
          participantErrors.jobTitle = "Job title is required";
          isValid = false;
        }
        if (participant.phone && !phoneRegex.test(participant.phone)) {
          participantErrors.phone = "Please enter a valid phone number";
          isValid = false;
        }
        if (!participant.mobile.trim()) {
          participantErrors.mobile = "Mobile number is required";
          isValid = false;
        } else if (!phoneRegex.test(participant.mobile)) {
          participantErrors.mobile = "Please enter a valid mobile number";
          isValid = false;
        }
        if (Object.keys(participantErrors).length > 0) {
          participantsErrors[index] = participantErrors;
        }
      });
      if (participantsErrors.length > 0) {
        newErrors.participants = participantsErrors;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  // Form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fill in all required fields correctly.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("course_id", detail?.data?.id || "");
    formData.append("participant_type", participantType.toLowerCase());
    formData.append("city_id", city || "");
    formData.append("date", selectedDate || "");
    formData.append("full_name", fullname || "");
    formData.append("language", language || "English");
    formData.append("email", email || "");
    formData.append("job_title", jobtitle || "");
    formData.append("phone", phone || "");
    formData.append("mobile", mobile || "");
    formData.append("company", company || "");
    formData.append("address", address || "");
    formData.append("country", country || "");

    if (participantType === "Company") {
      participants.forEach((participant, index) => {
        formData.append(
          `participants[${index}][full_name]`,
          participant.fullName
        );
        formData.append(`participants[${index}][email]`, participant.email);
        formData.append(
          `participants[${index}][job_title]`,
          participant.jobTitle
        );
        formData.append(`participants[${index}][phone]`, participant.phone);
        formData.append(`participants[${index}][mobile]`, participant.mobile);
      });
    }

    try {
      const csrfToken =
        document
          .querySelector('meta[name="csrf-token"]')
          ?.getAttribute("content") || "";
      const response = await fetch(`${BACKEND_URL}/course-register`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Accept-Language": LOCALE_LANGUAGE,
          "X-CSRF-TOKEN": csrfToken,
        },
        body: formData,
      });

      const responseData = await response.json();
      setLoading(false);

      if (responseData.status === "success") {
        setModal(true);
        setSuccess(true);
      } else {
        setModal(true);
        setSuccess(false);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setModal(true);
      setSuccess(false);
      setLoading(false);
    }
  };

  // Fetch course details
  useEffect(() => {
    setSlug(searchParams.get("course") || "");
    setSelectedDate(searchParams.get("date") || "");
    setCity(searchParams.get("city") || "");

    const fetchCourseDetails = async () => {
      if (!slug) return;

      try {
        const res = await fetch(`${BACKEND_URL}/courses/${slug}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Accept-Language": LOCALE_LANGUAGE,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch course details");
        const data = await res.json();
        setDetail(data);

        const initialCitySlug = searchParams.get("city");
        if (data?.data?.available_cities && initialCitySlug) {
          const cityFromSlug = data.data.available_cities.find(
            (cityOption: { slug: string }) =>
              cityOption.slug === initialCitySlug
          );
          if (cityFromSlug) setCity(cityFromSlug.id);
        }
      } catch (error) {
        console.error("Error fetching course details:", error);
      }
    };

    fetchCourseDetails();
  }, [slug, searchParams]);
  const redirectURL =
    LOCALE_LANGUAGE === "en" ? "/training-courses" : "/الدورات-التدريبية";
  return (
    <>
      <Head>
        <meta name="csrf-token" content="{{ csrf_token() }}" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <div className="min-h-screen py-10 mt-10 bg-gray-100 flex items-center justify-center text-base">
        <div className="bg-white shadow-md rounded-lg md:p-6 p-4 w-full max-w-3xl">
          <h1 className="text-2xl font-semibold mb-6 text-center text-primary">
            Register Course
          </h1>

          <form onSubmit={handleSubmit}>
            <div className="sm:grid sm:grid-cols-2 sm:gap-6">
              <div>
                <label className="block text-sm font-medium sm:mb-2 mt-2 sm:mt-0">
                  Course Title
                </label>
                <input
                  type="text"
                  value={detail?.data?.title || ""}
                  readOnly
                  className="w-full text-primary cursor-not-allowed border border-gray-300 rounded-lg p-2 bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-primary text-sm font-medium sm:mb-2 mt-2 sm:mt-0">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full text-primary border border-gray-300 rounded-lg p-2"
                >
                  <option>{detail?.data?.category || "Select Category"}</option>
                </select>
              </div>
              <div>
                <label className="block text-primary text-sm font-medium sm:mb-2 mt-2 sm:mt-0">
                  Specialization
                </label>
                <select
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  className="w-full text-primary border border-gray-300 rounded-lg p-2"
                >
                  <option>
                    {detail?.data?.specialization || "Select Specialization"}
                  </option>
                </select>
              </div>
              <div>
                <label className="block text-primary text-sm font-medium sm:mb-2 mt-2 sm:mt-0">
                  City
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full text-primary border border-gray-300 rounded-lg p-2"
                >
                  {!city && <option>Select City</option>}
                  {detail?.data?.available_cities?.map((cityOption) => (
                    <option key={cityOption.id} value={cityOption.id}>
                      {cityOption.name}
                    </option>
                  ))}
                </select>
                {errors.city && (
                  <p className="text-xs text-red-500">{errors.city}</p>
                )}
              </div>
              <div>
                <label className="block text-primary text-sm font-medium sm:mb-2 mt-2 sm:mt-0">
                  Language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full text-primary border border-gray-300 rounded-lg p-2"
                >
                  <option value="">Select Language</option>
                  <option value="English">English</option>
                  <option value="Arabic">Arabic</option>
                </select>
                {errors.language && (
                  <p className="text-xs text-red-500">{errors.language}</p>
                )}
              </div>
              <div className="col-span-2">
                <label className="block text-primary text-sm font-medium sm:mb-2 mt-2 sm:mt-0">
                  Available Dates
                </label>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-600 border-b">
                          #
                        </th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-600 border-b">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {detail?.data?.available_dates?.map((dateObj) => (
                        <tr key={dateObj.id} className="hover:bg-gray-100">
                          <td className="px-4 py-2 text-sm text-gray-700 border-b">
                            <input
                              type="radio"
                              name="date"
                              value={dateObj.date}
                              checked={selectedDate === dateObj.date}
                              onChange={(e) => setSelectedDate(e.target.value)}
                              className="focus:ring-blue-500 text-primary"
                            />
                          </td>
                          <td
                            className="px-4 py-2 text-primary text-sm border-b cursor-pointer"
                            onClick={() => setSelectedDate(dateObj.date)}
                          >
                            {dateObj.date}
                          </td>
                        </tr>
                      ))}
                      <tr className="hover:bg-gray-100">
                        <td className="px-4 py-2 text-sm text-primary border-b">
                          <input
                            type="radio"
                            name="date"
                            value={selectedDate}
                            checked={
                              !detail?.data?.available_dates?.some(
                                (dateObj) => dateObj.date === selectedDate
                              )
                            }
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-4 py-2 text-sm text-primary border-b">
                          <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="w-full border border-gray-300 text-primary rounded-md p-2"
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                {errors.date && (
                  <p className="text-xs text-red-500">{errors.date}</p>
                )}
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-6">Participant Form</h2>
              <div className="mb-4">
                <label className="block text-sm text-primary font-medium mb-2">
                  Participant Type
                </label>
                <div className="flex space-x-4 text-primary">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="participantType"
                      value="Company"
                      checked={participantType === "Company"}
                      onChange={() => handleParticipantTypeChange("Company")}
                      className="text-primary"
                    />
                    <span>Company</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="participantType"
                      value="Person"
                      checked={participantType === "Person"}
                      onChange={() => handleParticipantTypeChange("Person")}
                      className="text-primary"
                    />
                    <span>Person</span>
                  </label>
                </div>
              </div>

              <div className="mb-6 border-t pt-4 text-primary">
                <h3 className="text-lg font-medium mb-4">
                  {participantType === "Company"
                    ? "Company Details"
                    : "Participant"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={fullname}
                      onChange={(e) => setFullname(e.target.value)}
                      className="w-full border text-primary border-gray-300 rounded-lg p-2"
                    />
                    {errors.fullname && (
                      <p className="text-xs text-red-500">{errors.fullname}</p>
                    )}
                  </div>
                  <div>
                    <input
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full border text-primary border-gray-300 rounded-lg p-2"
                    />
                    {errors.email && (
                      <p className="text-xs text-red-500">{errors.email}</p>
                    )}
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Job Title"
                      value={jobtitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      className="w-full border text-primary border-gray-300 rounded-lg p-2"
                    />
                    {errors.jobtitle && (
                      <p className="text-xs text-red-500">{errors.jobtitle}</p>
                    )}
                  </div>
                  <div>
                    <input
                      type="tel"
                      placeholder="Phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full border text-primary border-gray-300 rounded-lg p-2"
                    />
                    {errors.phone && (
                      <p className="text-xs text-red-500">{errors.phone}</p>
                    )}
                  </div>
                  <div>
                    <input
                      type="tel"
                      placeholder="Mobile"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      className="w-full border text-primary border-gray-300 rounded-lg p-2"
                    />
                    {errors.mobile && (
                      <p className="text-xs text-red-500">{errors.mobile}</p>
                    )}
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Company"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="w-full border text-primary border-gray-300 rounded-lg p-2"
                    />
                    {errors.company && (
                      <p className="text-xs text-red-500">{errors.company}</p>
                    )}
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full border text-primary border-gray-300 rounded-lg p-2"
                    />
                    {errors.address && (
                      <p className="text-xs text-red-500">{errors.address}</p>
                    )}
                  </div>
                  <div>
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full border text-primary border-gray-300 rounded-lg p-2"
                    >
                      <option>Select Country</option>
                      {countries.map((country) => (
                        <option key={country} value={country}>
                          {country}
                        </option>
                      ))}
                    </select>
                    {errors.country && (
                      <p className="text-xs text-red-500">{errors.country}</p>
                    )}
                  </div>
                </div>

                {participantType === "Company" &&
                  participants.map((participant, index) => (
                    <div key={index} className="mb-6 border-t my-10 pt-4">
                      <h3 className="text-lg font-medium mb-4">
                        Participant {index + 1}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <input
                            type="text"
                            placeholder="Full Name"
                            value={participant.fullName}
                            onChange={(e) =>
                              handleInputChange(
                                index,
                                "fullName",
                                e.target.value
                              )
                            }
                            className="w-full text-primary border border-gray-300 rounded-lg p-2"
                          />
                          {errors.participants?.[index]?.fullName && (
                            <p className="text-xs text-red-500">
                              {errors.participants[index].fullName}
                            </p>
                          )}
                        </div>
                        <div>
                          <input
                            type="email"
                            placeholder="Email"
                            value={participant.email}
                            onChange={(e) =>
                              handleInputChange(index, "email", e.target.value)
                            }
                            className="w-full text-primary border border-gray-300 rounded-lg p-2"
                          />
                          {errors.participants?.[index]?.email && (
                            <p className="text-xs text-red-500">
                              {errors.participants[index].email}
                            </p>
                          )}
                        </div>
                        <div>
                          <input
                            type="text"
                            placeholder="Job Title"
                            value={participant.jobTitle}
                            onChange={(e) =>
                              handleInputChange(
                                index,
                                "jobTitle",
                                e.target.value
                              )
                            }
                            className="w-full text-primary border border-gray-300 rounded-lg p-2"
                          />
                          {errors.participants?.[index]?.jobTitle && (
                            <p className="text-xs text-red-500">
                              {errors.participants[index].jobTitle}
                            </p>
                          )}
                        </div>
                        <div>
                          <input
                            type="tel"
                            placeholder="Phone"
                            value={participant.phone}
                            onChange={(e) =>
                              handleInputChange(index, "phone", e.target.value)
                            }
                            className="w-full text-primary border border-gray-300 rounded-lg p-2"
                          />
                          {errors.participants?.[index]?.phone && (
                            <p className="text-xs text-red-500">
                              {errors.participants[index].phone}
                            </p>
                          )}
                        </div>
                        <div>
                          <input
                            type="tel"
                            placeholder="Mobile"
                            value={participant.mobile}
                            onChange={(e) =>
                              handleInputChange(index, "mobile", e.target.value)
                            }
                            className="w-full text-primary border border-gray-300 rounded-lg p-2"
                          />
                          {errors.participants?.[index]?.mobile && (
                            <p className="text-xs text-red-500">
                              {errors.participants[index].mobile}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>

              {participantType === "Company" && (
                <button
                  type="button"
                  onClick={addParticipant}
                  className="text-blue-500 hover:underline"
                >
                  + Add Another Participant
                </button>
              )}
            </div>

            <div className="mt-8 text-start">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-primary text-white rounded-lg disabled:opacity-50"
              >
                {loading ? "Loading..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-[100%] sm:max-w-[540px] overflow-hidden">
            <div className="p-4 sm:p-6 md:p-8">
              {success ? (
                <div className="text-center">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                    Registration Successful
                  </h2>
                  <p className="text-sm sm:text-base text-gray-600 mb-6">
                    Your registration has been submitted successfully. You will
                    be notified via email or phone shortly.
                  </p>
                </div>
              ) : (
                <div className="text-center">
                  <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                    Registration Error
                  </h2>
                  <p className="text-sm sm:text-base text-gray-600 mb-6">
                    We apologize, but there was an error submitting your
                    registration. Please try again later or contact{" "}
                    <Link
                      href="/customer_service"
                      className="font-medium text-blue-600 hover:underline"
                    >
                      Customer Support
                    </Link>
                    .
                  </p>
                </div>
              )}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setModal(false)}
                  className="w-full sm:w-1/2 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors text-sm sm:text-base"
                >
                  Close
                </button>
                <Link
                  href={redirectURL}
                  className="w-full sm:w-1/2 text-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/70 transition-colors text-sm sm:text-base"
                >
                  Discover New Courses
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
