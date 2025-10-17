import { Card, Badge, Pagination } from '@/components';
import { Advocate, SortField, SortDirection } from '@/types/advocate';
import { SortableHeader } from './SortableHeader';

interface AdvocatesTableProps {
  advocates: Advocate[];
  sortField: SortField | null;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
}

export function AdvocatesTable({
  advocates,
  sortField,
  sortDirection,
  onSort,
  currentPage,
  totalPages,
  itemsPerPage,
  totalItems,
  onPageChange,
  onItemsPerPageChange,
}: AdvocatesTableProps) {
  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="sticky top-0 z-10 bg-healthcare-neutral-50">
            <tr className="border-b border-healthcare-neutral-200 bg-healthcare-neutral-50">
              <SortableHeader
                field="firstName"
                label="Name"
                currentSortField={sortField}
                currentSortDirection={sortDirection}
                onSort={onSort}
              />
              <SortableHeader
                field="city"
                label="Location"
                currentSortField={sortField}
                currentSortDirection={sortDirection}
                onSort={onSort}
              />
              <SortableHeader
                field="degree"
                label="Credentials"
                currentSortField={sortField}
                currentSortDirection={sortDirection}
                onSort={onSort}
              />
              <th className="px-6 py-4 text-left text-sm font-semibold text-healthcare-neutral-900">
                Specialties
              </th>
              <SortableHeader
                field="yearsOfExperience"
                label="Experience"
                currentSortField={sortField}
                currentSortDirection={sortDirection}
                onSort={onSort}
              />
              <th className="px-6 py-4 text-left text-sm font-semibold text-healthcare-neutral-900">
                Contact
              </th>
            </tr>
          </thead>
          <tbody>
            {advocates.map((advocate, index) => (
              <tr
                key={index}
                className="border-b border-healthcare-neutral-100 hover:bg-healthcare-primary-50 transition-colors duration-150"
              >
                <td className="px-6 py-4">
                  <div className="font-medium text-healthcare-primary-900">
                    {advocate.firstName} {advocate.lastName}
                  </div>
                </td>
                <td className="px-6 py-4 text-healthcare-neutral-700">
                  {advocate.city}
                </td>
                <td className="px-6 py-4">
                  <Badge variant="primary" size="sm">
                    {advocate.degree}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-2">
                    {advocate.specialties.map((specialty, idx) => (
                      <Badge key={idx} variant="secondary" size="sm">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 text-healthcare-neutral-700">
                  {advocate.yearsOfExperience} {advocate.yearsOfExperience === 1 ? 'year' : 'years'}
                </td>
                <td className="px-6 py-4">
                  <a
                    href={`tel:${advocate.phoneNumber}`}
                    className="text-healthcare-primary-600 hover:text-healthcare-primary-700 hover:underline font-medium"
                    aria-label={`Call ${advocate.firstName} ${advocate.lastName} at ${advocate.phoneNumber}`}
                  >
                    {advocate.phoneNumber}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        itemsPerPage={itemsPerPage}
        totalItems={totalItems}
        onItemsPerPageChange={onItemsPerPageChange}
      />
    </Card>
  );
}
