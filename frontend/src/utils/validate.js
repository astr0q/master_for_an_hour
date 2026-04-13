export function validateRegister(form) {
  if (!form.first_name.trim()) return 'First name is required';
  if (!form.last_name.trim()) return 'Last name is required';
  if (!form.email.trim()) return 'Email is required';
  if (!form.email.includes('@')) return 'Invalid email address';
  if (!form.password) return 'Password is required';
  if (form.password.length < 4) return 'Password must be at least 4 characters';
  if (!form.role) return 'Role is required';
  return null;
}

export function validateLogin(form) {
  if (!form.email.trim()) return 'Email is required';
  if (!form.password.trim()) return 'Password is required';
  return null;
}

export function validateRequest(form) {
  if (!form.service_id) return 'Please select a service';
  if (!form.address.trim()) return 'Address is required';
  if (form.address.length > 255) return 'Address is too long';
  if (form.description.length > 500) return 'Description is too long (max 500 characters)';
  return null;
}