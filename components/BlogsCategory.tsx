"use client";
import React, { useState, KeyboardEvent, ChangeEvent } from "react";
import { Search } from "lucide-react";
import BLogsCardCategory from "./BLogsCardCategory";
import { t } from "i18next";

interface BlogCategory {
  slug: string;
  image: string;
  name: string;
  number_of_blogs: number;
}

interface BlogsCategoryProps {
  category: BlogCategory[];
}

const BlogsCategory: React.FC<BlogsCategoryProps> = ({ category }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCategory, setFilteredCategory] = useState<BlogCategory[]>(category);

  const handleSearch = () => {
    const filtered = category.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCategory(filtered);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="flex flex-col mx-4 md:mx-0 items-center mt-10 mb-10 text-base">
      {/* Search Filter */}
      <div className="w-full max-w-[600px] flex items-center bg-[#f8f8f8] rounded-lg shadow-md p-2 mb-6 border-[1.5px] border-[#e0e0e0]">
        <input
          type="text"
          placeholder={t("consultation.search")}
          value={searchTerm}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className="flex-grow p-2 text-primary rounded-md border-none outline-none bg-transparent"
        />
        <button
          onClick={handleSearch}
          className="bg-[#FBBA07] text-white p-2 px-4 rounded-lg flex items-center justify-center shadow-sm hover:bg-[#f8c63d] transition-all"
        >
          <Search />
        </button>
      </div>

      {/* Mapped Cards */}
      <div className="flex flex-wrap justify-center gap-4">
        {filteredCategory.map((list, index) => (
          <BLogsCardCategory key={index} list={list} index={index} />
        ))}
      </div>
    </div>
  );
};

export default BlogsCategory;
