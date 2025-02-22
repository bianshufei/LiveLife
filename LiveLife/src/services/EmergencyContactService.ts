import AsyncStorage from '@react-native-async-storage/async-storage';
import { EmergencyContact, CreateEmergencyContactParams, UpdateEmergencyContactParams } from '../types/EmergencyContact';

/**
 * 紧急联系人在AsyncStorage中的存储键名
 */
const STORAGE_KEY = '@emergency_contacts';

/**
 * 紧急联系人服务类
 * 提供对紧急联系人的增删改查等操作
 * 使用AsyncStorage实现本地数据持久化存储
 */
export class EmergencyContactService {
  /**
   * 获取所有紧急联系人列表
   * @returns Promise<EmergencyContact[]> 返回联系人数组，如果出错则返回空数组
   */
  static async getAllContacts(): Promise<EmergencyContact[]> {
    try {
      const contactsJson = await AsyncStorage.getItem(STORAGE_KEY);
      return contactsJson ? JSON.parse(contactsJson) : [];
    } catch (error) {
      console.error('获取联系人失败:', error);
      return [];
    }
  }

  /**
   * 添加新的紧急联系人
   * @param params 创建联系人所需的信息（姓名、电话、国家代码等）
   * @returns Promise<EmergencyContact> 返回新创建的联系人信息
   * @throws 如果保存失败会抛出异常
   */
  static async addContact(params: CreateEmergencyContactParams): Promise<EmergencyContact> {
    try {
      const contacts = await this.getAllContacts();
      const newContact: EmergencyContact = {
        id: Date.now().toString(), // 使用时间戳作为唯一标识符
        ...params,
        isActive: true, // 新建联系人默认激活
        lastUpdated: new Date()
      };
      
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([...contacts, newContact]));
      return newContact;
    } catch (error) {
      console.error('添加联系人失败:', error);
      throw error;
    }
  }

  /**
   * 更新紧急联系人信息
   * @param params 要更新的联系人信息，包含ID和需要更新的字段
   * @returns Promise<EmergencyContact | null> 返回更新后的联系人信息，如果联系人不存在则返回null
   * @throws 如果更新失败会抛出异常
   */
  static async updateContact(params: UpdateEmergencyContactParams): Promise<EmergencyContact | null> {
    try {
      const contacts = await this.getAllContacts();
      const index = contacts.findIndex(contact => contact.id === params.id);
      
      if (index === -1) return null;
      
      const updatedContact = {
        ...contacts[index],
        ...params,
        lastUpdated: new Date()
      };
      
      contacts[index] = updatedContact;
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
      
      return updatedContact;
    } catch (error) {
      console.error('更新联系人失败:', error);
      throw error;
    }
  }

  /**
   * 删除指定的紧急联系人
   * @param id 要删除的联系人ID
   * @returns Promise<boolean> 删除成功返回true
   * @throws 如果删除失败会抛出异常
   */
  static async deleteContact(id: string): Promise<boolean> {
    try {
      const contacts = await this.getAllContacts();
      const filteredContacts = contacts.filter(contact => contact.id !== id);
      
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filteredContacts));
      return true;
    } catch (error) {
      console.error('删除联系人失败:', error);
      throw error;
    }
  }

  /**
   * 切换联系人的激活状态
   * @param id 要切换状态的联系人ID
   * @returns Promise<EmergencyContact | null> 返回更新后的联系人信息，如果联系人不存在则返回null
   * @throws 如果更新失败会抛出异常
   */
  static async toggleContactStatus(id: string): Promise<EmergencyContact | null> {
    try {
      const contacts = await this.getAllContacts();
      const index = contacts.findIndex(contact => contact.id === id);
      
      if (index === -1) return null;
      
      const updatedContact = {
        ...contacts[index],
        isActive: !contacts[index].isActive, // 切换激活状态
        lastUpdated: new Date()
      };
      
      contacts[index] = updatedContact;
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
      
      return updatedContact;
    } catch (error) {
      console.error('切换联系人状态失败:', error);
      throw error;
    }
  }
}