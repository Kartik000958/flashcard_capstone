import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, FieldArray } from 'formik';
import * as Yup from 'yup';
import { useAppDispatch } from '../../store/hooks';
import { addFlashcard, Term } from '../../store/flashcardSlice';
import { Upload, Trash2, Edit3, Plus, X } from 'lucide-react';

interface FormValues {
  title: string;
  description: string;
  image?: string;
  terms: Array<{
    term: string;
    definition: string;
    image?: string;
  }>;
}

const validationSchema = Yup.object({
  title: Yup.string().required('Group title is required'),
  description: Yup.string().required('Description is required'),
  terms: Yup.array()
    .of(
      Yup.object({
        term: Yup.string().required('Term is required'),
        definition: Yup.string().required('Definition is required'),
      })
    )
    .min(1, 'At least one term is required'),
});

const CreateFlashcard: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [editingTermIndex, setEditingTermIndex] = useState<number | null>(null);

  const initialValues: FormValues = {
    title: '',
    description: '',
    image: '',
    terms: [{ term: '', definition: '', image: '' }],
  };

  const handleSubmit = (values: FormValues) => {
    const flashcard = {
      title: values.title,
      description: values.description,
      image: values.image,
      terms: values.terms.map((term, index) => ({
        id: `term-${Date.now()}-${index}`,
        term: term.term,
        definition: term.definition,
        image: term.image,
      })) as Term[],
    };

    dispatch(addFlashcard(flashcard));
    navigate('/my-flashcards');
  };

  const handleGroupImageUpload = (event: React.ChangeEvent<HTMLInputElement>, setFieldValue: any) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setFieldValue('image', imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTermImageUpload = (event: React.ChangeEvent<HTMLInputElement>, index: number, setFieldValue: any) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setFieldValue(`terms.${index}.image`, imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeGroupImage = (setFieldValue: any) => {
    setFieldValue('image', '');
  };

  const removeTermImage = (index: number, setFieldValue: any) => {
    setFieldValue(`terms.${index}.image`, '');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Flashcard</h1>
        <div className="flex space-x-8 border-b">
          <button className="text-red-600 font-medium pb-2 border-b-2 border-red-600">
            Create New
          </button>
          <button className="text-gray-500 font-medium pb-2">
            My Flashcard
          </button>
        </div>
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, setFieldValue }) => (
          <Form className="space-y-8">
            {/* Main Flashcard Form */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Create Group*
                  </label>
                  <Field
                    type="text"
                    name="title"
                    placeholder="Enter group title"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                  {errors.title && touched.title && (
                    <div className="text-red-500 text-sm mt-1">{errors.title}</div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Image
                  </label>
                  {values.image ? (
                    <div className="relative border-2 border-gray-300 rounded-lg p-2">
                      <img
                        src={values.image}
                        alt="Group"
                        className="w-full h-24 object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() => removeGroupImage(setFieldValue)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleGroupImageUpload(e, setFieldValue)}
                        className="hidden"
                        id="group-image"
                      />
                      <label htmlFor="group-image" className="cursor-pointer">
                        <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                        <span className="text-sm text-blue-600 hover:text-blue-700">
                          Upload Image
                        </span>
                      </label>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Add description*
                </label>
                <Field
                  as="textarea"
                  name="description"
                  rows={4}
                  placeholder="Describe the roles, responsibility, skills required for the job and help candidate understand the role better"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                />
                {errors.description && touched.description && (
                  <div className="text-red-500 text-sm mt-1">{errors.description}</div>
                )}
              </div>
            </div>

            {/* Terms Form */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <FieldArray name="terms">
                {({ push, remove }) => (
                  <div className="space-y-6">
                    {values.terms.map((term, index) => (
                      <div key={index} className="flex items-start space-x-4">
                        <div className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                          {index + 1}
                        </div>

                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Enter Term*
                            </label>
                            <Field
                              type="text"
                              name={`terms.${index}.term`}
                              placeholder="Enter term"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            />
                            {errors.terms?.[index] && touched.terms?.[index] && (
                              <div className="text-red-500 text-sm mt-1">
                                {(errors.terms[index] as any)?.term}
                              </div>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Enter Definition*
                            </label>
                            <Field
                              as="textarea"
                              name={`terms.${index}.definition`}
                              rows={3}
                              placeholder="Enter definition"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                            />
                            {errors.terms?.[index] && touched.terms?.[index] && (
                              <div className="text-red-500 text-sm mt-1">
                                {(errors.terms[index] as any)?.definition}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col space-y-2">
                          {term.image ? (
                            <div className="relative w-20 h-16 border-2 border-gray-300 rounded-lg">
                              <img
                                src={term.image}
                                alt={`Term ${index + 1}`}
                                className="w-full h-full object-cover rounded"
                              />
                              <button
                                type="button"
                                onClick={() => removeTermImage(index, setFieldValue)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                              >
                                <X className="w-2 h-2" />
                              </button>
                            </div>
                          ) : (
                            <div className="w-20 h-16 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleTermImageUpload(e, index, setFieldValue)}
                                className="hidden"
                                id={`term-image-${index}`}
                              />
                              <label htmlFor={`term-image-${index}`} className="cursor-pointer">
                                <span className="text-xs text-blue-600 hover:text-blue-700 text-center">
                                  Select Image
                                </span>
                              </label>
                            </div>
                          )}

                          <div className="flex space-x-1">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingTermIndex(editingTermIndex === index ? null : index);
                                // Focus on the term input
                                setTimeout(() => {
                                  const termInput = document.querySelector(`input[name="terms.${index}.term"]`) as HTMLInputElement;
                                  if (termInput) {
                                    termInput.focus();
                                  }
                                }, 100);
                              }}
                              className="p-1 text-gray-400 hover:text-gray-600"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            {values.terms.length > 1 && (
                              <button
                                type="button"
                                onClick={() => remove(index)}
                                className="p-1 text-red-400 hover:text-red-600"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() => push({ term: '', definition: '', image: '' })}
                      className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add more</span>
                    </button>
                  </div>
                )}
              </FieldArray>
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-red-600 text-white px-8 py-3 rounded-md font-medium hover:bg-red-700 transition-colors"
              >
                Create
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CreateFlashcard;