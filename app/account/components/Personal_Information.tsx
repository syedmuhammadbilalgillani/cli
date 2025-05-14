import React from "react";
import Cards_Information from "./Cards_Information";
import { UserIcon } from "lucide-react"; // Updated for lucide-react
import { CalendarIcon } from "lucide-react"; // Updated for lucide-react
import { GlobeIcon } from "lucide-react"; // Updated for lucide-react
import { Languages } from "lucide-react"; // Updated for lucide-react
import { MailIcon } from "lucide-react"; // Updated for lucide-react

const Personal_Information: React.FC = () => {
  return (
    <div>
      <h1 className="flex justify-center mt-10 text-xl uppercase">
        Personal Information
      </h1>
      <p className="mb-10 text-xs text-center">
        Manage your information including phone numbers and email address where you can be contacted
      </p>
      <div className="flex justify-center">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <Cards_Information title={"Name"} Icon={UserIcon} des={"Jhon Doe"} />
          <Cards_Information title={"Date Of Birth"} Icon={CalendarIcon} des={"07 July 1993"} />
          <Cards_Information title={"Country Region"} Icon={GlobeIcon} des={"United Kingdom"} />
          <Cards_Information title={"Language"} Icon={Languages} des={"English (UK) - English"} />
          <Cards_Information title={"Contactable at"} Icon={MailIcon} des={"ah912425@gmail.com"} />
        </div>
      </div>
    </div>
  );
};

export default Personal_Information;
