import { Card, CardContent, Badge } from '@/components';
import { Advocate } from '@/types/advocate';

interface AdvocateCardProps {
  advocate: Advocate;
}

export function AdvocateCard({ advocate }: AdvocateCardProps) {
  return (
    <Card variant="elevated">
      <CardContent>
        <div className="space-y-3">
          <div>
            <h3 className="text-xl font-semibold text-healthcare-primary-900">
              {advocate.firstName} {advocate.lastName}
            </h3>
            <p className="text-healthcare-neutral-600 mt-1">{advocate.city}</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-healthcare-neutral-700">Credentials:</span>
            <Badge variant="primary" size="sm">
              {advocate.degree}
            </Badge>
          </div>

          <div>
            <span className="text-sm font-medium text-healthcare-neutral-700 block mb-2">
              Specialties:
            </span>
            <div className="flex flex-wrap gap-2">
              {advocate.specialties.map((specialty, idx) => (
                <Badge key={idx} variant="secondary" size="sm">
                  {specialty}
                </Badge>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-healthcare-neutral-200">
            <div className="flex justify-between items-center">
              <span className="text-sm text-healthcare-neutral-700">
                {advocate.yearsOfExperience} {advocate.yearsOfExperience === 1 ? 'year' : 'years'} experience
              </span>
              <a
                href={`tel:${advocate.phoneNumber}`}
                className="text-healthcare-primary-600 hover:text-healthcare-primary-700 font-medium"
                aria-label={`Call ${advocate.firstName} ${advocate.lastName} at ${advocate.phoneNumber}`}
              >
                {advocate.phoneNumber}
              </a>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
