import { useState } from 'react';
import useFetch from '@hooks/useFetch';
import endPoints from '@services/api';
import Paginate from '@components/Paginate';
import { toast } from 'react-toastify';
import { Chart } from '@common/Chart';

export default function Dashboard() {
  const PRODUCT_LIMIT = 5;
  const [offsetProducts, setOffsetProducts] = useState(1);

  const { data: products, loading, error } = useFetch(endPoints.products.getProducts(PRODUCT_LIMIT, offsetProducts), offsetProducts);
  const totalProducts = useFetch(endPoints.products.getProducts(0, 0)).data?.length || 0;
  const allProducts = useFetch(endPoints.products.getProducts(0, 0)).data;

  const categoryNames = allProducts?.map((product) => product.category);
  const categoryCount = categoryNames?.map((category) => category.name);

  const countOccurrences = (arr) => {
    if (!arr) {
      // Manejar el caso en que arr es undefined
      return {};
    }

    return arr.reduce((prev, curr) => ((prev[curr] = ++prev[curr] || 1), prev), {});
  };

  const data = {
    datasets: [
      {
        label: 'Categories',
        data: countOccurrences(categoryCount),
        borderWidth: 2,
        backgroundColor: ['#ffbb11', '#fc03ec', '#04b507', '#fc032d', '#2a71d0'],
      },
    ],
  };

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (error) {
    return toast.error('Error');
  }

  return (
    <>
      <Chart className="mb-8 mt-2" chartData={data} />
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
                    </tr>
                  ))}
                </tbody>
              </table>

              {totalProducts > 0 && <Paginate totalItems={totalProducts} itemsPerPage={PRODUCT_LIMIT} setOffset={setOffsetProducts} neighbours={3}></Paginate>}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
