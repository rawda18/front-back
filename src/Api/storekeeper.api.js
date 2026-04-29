// src/Api/storekeeper.api.js

let inventory = [
  {
    id: 1,
    name: 'Arduino Uno R3',
    category: 'Microcontrollers',
    desc: 'ATmega328P-based microcontroller board with 14 digital input/output pins.',
    qty: 29,
    loc: 'Shelf A1',
    lab: 'Electronics Lab',
    status: 'Available',
  },
  // تقدر تزيد أمثلة أخرى هنا
];

export const fetchMaterials = () => {
  return [...inventory];
};

export const updateMaterialStatus = (id, newStatus) => {
  const index = inventory.findIndex(item => item.id === id);
  if (index !== -1) {
    inventory[index].status = newStatus;
    return true;
  }
  return false;
};

export const addMaterial = (newMaterial) => {
  const newId = inventory.length + 1;
  const materialWithId = { id: newId, ...newMaterial };
  inventory.push(materialWithId);
  return materialWithId;
};

// إذا حبيت تحسب الإحصائيات ديناميكياً (total outputs, available, low stock, needs maintenance)
export const fetchInventoryStats = () => {
  const totalOutputs = inventory.length;
  const available = inventory.filter(item => item.status === 'Available').length;
  const lowStock = inventory.filter(item => item.qty < 10).length; // مثال
  const needsMaintenance = inventory.filter(item => item.status === 'Under Maintenance').length;
  return { totalOutputs, available, lowStock, needsMaintenance };
};