"use client";

import { useEffect, useRef } from "react";
import { Card, Pagination } from "@/components";
import {
  Header,
  FilterSection,
  ResultsCount,
  ActiveFilters,
  AdvocatesTable,
  AdvocateCard,
  LoadingState,
  EmptyState,
} from "@/components/advocates";
import { useAdvocates } from "@/hooks/useAdvocates";
import { useAdvocateFilters } from "@/hooks/useAdvocateFilters";
import { useSorting } from "@/hooks/useSorting";
import { usePagination } from "@/hooks/usePagination";

export default function Home() {
  // Filter management
  const {
    filters,
    hasActiveFilters,
    nameSearch,
    setNameSearch,
    selectedCities,
    setSelectedCities,
    selectedDegrees,
    setSelectedDegrees,
    selectedSpecialties,
    setSelectedSpecialties,
    minExperience,
    setMinExperience,
    maxExperience,
    setMaxExperience,
    resetFilters,
  } = useAdvocateFilters();

  // Sorting management
  const { sortField, sortDirection, handleSort, resetSort } = useSorting();

  // Pagination management
  const { currentPage, itemsPerPage, handlePageChange, handleItemsPerPageChange, resetToFirstPage } = usePagination(10);

  // Data fetching with server-side pagination, filtering, and sorting
  const {
    advocates,
    isLoading,
    totalCount,
    totalPages,
    allCities,
    allDegrees,
    allSpecialties,
    experienceRange,
  } = useAdvocates({
    page: currentPage,
    limit: itemsPerPage,
    sortField,
    sortDirection,
    filters,
  });

  // Track previous filter/sort state to reset pagination
  const prevFiltersRef = useRef({
    nameSearch,
    selectedCitiesLength: selectedCities.length,
    selectedDegreesLength: selectedDegrees.length,
    selectedSpecialtiesLength: selectedSpecialties.length,
    minExperience,
    maxExperience,
    sortField,
    sortDirection,
  });

  // Reset to first page when filters or sorting change
  useEffect(() => {
    const prev = prevFiltersRef.current;
    const hasFilterChanged =
      prev.nameSearch !== nameSearch ||
      prev.selectedCitiesLength !== selectedCities.length ||
      prev.selectedDegreesLength !== selectedDegrees.length ||
      prev.selectedSpecialtiesLength !== selectedSpecialties.length ||
      prev.minExperience !== minExperience ||
      prev.maxExperience !== maxExperience ||
      prev.sortField !== sortField ||
      prev.sortDirection !== sortDirection;

    if (hasFilterChanged) {
      resetToFirstPage();
      prevFiltersRef.current = {
        nameSearch,
        selectedCitiesLength: selectedCities.length,
        selectedDegreesLength: selectedDegrees.length,
        selectedSpecialtiesLength: selectedSpecialties.length,
        minExperience,
        maxExperience,
        sortField,
        sortDirection,
      };
    }
  }, [nameSearch, selectedCities.length, selectedDegrees.length, selectedSpecialties.length, minExperience, maxExperience, sortField, sortDirection, resetToFirstPage]);

  // Handle reset all
  const handleResetAll = () => {
    resetFilters();
    resetSort();
  };

  // Active filter removal handlers
  const handleRemoveCityFilter = (city: string) => {
    setSelectedCities(selectedCities.filter(c => c !== city));
  };

  const handleRemoveDegreeFilter = (degree: string) => {
    setSelectedDegrees(selectedDegrees.filter(d => d !== degree));
  };

  const handleRemoveSpecialtyFilter = (specialty: string) => {
    setSelectedSpecialties(selectedSpecialties.filter(s => s !== specialty));
  };

  const handleRemoveExperienceFilter = () => {
    setMinExperience(null);
    setMaxExperience(null);
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Header />

      <main className="flex-1 overflow-y-auto bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Page Title Section */}
          <div className="mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold text-healthcare-primary-900 mb-3 font-heading">
              Healthcare Advocates Directory
            </h1>
            <p className="text-lg text-healthcare-neutral-600">
              Find the right healthcare advocate for your needs
            </p>
          </div>

          {/* Filter Section */}
          <FilterSection
            nameSearch={nameSearch}
            onNameSearchChange={setNameSearch}
            selectedCities={selectedCities}
            onSelectedCitiesChange={setSelectedCities}
            selectedDegrees={selectedDegrees}
            onSelectedDegreesChange={setSelectedDegrees}
            selectedSpecialties={selectedSpecialties}
            onSelectedSpecialtiesChange={setSelectedSpecialties}
            minExperience={minExperience}
            onMinExperienceChange={setMinExperience}
            maxExperience={maxExperience}
            onMaxExperienceChange={setMaxExperience}
            uniqueCities={allCities}
            uniqueDegrees={allDegrees}
            uniqueSpecialties={allSpecialties}
            experienceRange={experienceRange}
            onReset={handleResetAll}
            hasActiveFilters={hasActiveFilters}
          />

          {/* Loading State */}
          {isLoading && <LoadingState />}

          {/* Results Count and Active Filters */}
          {!isLoading && (
            <div className="mb-4">
              <ResultsCount filteredCount={totalCount} totalCount={totalCount} />
              <ActiveFilters
                filters={filters}
                experienceRange={experienceRange}
                onRemoveNameFilter={() => setNameSearch("")}
                onRemoveCityFilter={handleRemoveCityFilter}
                onRemoveDegreeFilter={handleRemoveDegreeFilter}
                onRemoveSpecialtyFilter={handleRemoveSpecialtyFilter}
                onRemoveExperienceFilter={handleRemoveExperienceFilter}
              />
            </div>
          )}

          {/* Advocates Table - Desktop */}
          {!isLoading && advocates.length > 0 && (
            <div className="hidden sm:block">
              <AdvocatesTable
                advocates={advocates}
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
                currentPage={currentPage}
                totalPages={totalPages}
                itemsPerPage={itemsPerPage}
                totalItems={totalCount}
                onPageChange={handlePageChange}
                onItemsPerPageChange={handleItemsPerPageChange}
              />
            </div>
          )}

          {/* Advocates Cards - Mobile */}
          {!isLoading && advocates.length > 0 && (
            <>
              <div className="sm:hidden space-y-4">
                {advocates.map((advocate, index) => (
                  <AdvocateCard key={index} advocate={advocate} />
                ))}
              </div>
              <div className="sm:hidden mt-4">
                <Card>
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    itemsPerPage={itemsPerPage}
                    totalItems={totalCount}
                    onItemsPerPageChange={handleItemsPerPageChange}
                  />
                </Card>
              </div>
            </>
          )}

          {/* Empty State */}
          {!isLoading && advocates.length === 0 && <EmptyState onReset={handleResetAll} />}
        </div>
      </main>
    </div>
  );
}
