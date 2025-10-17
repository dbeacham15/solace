"use client";

import { useState, useCallback } from "react";
import Header from "@/components/Header";
import CustomSelect from "@/components/CustomSelect";
import SpecialtiesCell from "@/components/SpecialtiesCell";
import { useDebounce } from "@/hooks/useDebounce";
import { useAdvocates, useUniqueValues } from "@/hooks/useAdvocates";
import type { SortField, SortDirection } from "@/types/advocate";

const ITEMS_PER_PAGE = 10;

export default function Home() {
  // Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [city, setCity] = useState("");
  const [degree, setDegree] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [minYears, setMinYears] = useState("");
  const [maxYears, setMaxYears] = useState("");

  // Pagination and sort state
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  // Debounce search term to avoid excessive API calls (500ms delay)
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Collapsible filters state
  const [filtersExpanded, setFiltersExpanded] = useState(false);

  // Fetch advocates data with React Query
  const {
    advocates,
    pagination,
    isLoading: loading,
    error: queryError,
    prefetchNextPage,
    prefetchPrevPage,
  } = useAdvocates({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    search: debouncedSearchTerm,
    city,
    degree,
    specialty,
    minYears,
    maxYears,
    sortBy: sortField,
    sortDir: sortDirection,
  });

  // Fetch unique values for filter dropdowns
  const { data: uniqueValues } = useUniqueValues();
  const uniqueCities = uniqueValues?.cities || [];
  const uniqueDegrees = uniqueValues?.degrees || [];
  const uniqueSpecialties = uniqueValues?.specialties || [];

  const error = queryError ? (queryError as Error).message : null;

  // Handle filter changes - reset to page 1
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleCityChange = (value: string) => {
    setCity(value);
    setCurrentPage(1);
  };

  const handleDegreeChange = (value: string) => {
    setDegree(value);
    setCurrentPage(1);
  };

  const handleSpecialtyChange = (value: string) => {
    setSpecialty(value);
    setCurrentPage(1);
  };

  const handleMinYearsChange = (value: string) => {
    setMinYears(value);
    setCurrentPage(1);
  };

  const handleMaxYearsChange = (value: string) => {
    setMaxYears(value);
    setCurrentPage(1);
  };

  // Handle sort
  const handleSort = useCallback((field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    setCurrentPage(1);
  }, [sortField]);

  // Handle reset
  const handleReset = useCallback(() => {
    setSearchTerm("");
    setCity("");
    setDegree("");
    setSpecialty("");
    setMinYears("");
    setMaxYears("");
    setSortField(null);
    setSortDirection("asc");
    setCurrentPage(1);
  }, []);

  // Format phone number
  const formatPhoneNumber = (phoneNumber: number): string => {
    const phoneStr = phoneNumber.toString();
    if (phoneStr.length === 10) {
      return `(${phoneStr.slice(0, 3)}) ${phoneStr.slice(3, 6)}-${phoneStr.slice(6)}`;
    }
    return phoneStr;
  };

  // Render sort indicator
  const renderSortIndicator = (field: SortField) => {
    if (sortField !== field) {
      return <span className="text-gray-400 ml-1 inline-block">↕</span>;
    }
    return sortDirection === "asc" ? (
      <span className="ml-1 inline-block">↑</span>
    ) : (
      <span className="ml-1 inline-block">↓</span>
    );
  };

  // Get aria-sort value
  const getAriaSortValue = (field: SortField): "ascending" | "descending" | "none" => {
    if (sortField !== field) return "none";
    return sortDirection === "asc" ? "ascending" : "descending";
  };

  // Check if any filters are active
  const hasActiveFilters = searchTerm || city || degree || specialty || minYears || maxYears;

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <Header />
      <main id="main-content" className="pt-[60px] min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Title */}
          <h1 className="sr-only">Healthcare Advocates Directory</h1>

          {/* Filter Section */}
          <div className="mb-8 bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Find Advocates
            </h2>

            {/* Search Input */}
            <div className={filtersExpanded ? "mb-4" : "mb-0"}>
              <label htmlFor="search-input" className="block text-sm font-medium text-gray-600 mb-2">
                Search
              </label>
              <input
                id="search-input"
                type="text"
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search by name, city, degree, specialty, or experience..."
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                aria-label="Search advocates"
              />
              {searchTerm && searchTerm !== debouncedSearchTerm && (
                <p className="mt-1 text-xs text-gray-500">Searching...</p>
              )}
            </div>

            {/* More Filters Button */}
            <button
              onClick={() => setFiltersExpanded(!filtersExpanded)}
              className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-dark transition-colors mt-4 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg px-2 py-1"
              aria-expanded={filtersExpanded}
              aria-label={filtersExpanded ? "Hide additional filters" : "Show additional filters"}
            >
              <svg
                className={`w-4 h-4 transition-transform duration-200 ${filtersExpanded ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              <span>{filtersExpanded ? "Hide" : "More"} filter options</span>
              {!filtersExpanded && (city || degree || specialty || minYears || maxYears) && (
                <span className="ml-1 px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">
                  {[city, degree, specialty, minYears, maxYears].filter(Boolean).length} active
                </span>
              )}
            </button>

            {/* Collapsible Filter Grid */}
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                filtersExpanded ? "max-h-96 opacity-100 mt-6" : "max-h-0 opacity-0"
              }`}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
              {/* City Filter */}
              <CustomSelect
                id="city-filter"
                label="City"
                value={city}
                onChange={handleCityChange}
                options={uniqueCities}
                placeholder="All Cities"
              />

              {/* Degree Filter */}
              <CustomSelect
                id="degree-filter"
                label="Degree"
                value={degree}
                onChange={handleDegreeChange}
                options={uniqueDegrees}
                placeholder="All Degrees"
              />

              {/* Specialty Filter */}
              <CustomSelect
                id="specialty-filter"
                label="Specialty"
                value={specialty}
                onChange={handleSpecialtyChange}
                options={uniqueSpecialties}
                placeholder="All Specialties"
              />

              {/* Years Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Years of Experience
                </label>
                <div className="flex gap-3">
                  <input
                    type="number"
                    value={minYears}
                    onChange={(e) => handleMinYearsChange(e.target.value)}
                    placeholder="Min"
                    min="0"
                    className="w-1/2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    aria-label="Minimum years of experience"
                  />
                  <input
                    type="number"
                    value={maxYears}
                    onChange={(e) => handleMaxYearsChange(e.target.value)}
                    placeholder="Max"
                    min="0"
                    className="w-1/2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    aria-label="Maximum years of experience"
                  />
                </div>
              </div>

              {/* Reset Button inside collapsible section */}
              <div className="pt-2">
                <button
                  onClick={handleReset}
                  className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed font-medium text-sm"
                  disabled={!hasActiveFilters}
                  aria-label="Reset all filters"
                >
                  Reset Filters
                </button>
              </div>
            </div>
            </div>

            {/* Results Count (always visible) */}
            {pagination && !filtersExpanded && (
              <div className="flex items-center justify-end pt-4">
                <p className="text-sm text-gray-600 font-medium">
                  {pagination.totalCount} {pagination.totalCount === 1 ? "result" : "results"}
                </p>
              </div>
            )}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12" role="status" aria-live="polite">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary" aria-hidden="true"></div>
              <p className="mt-4 text-gray-600">Loading advocates...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6" role="alert" aria-live="assertive">
              <p className="text-red-800">
                <strong>Error:</strong> {error}
              </p>
            </div>
          )}

          {/* Table Section */}
          {!loading && !error && (
            <>
              {advocates.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-gray-600 text-lg">
                    No advocates found matching your filter criteria.
                  </p>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto bg-white rounded-xl border border-gray-200 shadow-sm">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors select-none"
                            onClick={() => handleSort("firstName")}
                            aria-sort={getAriaSortValue("firstName")}
                          >
                            <span className="flex items-center justify-between">
                              <span>First Name</span>
                              {renderSortIndicator("firstName")}
                            </span>
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors select-none"
                            onClick={() => handleSort("lastName")}
                            aria-sort={getAriaSortValue("lastName")}
                          >
                            <span className="flex items-center justify-between">
                              <span>Last Name</span>
                              {renderSortIndicator("lastName")}
                            </span>
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors select-none"
                            onClick={() => handleSort("city")}
                            aria-sort={getAriaSortValue("city")}
                          >
                            <span className="flex items-center justify-between">
                              <span>City</span>
                              {renderSortIndicator("city")}
                            </span>
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                          >
                            Degree
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                          >
                            Specialties
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors select-none"
                            onClick={() => handleSort("yearsOfExperience")}
                            aria-sort={getAriaSortValue("yearsOfExperience")}
                          >
                            <span className="flex items-center justify-between">
                              <span>Years of Experience</span>
                              {renderSortIndicator("yearsOfExperience")}
                            </span>
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                          >
                            Phone Number
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-100">
                        {advocates.map((advocate, index) => (
                          <tr
                            key={advocate.id || index}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
                              {advocate.firstName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
                              {advocate.lastName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                              {advocate.city}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                              {advocate.degree}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              <SpecialtiesCell specialties={advocate.specialties} />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                              {advocate.yearsOfExperience}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                              {formatPhoneNumber(advocate.phoneNumber)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  {pagination && pagination.totalPages > 1 && (
                    <div className="mt-6 flex items-center justify-between flex-wrap gap-4">
                      <div className="text-sm text-gray-600">
                        Showing {((pagination.page - 1) * pagination.limit) + 1} to{" "}
                        {Math.min(pagination.page * pagination.limit, pagination.totalCount)} of{" "}
                        {pagination.totalCount} advocates
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                          onMouseEnter={prefetchPrevPage}
                          disabled={currentPage === 1}
                          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:outline-none transition-colors"
                          aria-label="Previous page"
                        >
                          Previous
                        </button>
                        <div className="flex gap-2">
                          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => {
                            // Show first, last, current, and pages around current
                            if (
                              page === 1 ||
                              page === pagination.totalPages ||
                              (page >= currentPage - 1 && page <= currentPage + 1)
                            ) {
                              return (
                                <button
                                  key={page}
                                  onClick={() => setCurrentPage(page)}
                                  className={`px-4 py-2 text-sm font-medium rounded-lg focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:outline-none transition-colors ${
                                    currentPage === page
                                      ? "bg-primary text-white shadow-sm"
                                      : "text-gray-700 bg-white border border-gray-200 hover:bg-gray-50"
                                  }`}
                                  aria-label={`Go to page ${page}`}
                                  aria-current={currentPage === page ? "page" : undefined}
                                >
                                  {page}
                                </button>
                              );
                            } else if (page === currentPage - 2 || page === currentPage + 2) {
                              return (
                                <span key={page} className="px-2 py-2 text-gray-500">
                                  ...
                                </span>
                              );
                            }
                            return null;
                          })}
                        </div>
                        <button
                          onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
                          onMouseEnter={prefetchNextPage}
                          disabled={currentPage === pagination.totalPages}
                          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:outline-none transition-colors"
                          aria-label="Next page"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </main>
    </>
  );
}
