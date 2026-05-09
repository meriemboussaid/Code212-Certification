const API_ORIGIN = 'http://localhost:8000';

export function getPhotoUrl(photo) {
  if (!photo) return '';
  if (photo.startsWith('http://') || photo.startsWith('https://')) return photo;
  return `${API_ORIGIN}/storage/${photo}`;
}
