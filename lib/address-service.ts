// 地址管理服务
// 提供地址的CRUD操作和默认地址设置

export interface Address {
  id: string;
  name: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  detail: string;
  isDefault: boolean;
}

// 本地存储键
const ADDRESS_STORAGE_KEY = 'user_addresses';

// 获取所有地址
export function getAddresses(): Address[] {
  if (typeof window === 'undefined') return [];
  
  const savedAddresses = localStorage.getItem(ADDRESS_STORAGE_KEY);
  if (!savedAddresses) return [];
  
  try {
    return JSON.parse(savedAddresses) as Address[];
  } catch (error) {
    console.error('解析地址数据失败:', error);
    return [];
  }
}

// 保存地址列表
function saveAddresses(addresses: Address[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ADDRESS_STORAGE_KEY, JSON.stringify(addresses));
}

// 添加新地址
export function addAddress(address: Omit<Address, 'id'>): Address {
  const addresses = getAddresses();
  
  // 生成新ID
  const newAddress: Address = {
    ...address,
    id: `addr_${Date.now()}_${Math.floor(Math.random() * 1000)}`
  };
  
  // 如果是默认地址，将其他地址设为非默认
  if (newAddress.isDefault) {
    addresses.forEach(addr => {
      addr.isDefault = false;
    });
  }
  
  // 如果是第一个地址，自动设为默认
  if (addresses.length === 0) {
    newAddress.isDefault = true;
  }
  
  // 添加到列表
  const updatedAddresses = [...addresses, newAddress];
  saveAddresses(updatedAddresses);
  
  return newAddress;
}

// 更新地址
export function updateAddress(address: Address): Address | null {
  const addresses = getAddresses();
  const index = addresses.findIndex(addr => addr.id === address.id);
  
  if (index === -1) return null;
  
  // 如果设为默认地址，将其他地址设为非默认
  if (address.isDefault) {
    addresses.forEach(addr => {
      addr.isDefault = false;
    });
  }
  
  // 更新地址
  addresses[index] = address;
  saveAddresses(addresses);
  
  return address;
}

// 删除地址
export function deleteAddress(id: string): boolean {
  const addresses = getAddresses();
  const index = addresses.findIndex(addr => addr.id === id);
  
  if (index === -1) return false;
  
  // 删除地址
  addresses.splice(index, 1);
  
  // 如果删除的是默认地址且还有其他地址，将第一个地址设为默认
  if (addresses.length > 0 && !addresses.some(addr => addr.isDefault)) {
    addresses[0].isDefault = true;
  }
  
  saveAddresses(addresses);
  return true;
}

// 设置默认地址
export function setDefaultAddress(id: string): boolean {
  const addresses = getAddresses();
  const index = addresses.findIndex(addr => addr.id === id);
  
  if (index === -1) return false;
  
  // 将所有地址设为非默认
  addresses.forEach(addr => {
    addr.isDefault = false;
  });
  
  // 将指定地址设为默认
  addresses[index].isDefault = true;
  
  saveAddresses(addresses);
  return true;
}

// 获取默认地址
export function getDefaultAddress(): Address | null {
  const addresses = getAddresses();
  return addresses.find(addr => addr.isDefault) || null;
}

// 获取单个地址
export function getAddressById(id: string): Address | null {
  const addresses = getAddresses();
  return addresses.find(addr => addr.id === id) || null;
} 