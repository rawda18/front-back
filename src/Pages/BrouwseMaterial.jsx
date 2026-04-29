import React, { useMemo, useState } from 'react';
import SideBare from '../Components/SlideBare';
import ThemeToggle from '../Components/ThemeToggle';
import { Search, Filter, Package, Boxes, AlertTriangle, Archive } from 'lucide-react';

const materialsData = [
  {
    id: 1,
    name: 'Arduino Uno R3',
    description: 'Microcontroller board for robotics and embedded systems projects.',
    category: 'Electronics',
    quantity: 24,
    location: 'Electronics Lab',
    status: 'available',
  },
  {
    id: 2,
    name: 'Ultrasonic Sensor HC-SR04',
    description: 'Distance measurement sensor commonly used in robotics.',
    category: 'Sensors',
    quantity: 8,
    location: 'Robotics Lab',
    status: 'low-stock',
  },
  {
    id: 3,
    name: 'Raspberry Pi 4',
    description: 'Single-board computer for IoT and advanced lab projects.',
    category: 'Computing',
    quantity: 0,
    location: 'IoT Lab',
    status: 'out-of-stock',
  },
  {
    id: 4,
    name: 'Servo Motor SG90',
    description: 'Small motor used in automation and movement control.',
    category: 'Actuators',
    quantity: 15,
    location: 'Robotics Lab',
    status: 'available',
  },
];

function getStatusLabel(status) {
  if (status === 'available') return 'Available';
  if (status === 'low-stock') return 'Low Stock';
  return 'Out of Stock';
}

export default function BrouwseMaterial() {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredMaterials = useMemo(() => {
    return materialsData.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase()) ||
        item.category.toLowerCase().includes(search.toLowerCase());

      const matchesFilter = activeFilter === 'all' ? true : item.status === activeFilter;

      return matchesSearch && matchesFilter;
    });
  }, [search, activeFilter]);

  const stats = {
    total: materialsData.length,
    available: materialsData.filter((m) => m.status === 'available').length,
    lowStock: materialsData.filter((m) => m.status === 'low-stock').length,
    outOfStock: materialsData.filter((m) => m.status === 'out-of-stock').length,
  };

  return (
    <div className="app-layout">
      <SideBare activeLabel="Browse Materials" />

      <main className="app-main">
        <div className="page-shell">
          <div className="page-topbar">
            <div>
              <h1 className="page-title">Laboratory Inventory</h1>
              <p className="page-subtitle">
                View and manage all materials available in the laboratories
              </p>
            </div>
            <ThemeToggle />
          </div>

          <div className="inv-stats-grid">
            <div className="inv-stat-card">
              <div className="inv-stat-icon blue">
                <Boxes size={20} />
              </div>
              <div className="inv-stat-content">
                <span>Total Materials</span>
                <strong>{stats.total}</strong>
              </div>
            </div>

            <div className="inv-stat-card">
              <div className="inv-stat-icon green">
                <Package size={20} />
              </div>
              <div className="inv-stat-content">
                <span>Available</span>
                <strong>{stats.available}</strong>
              </div>
            </div>

            <div className="inv-stat-card">
              <div className="inv-stat-icon yellow">
                <AlertTriangle size={20} />
              </div>
              <div className="inv-stat-content">
                <span>Low Stock</span>
                <strong>{stats.lowStock}</strong>
              </div>
            </div>

            <div className="inv-stat-card">
              <div className="inv-stat-icon red">
                <Archive size={20} />
              </div>
              <div className="inv-stat-content">
                <span>Out of Stock</span>
                <strong>{stats.outOfStock}</strong>
              </div>
            </div>
          </div>

          <div className="inv-toolbar">
            <div className="inv-search-box">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search materials, category, description..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="inv-filter-row">
              <span className="inv-filter-icon">
                <Filter size={16} />
              </span>

              <button
                className={`inv-filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
                onClick={() => setActiveFilter('all')}
              >
                All
              </button>

              <button
                className={`inv-filter-btn ${activeFilter === 'available' ? 'active' : ''}`}
                onClick={() => setActiveFilter('available')}
              >
                Available
              </button>

              <button
                className={`inv-filter-btn ${activeFilter === 'low-stock' ? 'active' : ''}`}
                onClick={() => setActiveFilter('low-stock')}
              >
                Low Stock
              </button>

              <button
                className={`inv-filter-btn ${activeFilter === 'out-of-stock' ? 'active' : ''}`}
                onClick={() => setActiveFilter('out-of-stock')}
              >
                Out of Stock
              </button>
            </div>
          </div>

          <div className="inv-grid">
            {filteredMaterials.length > 0 ? (
              filteredMaterials.map((item) => (
                <div className="inv-material-card" key={item.id}>
                  <div className="inv-material-top">
                    <div>
                      <h3>{item.name}</h3>
                      <p>{item.description}</p>
                    </div>

                    <span className={`inv-badge ${item.status}`}>
                      {getStatusLabel(item.status)}
                    </span>
                  </div>

                  <div className="inv-material-details">
                    <div>
                      <span className="inv-label">Category</span>
                      <strong>{item.category}</strong>
                    </div>

                    <div>
                      <span className="inv-label">Quantity</span>
                      <strong>{item.quantity}</strong>
                    </div>

                    <div>
                      <span className="inv-label">Location</span>
                      <strong>{item.location}</strong>
                    </div>

                    <div>
                      <span className="inv-label">Status</span>
                      <strong>{getStatusLabel(item.status)}</strong>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="inv-empty-state">No materials found for this filter.</div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
