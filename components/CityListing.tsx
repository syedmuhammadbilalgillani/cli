"use client";
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import TranslatedText from "../lang/TranslatedText";
import { Search } from "lucide-react";
// import { CiSearch } from "react-icons/ci";

// Define types for the City object and props
interface City {
  id: string;
  name: string;
  slug: string;
}

interface CityListingProps {
  cities: City[];
}

export default function CityListing({ cities }: CityListingProps) {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredCities, setFilteredCities] = useState<City[]>(cities || []);

  // Search handler function
  const handleSearch = () => {
    const filtered = cities.filter((city) =>
      city.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCities(filtered);
  };

  return (
    <div className="w-screen md:w-[900px] overflow-hidden bg-white rounded-md shadow-md p-4 space-y-4">
      {/* Search Bar */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Search by city title"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow text-primary px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button
          onClick={handleSearch}
          className="py-3 text-sm w-1/3 md:w-3/12 px-4 text-center items-center flex justify-center text-primary transition rounded-lg bg-secondary hover:bg-secondary/70"
        >
          <Search size={24} color="white" />
        </button>
      </div>

      {/* Table */}
      <Table className="w-full border-collapse">
        <TableHeader>
          <TableRow className="border-b border-gray-200">
            <TableHead
              className="py-3 px-4 text-left text-sm font-semibold text-primary"
              style={{ width: "70%" }}
            >
              <TranslatedText as="h2" ns="common" textKey={"table.citytitle"} />
            </TableHead>
            <TableHead
              className="py-3 px-4 text-center text-sm font-semibold text-primary"
              style={{ width: "30%" }}
            >
              <TranslatedText as="h2" ns="common" textKey={"table.option"} />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredCities.map((city) => (
            <TableRow
              key={city.id}
              className="hover:bg-gray-50 transition-colors"
            >
              <TableCell
                className="py-3 px-4 text-sm font-medium text-primary"
                style={{ width: "70%" }}
              >
                <h3>{city.name} </h3>
              </TableCell>
              <TableCell
                className="py-3 px-4 text-center"
                style={{ width: "30%" }}
              >
                <Link
                  href={`/${city.slug}`}
                  className="px-4 sm:hidden py-2 w-full sm:text-sm text-xs font-medium text-white bg-secondary rounded-md hover:bg-secondary/70 transition-colors"
                >
                  View All
                </Link>
                <Link
                  href={`/${city.slug}`}
                  className="px-4 hidden sm:block py-2 sm:text-sm text-xs font-medium text-white bg-secondary rounded-md hover:bg-secondary/70 transition-colors"
                >
                  <TranslatedText ns="common" textKey={"table.viewall"} />
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
