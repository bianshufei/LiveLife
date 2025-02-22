import { PermissionsAndroid, Platform } from 'react-native';
import Geolocation from '@react-native-community/geolocation';

export class PermissionService {
  private static instance: PermissionService;

  private constructor() {}

  public static getInstance(): PermissionService {
    if (!PermissionService.instance) {
      PermissionService.instance = new PermissionService();
    }
    return PermissionService.instance;
  }

  /**
   * 请求所有必需的权限
   */
  public async requestAllPermissions(): Promise<boolean> {
    const locationPermission = await this.requestLocationPermission();
    // 在这里添加其他权限请求
    return locationPermission;
  }

  /**
   * 请求位置权限
   */
  private async requestLocationPermission(): Promise<boolean> {
    if (Platform.OS === 'ios') {
      try {
        await Geolocation.requestAuthorization();
        return true;
      } catch (error) {
        console.error('iOS 位置权限请求失败:', error);
        return false;
      }
    }

    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: '位置权限请求',
          message: '为了在紧急情况下能够及时定位您的位置，应用需要访问位置信息。\n\n请允许访问以确保您的安全。',
          buttonNeutral: '稍后再说',
          buttonNegative: '拒绝',
          buttonPositive: '允许'
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.error('Android 位置权限请求失败:', err);
      return false;
    }
  }

  /**
   * 检查是否已授予位置权限
   */
  public async checkLocationPermission(): Promise<boolean> {
    if (Platform.OS === 'ios') {
      // iOS 权限状态检查逻辑
      return true; // 需要根据实际情况实现
    }

    try {
      const granted = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      return granted;
    } catch (err) {
      console.error('检查位置权限失败:', err);
      return false;
    }
  }
}