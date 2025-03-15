// 配送路线规划服务

interface Location {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
}

interface RoutePoint {
  location: Location;
  estimatedArrivalTime: Date;
  estimatedDepartureTime: Date;
  status: 'pending' | 'arrived' | 'completed';
  orderIds: string[];
}

interface Route {
  id: string;
  deliveryPersonId: string;
  points: RoutePoint[];
  totalDistance: number; // 单位：米
  estimatedDuration: number; // 单位：秒
  startTime: Date;
  endTime: Date | null;
  status: 'planning' | 'in_progress' | 'completed' | 'cancelled';
}

// 使用贪心算法计算最近邻路径
export function calculateNearestNeighborRoute(
  startLocation: Location,
  deliveryLocations: Location[],
  deliveryPersonId: string
): Route {
  // 复制一份配送地点列表，以便我们可以修改它
  const remainingLocations = [...deliveryLocations];
  const routePoints: RoutePoint[] = [];
  
  // 总距离
  let totalDistance = 0;
  // 估计的总时间（秒）
  let estimatedDuration = 0;
  
  // 当前位置，初始为起点
  let currentLocation = startLocation;
  // 当前时间，初始为现在
  let currentTime = new Date();
  
  // 每个地点的平均停留时间（秒）
  const averageStopDuration = 300; // 5分钟
  
  // 当还有剩余地点时，继续规划路线
  while (remainingLocations.length > 0) {
    // 找到距离当前位置最近的下一个地点
    let nearestLocationIndex = 0;
    let shortestDistance = calculateDistance(
      currentLocation.latitude,
      currentLocation.longitude,
      remainingLocations[0].latitude,
      remainingLocations[0].longitude
    );
    
    for (let i = 1; i < remainingLocations.length; i++) {
      const distance = calculateDistance(
        currentLocation.latitude,
        currentLocation.longitude,
        remainingLocations[i].latitude,
        remainingLocations[i].longitude
      );
      
      if (distance < shortestDistance) {
        shortestDistance = distance;
        nearestLocationIndex = i;
      }
    }
    
    // 获取最近的地点
    const nextLocation = remainingLocations[nearestLocationIndex];
    
    // 计算到达该地点的预计时间
    // 假设平均速度为每秒5米（18km/h）
    const travelDuration = shortestDistance / 5;
    const arrivalTime = new Date(currentTime.getTime() + travelDuration * 1000);
    
    // 计算离开该地点的预计时间
    const departureTime = new Date(arrivalTime.getTime() + averageStopDuration * 1000);
    
    // 添加到路线点
    routePoints.push({
      location: nextLocation,
      estimatedArrivalTime: arrivalTime,
      estimatedDepartureTime: departureTime,
      status: 'pending',
      orderIds: [] // 这里应该填入与该地点相关的订单ID
    });
    
    // 更新总距离和总时间
    totalDistance += shortestDistance;
    estimatedDuration += travelDuration + averageStopDuration;
    
    // 更新当前位置和时间
    currentLocation = nextLocation;
    currentTime = departureTime;
    
    // 从剩余地点中移除已添加的地点
    remainingLocations.splice(nearestLocationIndex, 1);
  }
  
  // 创建并返回路线
  return {
    id: generateId(),
    deliveryPersonId,
    points: routePoints,
    totalDistance,
    estimatedDuration,
    startTime: new Date(),
    endTime: null,
    status: 'planning'
  };
}

// 使用2-opt算法优化路线
export function optimizeRouteWith2Opt(route: Route): Route {
  // 如果路线点少于3个，无需优化
  if (route.points.length < 3) {
    return route;
  }
  
  // 提取路线点的位置
  const locations = route.points.map(point => point.location);
  
  // 初始化最佳路线为当前路线
  let bestRoute = [...locations];
  let bestDistance = calculateTotalDistance(bestRoute);
  let improved = true;
  
  // 当还能改进时，继续优化
  while (improved) {
    improved = false;
    
    // 尝试交换路线中的每一对边
    for (let i = 0; i < bestRoute.length - 2; i++) {
      for (let j = i + 2; j < bestRoute.length; j++) {
        // 如果是最后一个点和第一个点，跳过
        if (i === 0 && j === bestRoute.length - 1) continue;
        
        // 创建新路线，交换i+1到j的部分
        const newRoute = [...bestRoute];
        const segment = newRoute.slice(i + 1, j + 1).reverse();
        newRoute.splice(i + 1, j - i, ...segment);
        
        // 计算新路线的总距离
        const newDistance = calculateTotalDistance(newRoute);
        
        // 如果新路线更短，更新最佳路线
        if (newDistance < bestDistance) {
          bestRoute = newRoute;
          bestDistance = newDistance;
          improved = true;
          break;
        }
      }
      if (improved) break;
    }
  }
  
  // 根据优化后的位置顺序重新创建路线点
  const optimizedPoints: RoutePoint[] = [];
  
  bestRoute.forEach((location, index) => {
    const originalPoint = route.points.find(p => p.location.id === location.id);
    if (!originalPoint) {
      throw new Error(`找不到位置ID为${location.id}的原始路线点`);
    }
    
    // 如果是第一个点，使用原始的到达时间
    if (index === 0) {
      optimizedPoints.push(originalPoint);
      return;
    }
    
    // 计算从上一个点到当前点的距离
    const prevLocation = bestRoute[index - 1];
    const distance = calculateDistance(
      prevLocation.latitude,
      prevLocation.longitude,
      location.latitude,
      location.longitude
    );
    
    // 计算到达该地点的预计时间
    // 假设平均速度为每秒5米（18km/h）
    const travelDuration = distance / 5;
    const prevPoint = optimizedPoints[index - 1];
    const arrivalTime = new Date(prevPoint.estimatedDepartureTime.getTime() + travelDuration * 1000);
    
    // 计算离开该地点的预计时间（使用原始点的停留时间）
    const stopDuration = originalPoint.estimatedDepartureTime.getTime() - originalPoint.estimatedArrivalTime.getTime();
    const departureTime = new Date(arrivalTime.getTime() + stopDuration);
    
    optimizedPoints.push({
      ...originalPoint,
      estimatedArrivalTime: arrivalTime,
      estimatedDepartureTime: departureTime
    });
  });
  
  // 计算优化后的总距离和总时间
  const totalDistance = calculateTotalDistance(bestRoute);
  const estimatedDuration = (optimizedPoints[optimizedPoints.length - 1].estimatedDepartureTime.getTime() - 
                            optimizedPoints[0].estimatedArrivalTime.getTime()) / 1000;
  
  // 创建并返回优化后的路线
  return {
    ...route,
    points: optimizedPoints,
    totalDistance,
    estimatedDuration
  };
}

// 计算两点之间的距离（使用Haversine公式）
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // 地球半径，单位：米
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;
  
  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
  return R * c; // 返回距离，单位：米
}

// 计算路线的总距离
function calculateTotalDistance(locations: Location[]): number {
  let totalDistance = 0;
  
  for (let i = 0; i < locations.length - 1; i++) {
    totalDistance += calculateDistance(
      locations[i].latitude,
      locations[i].longitude,
      locations[i + 1].latitude,
      locations[i + 1].longitude
    );
  }
  
  return totalDistance;
}

// 生成唯一ID
function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// 模拟获取最佳路线
export async function getBestRoute(
  deliveryPersonId: string,
  orderIds: string[]
): Promise<Route> {
  // 这里应该从API获取订单和地点信息
  // 为了演示，我们使用模拟数据
  
  // 模拟配送员当前位置（学校食堂）
  const startLocation: Location = {
    id: 'current-location',
    name: '学校食堂',
    address: '校园中心区域',
    latitude: 39.9042,
    longitude: 116.4074
  };
  
  // 模拟配送地点
  const deliveryLocations: Location[] = [
    {
      id: 'location-1',
      name: '1号宿舍楼',
      address: '校园东区',
      latitude: 39.9052,
      longitude: 116.4084
    },
    {
      id: 'location-2',
      name: '2号宿舍楼',
      address: '校园东区',
      latitude: 39.9062,
      longitude: 116.4094
    },
    {
      id: 'location-3',
      name: '图书馆',
      address: '校园北区',
      latitude: 39.9072,
      longitude: 116.4064
    },
    {
      id: 'location-4',
      name: '体育馆',
      address: '校园西区',
      latitude: 39.9032,
      longitude: 116.4054
    }
  ];
  
  // 计算初始路线
  const initialRoute = calculateNearestNeighborRoute(
    startLocation,
    deliveryLocations,
    deliveryPersonId
  );
  
  // 优化路线
  const optimizedRoute = optimizeRouteWith2Opt(initialRoute);
  
  return optimizedRoute;
}

// 更新路线状态
export async function updateRouteStatus(
  routeId: string,
  pointIndex: number,
  status: 'arrived' | 'completed'
): Promise<Route> {
  // 这里应该调用API更新路线状态
  // 为了演示，我们返回模拟数据
  
  // 模拟路线数据
  const route: Route = {
    id: routeId,
    deliveryPersonId: 'delivery-person-1',
    points: [],
    totalDistance: 5000,
    estimatedDuration: 3600,
    startTime: new Date(),
    endTime: null,
    status: 'in_progress'
  };
  
  // 返回更新后的路线
  return route;
} 