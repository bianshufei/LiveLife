import { NativeEventEmitter, NativeModules } from 'react-native';

export interface ActivityStatus {
  lastActiveTime: Date;
  isActive: boolean;
}

export class ActivityMonitorService {
  private static instance: ActivityMonitorService;
  private lastActiveTime: Date;
  private checkInterval: number = 1800000; // 默认30分钟检查一次
  private timer: NodeJS.Timeout | null = null;
  private listeners: ((status: ActivityStatus) => void)[] = [];

  private constructor() {
    this.lastActiveTime = new Date();
    this.setupActivityListeners();
  }

  public static getInstance(): ActivityMonitorService {
    if (!ActivityMonitorService.instance) {
      ActivityMonitorService.instance = new ActivityMonitorService();
    }
    return ActivityMonitorService.instance;
  }

  /**
   * 设置活动监测的时间间隔
   * @param interval 检查间隔（毫秒）
   */
  public setCheckInterval(interval: number): void {
    this.checkInterval = interval;
    this.restartMonitoring();
  }

  /**
   * 开始监测用户活动
   */
  public startMonitoring(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }

    this.timer = setInterval(() => {
      this.checkActivity();
    }, this.checkInterval);
  }

  /**
   * 停止监测用户活动
   */
  public stopMonitoring(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  /**
   * 重启监测服务
   */
  private restartMonitoring(): void {
    this.stopMonitoring();
    this.startMonitoring();
  }

  /**
   * 设置用户活动监听器
   */
  private setupActivityListeners(): void {
    // 监听触摸事件
    const eventEmitter = new NativeEventEmitter(NativeModules.TouchEventModule);
    eventEmitter.addListener('onTouch', this.updateLastActiveTime.bind(this));

    // 监听应用状态变化
    AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        this.updateLastActiveTime();
      }
    });

    // 监听设备解锁事件
    if (Platform.OS === 'android') {
      const lockEventEmitter = new NativeEventEmitter(NativeModules.LockScreenModule);
      lockEventEmitter.addListener('onUnlock', this.updateLastActiveTime.bind(this));
    } else if (Platform.OS === 'ios') {
      const lockEventEmitter = new NativeEventEmitter(NativeModules.LockScreenModule);
      lockEventEmitter.addListener('screenUnlocked', this.updateLastActiveTime.bind(this));
    }
  }

  private checkActivity(): void {
    const now = new Date();
    const timeDiff = now.getTime() - this.lastActiveTime.getTime();
    const isActive = timeDiff < this.checkInterval;

    // 更新活动状态
    const status: ActivityStatus = {
      lastActiveTime: this.lastActiveTime,
      isActive: isActive
    };

    // 通知监听器
    this.listeners.forEach(listener => listener(status));

    // 如果超过30分钟无活动，触发紧急联系人通知
    if (!isActive) {
      this.handleInactivity();
      // 重置计时器，开始新的30分钟计时
      this.restartMonitoring();
    }
  }

  private handleInactivity(): void {
    // 触发紧急联系人通知
    // TODO: 实现具体的通知逻辑
    console.warn('用户超过30分钟无活动，触发紧急通知');
  }

  /**
   * 更新最后活动时间
   */
  private updateLastActiveTime(): void {
    this.lastActiveTime = new Date();
    this.notifyListeners();
  }

  /**
   * 添加状态监听器
   * @param listener 监听器函数
   */
  public addListener(listener: (status: ActivityStatus) => void): void {
    this.listeners.push(listener);
  }

  /**
   * 移除状态监听器
   * @param listener 要移除的监听器函数
   */
  public removeListener(listener: (status: ActivityStatus) => void): void {
    const index = this.listeners.indexOf(listener);
    if (index !== -1) {
      this.listeners.splice(index, 1);
    }
  }

  /**
   * 通知所有监听器状态更新
   */
  private notifyListeners(): void {
    const status: ActivityStatus = {
      lastActiveTime: this.lastActiveTime,
      isActive: true
    };

    this.listeners.forEach(listener => listener(status));
  }

  /**
   * 获取当前活动状态
   */
  public getActivityStatus(): ActivityStatus {
    return {
      lastActiveTime: this.lastActiveTime,
      isActive: true
    };
  }
}