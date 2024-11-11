import { useState } from 'react';

const AddSubscription = () => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    renewalDate: '',
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  }

  