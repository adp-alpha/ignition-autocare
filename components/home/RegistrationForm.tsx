'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegistrationForm() {
  const [registration, setRegistration] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (registration) {
      router.push(`/service/${registration.toUpperCase()}`);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={registration}
        onChange={(e) => setRegistration(e.target.value)}
        placeholder="Enter registration"
        className="border p-2"
      />
      <button type="submit" className="bg-blue-500 text-white p-2">
        Go
      </button>
    </form>
  );
}
