"use client";
import { BACKEND_URL, LOCALE_LANGUAGE } from "@/constant/apiUrl";
import { CheckCircle, XCircle } from "lucide-react";
import Head from "next/head";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
export const dynamic = "force-dynamic";

export default function Register() {
  const searchParams = useSearchParams();
  const [slug, setSlug] = useState("");
  const [detail, setDetail] = useState("");
  const [category, setCategory] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [city, setCity] = useState("");
  const [language, setLanguage] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [modal, setModal] = useState(false);
  const [success, setSuccess] = useState(false);
  const [participantType, setParticipantType] = useState("Company");
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [jobtitle, setJobTitle] = useState("");
  const [phone, setPhone] = useState("");
  const [mobile, setMobile] = useState("");
  const [company, setCompany] = useState("");
  const [address, setAddress] = useState("");
  const [country, setCountry] = useState("");
  const [loading, setLoading] = useState(false);

  // Regex for valid phone number format (allowing + and digits only)
  const phoneRegex = /^[+]?[0-9]{10,15}$/; // Valid phone number
  const mobileRegex = /^[+]?[0-9]{10,15}$/; // Same for mobile number

  // Handle phone number input change
  const handlePhoneChange = (e) => {
    setPhone(e.target.value); // Allow any input
  };

  // Handle mobile number input change
  const handleMobileChange = (e) => {
    setMobile(e.target.value); // Allow any input
  };

  // Validate phone and mobile number before form submission
  const validatePhone = () => phoneRegex.test(phone);
  const validateMobile = () => mobileRegex.test(mobile);

  const [participants, setParticipants] = useState([
    {
      fullName: "",
      email: "",
      jobTitle: "",
      phone: "",
      mobile: "",
    },
  ]);

  const handleParticipantTypeChange = (type) => {
    setParticipantType(type);
  };

  const handleInputChange = (index, field, value) => {
    const updatedParticipants = [...participants];
    updatedParticipants[index][field] = value;
    setParticipants(updatedParticipants);
  };

  const addParticipant = () => {
    setParticipants([
      ...participants,
      {
        fullName: "",
        email: "",
        jobTitle: "",
        phone: "",
        mobile: "",
      },
    ]);
  };

  useEffect(() => {
    setSlug(searchParams.get("course") || "");
    setSelectedDate(searchParams.get("date") || "");
    setCity(searchParams.get("city") || "");
  }, [searchParams]);

  useEffect(() => {
    setSlug(searchParams.get("course") || "");
    const initialCitySlug = searchParams.get("city"); // Get the city slug from the URL

    // Fetch the course details after slug is set
    const getDetail = async () => {
      if (slug) {
        try {
          const res = await fetch(`${BACKEND_URL}/courses/${slug}`, {
            method: "GET",
            next: { revalidate: 60 },
            headers: {
              "Content-Type": "application/json",
              "Accept-Language": LOCALE_LANGUAGE,
            },
          });
          if (!res.ok) throw new Error(`Failed to fetch details`);
          const d = await res.json();
          setDetail(d);

          // Automatically select the city based on the slug
          if (d?.data?.available_cities && initialCitySlug) {
            const cityFromSlug = d.data.available_cities.find(
              (cityOption) => cityOption.slug === initialCitySlug
            );
            if (cityFromSlug) {
              setCity(cityFromSlug.id); // Set city ID based on the slug
            }
          }

          return d;
        } catch (error) {
          console.error(error.message);
        }
      }
    };

    getDetail();
  }, [slug, searchParams]);

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
 // Form validation function
 const validateForm = () => {
  let newErrors = {};
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
  } else if (!mobileRegex.test(mobile)) {
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
  
  // Participants validation (only for Company type)
  if (participantType.toLowerCase() === "company") {
    const participantsErrors = [];
    
    participants.forEach((participant, index) => {
      const participantErrors = {};
      let hasError = false;
      
      if (!participant.fullName.trim()) {
        participantErrors.fullName = "Full name is required";
        hasError = true;
      }
      
      if (!participant.email.trim()) {
        participantErrors.email = "Email is required";
        hasError = true;
      } else if (!emailRegex.test(participant.email)) {
        participantErrors.email = "Please enter a valid email address";
        hasError = true;
      }
      
      if (!participant.jobTitle.trim()) {
        participantErrors.jobTitle = "Job title is required";
        hasError = true;
      }
      
      if (participant.phone && !phoneRegex.test(participant.phone)) {
        participantErrors.phone = "Please enter a valid phone number";
        hasError = true;
      }
      
      if (!participant.mobile.trim()) {
        participantErrors.mobile = "Mobile number is required";
        hasError = true;
      } else if (!mobileRegex.test(participant.mobile)) {
        participantErrors.mobile = "Please enter a valid mobile number";
        hasError = true;
      }
      
      if (hasError) {
        participantsErrors[index] = participantErrors;
        isValid = false;
      }
    });
    
    if (participantsErrors.length > 0) {
      newErrors.participants = participantsErrors;
    }
  }
  
  setErrors(newErrors);
  return isValid;
};

const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Validate form before submission
  if (!validateForm()) {
    toast.error("Please fill in all required fields correctly.");
    return;
  }

    e.preventDefault();
    setLoading(true);
    // Create a new FormData object
    const formData = new FormData();

    // Append fields to FormData
    formData.append("course_id", detail?.data?.id || "");
    formData.append("participant_type", participantType.toLowerCase());
    formData.append("city_id", Number(city) || "");
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

    // Append participants only if it's a company
    if (participantType.toLowerCase() === "company") {
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
      const csrfToken = document
        .querySelector('meta[name="csrf-token"]')
        ?.getAttribute("content"); // Or however you're storing it
      console.log(csrfToken, "csrfToken");
      const response = await fetch(`${BACKEND_URL}/course-register`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Accept-Language": LOCALE_LANGUAGE,
          "X-CSRF-TOKEN": csrfToken, // <- CSRF token added here
        },
        body: formData,
      });
      const responseData = await response.json(); // Parse JSON response
      setLoading(false);

      console.log(responseData, "responseData");
      // Handle success based on `status`
      if (responseData.status === "success") {
        setModal(true);
        setSuccess(true);
      } else {
        setModal(true);
        setSuccess(false);
        console.error("Unexpected status:", responseData.status);
      }
    } catch (error) {
      console.error("Error submitting form:", error); // Handle network or other errors
    }
  };

  return (
    <>
      <Head>
        <meta name="csrf-token" content="{{ csrf_token() }}"></meta>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      {/* <Design secondary={true} bg></Design> */}
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
                  className="w-full text-primary cursor-not-allowed   border border-gray-300 rounded-lg p-2 bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-primary text-sm font-medium sm:mb-2 mt-2 sm:mt-0">
                  Category
                </label>
                <select
                  value={category}
                  required
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
                  required
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
                  value={city} // This binds the selected city to the state
                  required
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
              </div>

              <div>
                <label className="block text-primary text-sm font-medium sm:mb-2 mt-2 sm:mt-0">
                  Language
                </label>
                <select
                  value={language}
                  required
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full text-primary border border-gray-300 rounded-lg p-2"
                >
                  <option value={"English"}>English</option>
                  <option value={"Arabic"}>Arabic</option>
                </select>
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
                              onChange={(e) => setSelectedDate(e.target.value)} // Update state directly
                              onClick={() => setSelectedDate(dateObj.date)} // Handle click directly
                              className="focus:ring-blue-500 text-primary"
                            />
                          </td>
                          <td
                            className="px-4 py-2 text-primary text-sm  border-b cursor-pointer"
                            onClick={() => setSelectedDate(dateObj.date)} // Clicking on the row updates the date
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
                            onClick={() => setSelectedDate(selectedDate)} // Ensure custom date selection
                            className="focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-4 py-2 text-sm text-primary border-b">
                          <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)} // Handle custom date change
                            className="w-full border border-gray-300 text-primary rounded-md p-2"
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
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
                <div className="text-lg font-medium mb-4">
                  {participantType === "Company" ? (
                    <h1>Company Details</h1>
                  ) : (
                    <h1>Participant </h1>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input
                    type="text"
                    placeholder="Full Name"
                    required
                    value={fullname}
                    onChange={(e) => setFullname(e.target.value)}
                    className="w-full border text-primary border-gray-300 rounded-lg p-2"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border text-primary border-gray-300 rounded-lg p-2"
                  />
                  <input
                    type="text"
                    placeholder="Job Title"
                    required
                    value={jobtitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className="w-full border text-primary border-gray-300 rounded-lg p-2"
                  />
                  <div className="flex flex-col gap-2">
                    <input
                      type="tel"
                      placeholder="Phone"
                      required
                      value={phone}
                      onChange={(e) => handlePhoneChange(e)}
                      className="w-full border text-primary border-gray-300 rounded-lg p-2"
                    />
                    {!phoneRegex.test(phone) && phone && (
                      <p className="text-xs text-red-500">
                        Please enter a valid phone number.
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <input
                      type="tel"
                      placeholder="Mobile"
                      required
                      value={mobile}
                      onChange={handleMobileChange}
                      className="w-full border text-primary border-gray-300 rounded-lg p-2"
                    />
                    {!mobileRegex.test(mobile) && mobile && (
                      <p className="text-xs text-red-500">
                        Please enter a valid mobile number.
                      </p>
                    )}
                  </div>
                  <input
                    type="text"
                    placeholder="Company"
                    required
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full border text-primary border-gray-300 rounded-lg p-2"
                  />
                  <input
                    type="text"
                    placeholder="Address"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full border text-primary border-gray-300 rounded-lg p-2"
                  />
                  <select
                    value={country}
                    required
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full border text-primary border-gray-300 rounded-lg p-2"
                  >
                    <option>Select Country</option>
                    {countries.map((country, index) => (
                      <option key={index} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                </div>
                {participants.map(
                  (participant, index) =>
                    participantType === "Company" && (
                      <div key={index} className="mb-6 border-t my-10 pt-4">
                        <h3 className="text-lg font-medium mb-4">
                          Participant {index + 1}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                          <input
                            type="email"
                            placeholder="Email"
                            value={participant.email}
                            onChange={(e) =>
                              handleInputChange(index, "email", e.target.value)
                            }
                            className="w-full text-primary border border-gray-300 rounded-lg p-2"
                          />
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
                          <input
                            type="tel"
                            placeholder="Phone"
                            value={participant.phone}
                            onChange={(e) =>
                              handleInputChange(index, "phone", e.target.value)
                            }
                            pattern="^\+?[1-9]\d{1,14}$"
                            className="w-full text-primary border border-gray-300 rounded-lg p-2"
                          />
                          <input
                            type="tel"
                            placeholder="Mobile"
                            required
                            value={participant.mobile}
                            onChange={(e) =>
                              handleInputChange(index, "mobile", e.target.value)
                            }
                            pattern="^\+?[1-9]\d{1,14}$"
                            className="w-full text-primary border border-gray-300 rounded-lg p-2"
                          />
                        </div>
                      </div>
                    )
                )}
              </div>

              {participantType === "Company" && (
                <button
                  type="button"
                  onClick={addParticipant}
                  className="text-blue-500"
                >
                  + Add Another Participant
                </button>
              )}
            </div>

            <div className="mt-8 text-start">
              <button
                type="submit"
                className="px-6 py-3 bg-primary text-white rounded-lg"
              >
                {loading ? "Loading ..." : "Submit"}
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
                  href="/diploma"
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
