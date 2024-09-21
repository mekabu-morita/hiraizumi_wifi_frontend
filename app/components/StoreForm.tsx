'use client'; // Ensure it's at the top to mark this as a client component

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Use from 'next/navigation' for Next.js 13+
import { StoreFormData, Category } from '@/types'; // Ensure proper import

const StoreForm: React.FC = () => {
  const [formData, setFormData] = useState<StoreFormData>({
    name: '',
    postal_code: '',
    address: '',
    email: '',
    link: '',
    category_id: 0,
    phone: '',
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionComplete, setSubmissionComplete] = useState(false);

  const router = useRouter(); // Correctly importing the Next.js 13+ router

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost/api/categories');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));

    if (name === 'postal_code' && value.length === 7) {
      fetchAddressFromPostalCode(value);
    }
  };

  const fetchAddressFromPostalCode = async (postalCode: string) => {
    try {
      const response = await fetch(`https://zipcloud.ibsnet.co.jp/api/search?zipcode=${postalCode}`);
      const data = await response.json();
      if (data.results && data.results[0]) {
        const fullAddress = `${data.results[0].address1}${data.results[0].address2}${data.results[0].address3}`;
        setFormData((prevData) => ({ ...prevData, address: fullAddress }));
      }
    } catch (error) {
      console.error('Error fetching address:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost/api/stores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmissionComplete(true);
      } else {
        alert('Failed to register the store.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submissionComplete) {
    return (
      <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
        <h5 className="text-2xl font-bold mb-4">応募が完了しました。</h5>
        <p>ご応募ありがとうございます。トップページへ戻るには、以下のリンクをクリックしてください。</p>
        <button 
          className="mt-4 py-2 px-4 bg-blue-500 text-white font-bold rounded-md"
          onClick={() => router.push('/')} // Navigate to the homepage
        >
          トップページへ戻る
        </button>
      </div>
    );
  }

  // Regular form rendering if submission is not complete
  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
      <h5 className="text-2xl font-bold mb-4">掲載を希望される店舗は下記の情報を入力してください。</h5>

      {/* Store Name */}
      <div className="mb-4">
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Store Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
          className="mt-1 p-2 w-full border border-gray-300 rounded-md"
        />
      </div>

      {/* Postal Code */}
      <div className="mb-4">
        <label htmlFor="postal_code" className="block text-sm font-medium text-gray-700">Postal Code</label>
        <input
          type="text"
          name="postal_code"
          value={formData.postal_code}
          onChange={handleInputChange}
          required
          className="mt-1 p-2 w-full border border-gray-300 rounded-md"
        />
      </div>

      {/* Address */}
      <div className="mb-4">
        <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          className="mt-1 p-2 w-full border border-gray-300 rounded-md"
        />
      </div>

      {/* Email */}
      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          className="mt-1 p-2 w-full border border-gray-300 rounded-md"
        />
      </div>

      {/* Website */}
      <div className="mb-4">
        <label htmlFor="link" className="block text-sm font-medium text-gray-700">Website</label>
        <input
          type="url"
          name="link"
          value={formData.link}
          onChange={handleInputChange}
          className="mt-1 p-2 w-full border border-gray-300 rounded-md"
        />
      </div>

      {/* Phone */}
      <div className="mb-4">
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          className="mt-1 p-2 w-full border border-gray-300 rounded-md"
        />
      </div>

      {/* Category Dropdown */}
      <div className="mb-4">
        <label htmlFor="category_id" className="block text-sm font-medium text-gray-700">Category</label>
        <select
          name="category_id"
          value={formData.category_id}
          onChange={handleInputChange}
          className="mt-1 p-2 w-full border border-gray-300 rounded-md"
        >
          <option value={0}>Select a category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.category_name}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className={`w-full py-2 px-4 font-bold text-white rounded-md ${isSubmitting ? 'bg-gray-500' : 'bg-blue-500 hover:bg-blue-600'}`}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Registering...' : '掲載を申請する'}
      </button>

      <div className="mt-8 text-center">
        <a
          href="/"
          className="bg-blue-500 text-white font-bold py-4 px-8 rounded-lg shadow-md hover:bg-blue-600 transition-all duration-300"
        >
          戻る
        </a>
      </div>
    </form>
  );
};

export default StoreForm;
