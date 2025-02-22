/**
 * 紧急联系人数据模型
 * 用于存储和管理应用中的紧急联系人信息
 */
export interface EmergencyContact {
  /** 联系人唯一标识符 */
  id: string;
  /** 联系人姓名 */
  name: string;
  /** 联系人电话号码（不包含国家代码） */
  phoneNumber: string;
  /** 国家代码（如：86代表中国） */
  countryCode: string;
  /** 与联系人的关系（可选） */
  relationship?: string;
  /** 联系人是否处于激活状态 */
  isActive: boolean;
  /** 最后更新时间 */
  lastUpdated: Date;
}

/**
 * 创建新联系人的参数接口
 * 用于添加新的紧急联系人时传递必要的信息
 */
export interface CreateEmergencyContactParams {
  /** 联系人姓名 */
  name: string;
  /** 联系人电话号码（不包含国家代码） */
  phoneNumber: string;
  /** 国家代码（如：86代表中国） */
  countryCode: string;
  /** 与联系人的关系（可选） */
  relationship?: string;
}

/**
 * 更新联系人的参数接口
 * 用于修改现有联系人信息，所有字段都是可选的，
 * 只更新提供的字段
 */
export interface UpdateEmergencyContactParams {
  /** 要更新的联系人ID */
  id: string;
  /** 新的联系人姓名（可选） */
  name?: string;
  /** 新的电话号码（可选） */
  phoneNumber?: string;
  /** 新的国家代码（可选） */
  countryCode?: string;
  /** 新的关系描述（可选） */
  relationship?: string;
  /** 是否更改激活状态（可选） */
  isActive?: boolean;
}