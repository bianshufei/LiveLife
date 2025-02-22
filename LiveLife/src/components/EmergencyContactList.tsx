import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert
} from 'react-native';
import { EmergencyContact } from '../types/EmergencyContact';
import { EmergencyContactService } from '../services/EmergencyContactService';

/**
 * 紧急联系人列表组件
 * 用于展示、管理和操作紧急联系人列表
 */
export const EmergencyContactList = () => {
  // 使用状态管理存储联系人列表数据
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);

  // 组件挂载时加载联系人数据
  useEffect(() => {
    loadContacts();
  }, []);

  /**
   * 从服务加载所有联系人数据
   * 如果加载失败会显示错误提示
   */
  const loadContacts = async () => {
    try {
      const allContacts = await EmergencyContactService.getAllContacts();
      setContacts(allContacts);
    } catch (error) {
      Alert.alert('错误', '加载联系人失败');
    }
  };

  /**
   * 切换指定联系人的激活状态
   * @param id 要切换状态的联系人ID
   */
  const toggleContactStatus = async (id: string) => {
    try {
      const updatedContact = await EmergencyContactService.toggleContactStatus(id);
      if (updatedContact) {
        loadContacts(); // 重新加载列表以显示最新状态
      }
    } catch (error) {
      Alert.alert('错误', '更新联系人状态失败');
    }
  };

  /**
   * 删除指定的联系人
   * 会先显示确认对话框，用户确认后才执行删除操作
   * @param id 要删除的联系人ID
   */
  const deleteContact = async (id: string) => {
    Alert.alert(
      '确认删除',
      '确定要删除这个紧急联系人吗？',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '删除',
          style: 'destructive',
          onPress: async () => {
            try {
              await EmergencyContactService.deleteContact(id);
              loadContacts(); // 删除成功后刷新列表
            } catch (error) {
              Alert.alert('错误', '删除联系人失败');
            }
          },
        },
      ]
    );
  };

  /**
   * 渲染单个联系人项目
   * 包含联系人信息展示、状态切换按钮和删除按钮
   */
  const renderItem = ({ item }: { item: EmergencyContact }) => (
    <View style={styles.contactItem}>
      <TouchableOpacity
        style={[styles.statusIndicator, item.isActive ? styles.active : styles.inactive]}
        onPress={() => toggleContactStatus(item.id)}
      />
      <View style={styles.contactInfo}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.phone}>{`+${item.countryCode} ${item.phoneNumber}`}</Text>
        {item.relationship && (
          <Text style={styles.relationship}>{item.relationship}</Text>
        )}
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deleteContact(item.id)}
      >
        <Text style={styles.deleteButtonText}>删除</Text>
      </TouchableOpacity>
    </View>
  );

  // 渲染整个联系人列表
  return (
    <View style={styles.container}>
      <FlatList
        data={contacts}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        ListEmptyComponent={
          <Text style={styles.emptyText}>暂无紧急联系人</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contactItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  active: {
    backgroundColor: '#4CAF50',
  },
  inactive: {
    backgroundColor: '#9E9E9E',
  },
  contactInfo: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  phone: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  relationship: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  deleteButton: {
    padding: 8,
    backgroundColor: '#ff5252',
    borderRadius: 4,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 24,
    color: '#666',
    fontSize: 16,
  },
});