/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect } from 'react';
import type {PropsWithChildren} from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SafeAreaView } from 'react-native';
import { EmergencyContactList } from './src/components/EmergencyContactList';
import { PermissionService } from './src/services/PermissionService';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {
    const requestPermissions = async () => {
      const permissionService = PermissionService.getInstance();
      const granted = await permissionService.requestAllPermissions();
      
      if (!granted) {
        Alert.alert(
          '权限请求',
          '为了确保您的安全，我们需要获取必要的权限。请在设置中手动开启相关权限。',
          [{ text: '我知道了' }]
        );
      }
    };

    requestPermissions();
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={'#F5F5F5'}
        />
        <View style={styles.header}>
          <Text style={styles.title}>今日生存</Text>
          <Text style={styles.subtitle}>保护您的安全，随时待命</Text>
        </View>
        <EmergencyContactList />
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>添加紧急联系人</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  addButton: {
    margin: 16,
    padding: 16,
    backgroundColor: '#2196F3',
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default App;
