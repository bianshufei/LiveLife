import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert
} from 'react-native';
import { EmergencyContactService } from '../services/EmergencyContactService';
import { CreateEmergencyContactParams } from '../types/EmergencyContact';

interface EmergencyContactFormProps {
  onSubmit?: () => void;
  initialData?: CreateEmergencyContactParams;
  isEditing?: boolean;
}

export const EmergencyContactForm: React.FC<EmergencyContactFormProps> = ({
  onSubmit,
  initialData,
  isEditing = false
}) => {
  const [formData, setFormData] = useState<CreateEmergencyContactParams>(initialData || {
    name: '',
    phoneNumber: '',
    countryCode: '86',
    relationship: ''
  });

  const handleSubmit = async () => {
    try {
      // 表单验证
      if (!formData.name.trim()) {
        Alert.alert('错误', '请输入联系人姓名');
        return;
      }
      if (!formData.phoneNumber.trim()) {
        Alert.alert('错误', '请输入联系人电话');
        return;
      }
      if (!formData.countryCode.trim()) {
        Alert.alert('错误', '请输入国家代码');
        return;
      }

      // 提交数据
      if (isEditing) {
        // TODO: 处理编辑逻辑
      } else {
        await EmergencyContactService.addContact(formData);
      }

      // 清空表单
      setFormData({
        name: '',
        phoneNumber: '',
        countryCode: '86',
        relationship: ''
      });

      Alert.alert('成功', isEditing ? '联系人已更新' : '联系人已添加');
      onSubmit?.();
    } catch (error) {
      Alert.alert('错误', isEditing ? '更新联系人失败' : '添加联系人失败');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isEditing ? '编辑联系人' : '添加联系人'}</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>姓名</Text>
        <TextInput
          style={styles.input}
          value={formData.name}
          onChangeText={(text) => setFormData({ ...formData, name: text })}
          placeholder="请输入联系人姓名"
        />
      </View>

      <View style={styles.phoneContainer}>
        <View style={[styles.inputGroup, styles.countryCode]}>
          <Text style={styles.label}>国家代码</Text>
          <TextInput
            style={styles.input}
            value={formData.countryCode}
            onChangeText={(text) => setFormData({ ...formData, countryCode: text })}
            placeholder="86"
            keyboardType="numeric"
          />
        </View>

        <View style={[styles.inputGroup, styles.phoneNumber]}>
          <Text style={styles.label}>电话号码</Text>
          <TextInput
            style={styles.input}
            value={formData.phoneNumber}
            onChangeText={(text) => setFormData({ ...formData, phoneNumber: text })}
            placeholder="请输入电话号码"
            keyboardType="numeric"
          />
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>关系</Text>
        <TextInput
          style={styles.input}
          value={formData.relationship}
          onChangeText={(text) => setFormData({ ...formData, relationship: text })}
          placeholder="请输入与联系人关系（选填）"
        />
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>
          {isEditing ? '保存修改' : '添加联系人'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  phoneContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  countryCode: {
    flex: 1,
    marginRight: 8,
  },
  phoneNumber: {
    flex: 3,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});