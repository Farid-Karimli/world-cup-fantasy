import submissions from '@/assets/submissions.json';
import { SubmissionsData } from '@/types';

export function getSubmissions(): SubmissionsData {
  return submissions as SubmissionsData;
}
