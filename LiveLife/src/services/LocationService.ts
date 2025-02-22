import { PermissionsAndroid, Platform } from 'react-native';
import Geolocation from '@react-native-community/geolocation';

export interface LocationData {
  latitude: number;
  longitude: number;
  timestamp: Date;
  accuracy?: number;
}

export class LocationService {
  private static instance: LocationService;
  private currentLocation: LocationData | null = null;
  private watchId: number | null = null;
  private listeners: ((location: LocationData) => void)[] = [];

  private constructor() {}

  public static getInstance(): LocationService {
    if (!LocationService.instance) {
      LocationService.instance = new LocationService();
    }
    return LocationService.instance;
  }

  /**
   * 请求位置权限
   */
  private async requestLocationPermission(): Promise<boolean> {
    if (Platform.OS === 'ios') {
      Geolocation.requestAuthorization();
      return true;
    }

    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: '位置权限',
          message: '应用需要访问您的位置信息以提供紧急服务',
          buttonNeutral: '稍后询问',
          buttonNegative: '拒绝',
          buttonPositive: '允许'
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn('请求位置权限失败:', err);
      return false;
    }
  }

  /**
   * 开始监听位置变化
   */
  public async startLocationTracking(): Promise<boolean> {
    const hasPermission = await this.requestLocationPermission();
    if (!hasPermission) {
      console.error('未获得位置权限');
      return false;
    }

    if (this.watchId !== null) {
      this.stopLocationTracking();
    }

    this.watchId = Geolocation.watchPosition(
      (position) => {
        const locationData: LocationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: new Date(position.timestamp)
        };
        this.currentLocation = locationData;
        this.notifyListeners(locationData);
      },
      (error) => {
        console.error('位置监听错误:', error);
      },
      {
        enableHighAccuracy: true,
        distanceFilter: 10,
        interval: 5000,
        fastestInterval: 2000
      }
    );

    return true;
  }

  /**
   * 停止位置监听
   */
  public stopLocationTracking(): void {
    if (this.watchId !== null) {
      Geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
  }

  /**
   * 获取当前位置
   */
  public async getCurrentLocation(): Promise<LocationData | null> {
    const hasPermission = await this.requestLocationPermission();
    if (!hasPermission) {
      return null;
    }

    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        (position) => {
          const locationData: LocationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: new Date(position.timestamp)
          };
          this.currentLocation = locationData;
          resolve(locationData);
        },
        (error) => {
          console.error('获取位置失败:', error);
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000
        }
      );
    });
  }

  /**
   * 添加位置监听器
   */
  public addListener(listener: (location: LocationData) => void): void {
    this.listeners.push(listener);
  }

  /**
   * 移除位置监听器
   */
  public removeListener(listener: (location: LocationData) => void): void {
    const index = this.listeners.indexOf(listener);
    if (index !== -1) {
      this.listeners.splice(index, 1);
    }
  }

  /**
   * 通知所有监听器位置更新
   */
  private notifyListeners(location: LocationData): void {
    this.listeners.forEach(listener => listener(location));
  }

  /**
   * 获取最后一次记录的位置
   */
  public getLastKnownLocation(): LocationData | null {
    return this.currentLocation;
  }
}