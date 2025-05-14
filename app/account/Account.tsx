"use client";
import { BACKEND_URL } from "@/constant/apiUrl";
import TranslatedText from "@/lang/TranslatedText";
import { cn } from "@/lib/utils";
import { GlobeIcon, Languages, Mail, UserIcon } from "lucide-react"; // Importing lucide-react icons
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Cards_Information from "./components/Cards_Information";
import Courses_Selected from "./components/Courses_Selected";
import Personal_Information from "./components/Personal_Information";

interface UserData {
  name: string;
  status: string;
  email: string;
}

const Account: React.FC = () => {
  const router = useRouter();
  const [select, setSelect] = useState<string>("Personal_Information");
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [currentComponent, setCurrentComponent] = useState<React.ReactNode>(
    <Personal_Information />
  );
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token"); // Retrieve token

      if (!token) {
        router.push("/sign-in"); // Redirect if token is missing
        return;
      }

      try {
        const response = await fetch(`${BACKEND_URL}/user`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [router]);

  const handleSelect = (newSelection: string) => {
    setIsAnimating(true);

    setTimeout(() => {
      setSelect(newSelection);
      setCurrentComponent(
        newSelection === "Personal_Information" ? (
          <Personal_Information />
        ) : (
          <Courses_Selected />
        )
      );
      setIsAnimating(false);
    }, 300);
  };

  return (
    <div>
      <div className="flex justify-center gap-4 mb-6 select-none text-sm">
        <div className="flex items-center p-1 mt-20 text-white rounded-full md:p-2 md:px-4 bg-primary">
          <div
            onClick={() => handleSelect("Personal_Information")}
            className={cn(
              "p-1 px-2 cursor-pointer",
              select === "Personal_Information" &&
                "border-primary rounded-full text-white transition-all delay-200"
            )}
          >
            <TranslatedText ns="common" textKey="personal_info.tab" />
          </div>
        </div>
      </div>

      {userData && (
        <div className="text-primary">
          <h1 className="flex justify-center mt-10 text-xl uppercase">
            <TranslatedText ns="common" textKey="personal_info.title" />
          </h1>
          <p className="mb-10 text-xs text-center">
            <TranslatedText ns="common" textKey="personal_info.description" />
          </p>
          <div className="flex justify-center">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3 mb-10 text-base">
              <Cards_Information
                title={
                  <TranslatedText ns="common" textKey="personal_info.name" />
                }
                Icon={UserIcon}
                des={userData.name}
              />
              <Cards_Information
                title={
                  <TranslatedText ns="common" textKey="personal_info.status" />
                }
                Icon={GlobeIcon}
                des={userData.status}
              />
              <Cards_Information
                title={
                  <TranslatedText
                    ns="common"
                    textKey="personal_info.language"
                  />
                }
                Icon={Languages}
                des={"English (UK) - English"}
              />
              <Cards_Information
                title={
                  <TranslatedText ns="common" textKey="personal_info.contact" />
                }
                Icon={Mail}
                des={userData.email}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Account;
