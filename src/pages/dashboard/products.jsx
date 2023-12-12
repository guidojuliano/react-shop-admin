import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import axios from 'axios';
import endPoints from '@services/api';
import { toast } from 'react-toastify';
import { PlusIcon, TrashIcon, PencilSquareIcon } from '@heroicons/react/24/solid';
import Modal from '@common/Modal';
import FormProduct from '@components/FormProduct';
import { deleteProduct } from '@services/api/products';

export default function Products() {
  const [open, setOpen] = useState(false);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [productIdToDelete, setProductIdToDelete] = useState(null);
  const [products, setProducts] = useState([]);

  const refetchProducts = useCallback(async () => {
    try {
      const response = await axios.get(endPoints.products.getProducts(0, 0));
      setProducts(response.data);
    } catch (error) {
      toast.error('Error fetching products');
    }
  }, []);

  useEffect(() => {
    if (!open) {
      refetchProducts();
    }
  }, [open, refetchProducts]);

  const handleModalClose = () => {
    setOpen(false);
  };

  const handleAddProduct = async () => {
    setOpen(true);
  };

  const handleDelete = (id) => {
    setProductIdToDelete(id);
    setDeleteConfirmationOpen(true);
  };

  const confirmDelete = () => {
    if (productIdToDelete) {
      deleteProduct(productIdToDelete)
        .then(() => {
          toast.success('Product deleted successfully!');
          refetchProducts();
        })
        .catch((error) => {
          console.error('Error deleting product:', error);

          if (error.response && error.response.status === 404) {
            toast.error('Product not found.');
          } else {
            toast.error('An error occurred while deleting the product.');
          }
        })
        .finally(() => {
          setProductIdToDelete(null);
          setDeleteConfirmationOpen(false);
        });
    }
  };

  const cancelDelete = () => {
    setProductIdToDelete(null);
    setDeleteConfirmationOpen(false);
  };

  return (
    <>
      <div className="lg:flex lg:items-center lg:justify-between mb-8">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">List of Products</h2>
        </div>
        <div className="mt-5 flex lg:ml-4 lg:mt-0">
          <span className="sm:ml-3">
            <button
              type="button"
              className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              onClick={handleAddProduct}
            >
              <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
              Add Product
            </button>
          </span>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Edit</span>
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Delete</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products?.map((product) => (
                    <tr key={`Product-item-${product.id}`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            {product.images[0] ? (
                              <img
                                className="h-10 w-10 rounded-full"
                                src={product.images[0]}
                                alt=""
                                onError={(e) => {
                                  e.target.src = '/images/error-image.jpg'; // Mostrar la imagen de error en caso de error de carga
                                }}
                              />
                            ) : (
                              <img className="h-10 w-10 rounded-full" src="/images/error-image.jpg" alt="" />
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{product.title}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{product.category.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">${product.price}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link href={`/dashboard/edit/${product.id}`} className="transition ease-in-out delay-150 text-blue-500 hover:text-indigo-900">
                          <PencilSquareIcon className="h-6 w-6 " />
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <TrashIcon className="h-6 w-6 transition ease-in-out delay-150 text-blue-500 hover:text-indigo-900 cursor-pointer" onClick={() => handleDelete(product.id)} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <Modal open={open} setOpen={setOpen} onModalClose={handleModalClose}>
        <FormProduct setOpen={setOpen} />
      </Modal>
      <Modal open={deleteConfirmationOpen} setOpen={setDeleteConfirmationOpen}>
        <div className="ml-10">
          <p className="text-lg font-semibold mb-4">Are you sure you want to delete this product?</p>
          <div className="flex justify-center">
            <button className="mr-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600" onClick={confirmDelete}>
              Yes
            </button>
            <button className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400" onClick={cancelDelete}>
              No
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
