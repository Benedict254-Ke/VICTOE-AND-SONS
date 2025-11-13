import { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';
import api from '../admin/utils/api';

interface Service {
  _id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  icon: string;
  price_ksh?: number;
  featured?: boolean;
  createdAt: string;
}

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await api.get('/services');
      setServices(response.data);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (iconName: string) => {
    const Icon = (Icons as any)[iconName] || Icons.FileText;
    return Icon;
  };

  if (loading) {
    return (
      <section id="services" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading services...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="services" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Our Expertise
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Premium Services - Enterprise-grade solutions tailored for your success
          </p>
        </div>

        {services.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No services available at the moment.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => {
              const Icon = getIcon(service.icon);

              return (
                <div
                  key={service._id}
                  className="bg-white rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
                >
                  <div className="flex items-start space-x-4">
                    <div className="p-3 rounded-lg bg-blue-500 bg-opacity-10 flex-shrink-0">
                      <Icon className="w-6 h-6 text-blue-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {service.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                        {service.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                          {service.category}
                        </span>
                        {service.price_ksh && (
                          <span className="text-blue-600 font-bold text-sm">
                            KSH {service.price_ksh.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-16 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl p-8 md:p-12 text-white">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl font-bold mb-4">Government Services Hub</h3>
              <p className="text-blue-50 text-lg leading-relaxed">
                Complete assistance with eCitizen, KRA, NTSA, and all government portals. Fast, reliable, and professional service guaranteed.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm">
                <Icons.ShieldCheck className="w-8 h-8 mb-2" />
                <div className="font-bold text-lg">Secure</div>
                <div className="text-sm text-blue-50">100% Safe</div>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm">
                <Icons.Zap className="w-8 h-8 mb-2" />
                <div className="font-bold text-lg">Fast</div>
                <div className="text-sm text-blue-50">Same Day</div>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm">
                <Icons.Award className="w-8 h-8 mb-2" />
                <div className="font-bold text-lg">Quality</div>
                <div className="text-sm text-blue-50">Premium</div>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm">
                <Icons.Users className="w-8 h-8 mb-2" />
                <div className="font-bold text-lg">Support</div>
                <div className="text-sm text-blue-50">24/7 Help</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
