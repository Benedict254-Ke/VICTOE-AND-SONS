import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

interface Booking {
  _id: string;
  fullName: string;
  phoneNumber: string;
  serviceName: string;
  preferredDate: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  bookingDate: string;
  additionalNotes?: string;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    users: 0,
    courses: 0,
    services: 0,
    enrollments: 0,
    bookings: 0
  });
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, coursesRes, servicesRes, enrollmentsRes, bookingsRes] = await Promise.all([
          api.get('/users'),
          api.get('/courses'),
          api.get('/services'),
          api.get('/enrollments'),
          api.get('/bookings')
        ]);

        const bookings = bookingsRes.data;
        const recentBookings = bookings
          .sort((a: Booking, b: Booking) => new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime())
          .slice(0, 5);

        setStats({
          users: usersRes.data.length,
          courses: coursesRes.data.length,
          services: servicesRes.data.length,
          enrollments: enrollmentsRes.data.length,
          bookings: bookings.length
        });
        setRecentBookings(recentBookings);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const updateBookingStatus = async (id: string, status: string) => {
    try {
      await api.put(`/bookings/${id}`, { status });
      // Refresh data
      const response = await api.get('/bookings');
      const bookings = response.data;
      const recentBookings = bookings
        .sort((a: Booking, b: Booking) => new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime())
        .slice(0, 5);
      setRecentBookings(recentBookings);
      setStats(prev => ({ ...prev, bookings: bookings.length }));
    } catch (error) {
      console.error('Error updating booking:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Total Users</h3>
          <p className="text-2xl font-bold text-indigo-600">{stats.users}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Total Courses</h3>
          <p className="text-2xl font-bold text-green-600">{stats.courses}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Total Services</h3>
          <p className="text-2xl font-bold text-blue-600">{stats.services}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Total Enrollments</h3>
          <p className="text-2xl font-bold text-purple-600">{stats.enrollments}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Total Bookings</h3>
          <p className="text-2xl font-bold text-orange-600">{stats.bookings}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">System Status</h3>
          <p className="text-lg font-semibold text-green-600">Online</p>
        </div>
      </div>

      {/* Recent Bookings Section */}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Recent Bookings</h2>
          <Link
            to="/admin/bookings"
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            View All →
          </Link>
        </div>
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Preferred Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentBookings.map((booking) => (
                <tr key={booking._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{booking.fullName}</div>
                    <div className="text-sm text-gray-500">{booking.phoneNumber}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{booking.serviceName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(booking.preferredDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      {booking.status === 'pending' && (
                        <>
                          <button
                            onClick={() => updateBookingStatus(booking._id, 'confirmed')}
                            className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => updateBookingStatus(booking._id, 'cancelled')}
                            className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {booking.status === 'confirmed' && (
                        <button
                          onClick={() => updateBookingStatus(booking._id, 'completed')}
                          className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          Complete
                        </button>
                      )}
                      {booking.status === 'completed' && (
                        <span className="text-green-600 font-semibold">Completed</span>
                      )}
                      {booking.status === 'cancelled' && (
                        <span className="text-red-600 font-semibold">Rejected</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {recentBookings.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No recent bookings.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;