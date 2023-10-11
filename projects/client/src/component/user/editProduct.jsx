import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useParams } from 'react-router-dom';

export default function EditProduct({ onSubmit, product }) {
  const token = useSelector((state) => state.auth.token);
  const [image, setImage] = useState('');
  const [categories, setCategories] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/product/category', {
        });
        setCategories(res.data.data);
      } catch (error) {
        console.error('Error fetching categories:', error.response.data);
      }
    };

    fetchCategories();
  }, [token]);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (values, { setSubmitting, setStatus }) => {
    const { name, price, category, description, stock } = values;

    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    formData.append('category_id', category);
    formData.append('description', description);
    formData.append('stock', stock);
    if (image) {
      formData.append('file', image);
    }
    

    try {
      const res = await axios.patch(`http://localhost:8000/api/user/product/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Response:', res.data);

      values.name = '';
      values.price = '';
      values.category = '';
      values.description = '';
      values.stock = '';

      setImage('');
      setStatus({ success: true, message: 'Successfully updated the product.' });
      onSubmit();
    } catch (error) {
      console.error('Error:', error.response.data);
      setStatus({ success: false, message: 'Failed to update the product.' });
    } finally {
      setSubmitting(false);
    }
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string()
    .max(50, 'Name must not exceed 50 characters'),
    price: Yup.number()
    .max(1000000000, 'Price must not exceed 1,000,000,000')
    .typeError('Price must be a valid number'),
    description: Yup.string()
    .max(200, 'Description must not exceed 200 characters'),
    stock: Yup.number()
    .max(999, 'Stock must not exceed 999')
    .typeError('Stock must be a valid number'),
  });

  const initialValues = {
    name: '',
    price: '',
    category: '',
    description: '',
    stock: '',
  };

  const handleProductStatus = async (isActive) => {
    const statusAction = isActive ? 'deactivate' : 'activate';

    try {
      await axios.patch(
        `http://localhost:8000/api/product/status/${statusAction}/${id}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(`Product ${statusAction}d successfully`);
      onSubmit();
    } catch (error) {
      console.error('Error:', error.response.data);
    }
  };

  return (
    <div className='p-2 flex '>
      <div className='w-full grid justify-center mt-2'>
        <div className='w-full h-auto grid grid-flow-row justify-center'>
          <button
            type='submit'
            className='w-full py-2 text-xs font-josefin tracking-wide border bg-darkgreen text-flashwhite hover:bg-white hover:text-darkgreen hover:border-darkgreen'
            onClick={() => handleProductStatus(product?.isActive)}
          >
            {product?.isActive ? 'Deactive' : 'Active'}
          </button>
          <div className='mt-6'>
            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
              {({ isSubmitting, status, values }) => (
                <Form>
                  <div className='grid grid-flow-row gap-1 justify-center'>
                    {status && status.success && (
                      <p className='text-center text-greenn'>{status.message}</p>
                    )}
                    {status && !status.success && (
                      <p className='text-center text-redd'>{status.message}</p>
                    )}
                    <h3 className='text-xs text-center font-josefin mb-4 text-jetblack tracking-wide'>Change the product information:</h3>
                    <div className='w-full grid grid-flow-row gap-3'>
                      <div className='font-ysa relative mt-4'>
                        <ErrorMessage name='name' component='div' className='text-redd text-xs absolute -top-5' />
                        <Field className='border border-gray-300 h-6 text-xs w-full focus:border-darkgreen focus:ring-0' type='text' name='name' placeholder='Name' />
                      </div>
                      <div className='font-ysa relative mt-4'>
                        <ErrorMessage name='price' component='div' className='text-redd text-xs absolute -top-5' />
                        <Field className='border border-gray-300 h-6 text-xs w-full focus:border-darkgreen focus:ring-0' type='text' name='price' placeholder='Price' />
                      </div>
                      <div className='font-ysa relative mt-4'>
                        <ErrorMessage name='category' component='div' className='text-redd text-xs absolute -top-5' />
                        <Field as='select' className='border border-gray-300 h-6 py-0 text-xs w-full focus:border-darkgreen focus:ring-0' name='category'>
                          <option value=''>Select Category</option>
                          {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </Field>
                      </div>
                      <div className='font-ysa relative mt-4'>
                        <ErrorMessage name='description' component='div' className='text-redd text-xs absolute -top-5' />
                        <Field className='border border-gray-300 h-6 text-xs w-full focus:border-darkgreen focus:ring-0' type='text' name='description' placeholder='Description' />
                      </div>
                      <div className='font-ysa relative mt-4'>
                        <ErrorMessage name='stock' component='div' className='text-redd text-xs absolute -top-5' />
                        <Field className='border border-gray-300 h-6 text-xs w-full focus:border-darkgreen focus:ring-0' type='text' name='stock' placeholder='Stock' />
                      </div>
                      <label className='font-ysa relative text-jetblack'>Image:</label>
                      <input className='border border-gray-300 h-10 text-xs w-full focus:border-darkgreen focus:ring-0' type='file' onChange={handleImageChange} />
                    </div>
                    <button type='submit' className='w-full py-2 text-xs font-josefin tracking-wide border bg-darkgreen text-flashwhite hover:bg-white hover:text-darkgreen hover:border-darkgreen'>
                      Save Changes
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
}
