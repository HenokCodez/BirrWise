import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Modal, Alert, Switch, Platform, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { logout, updateProfile } from '../../store/slices/authSlice';
import { toggleDarkMode } from '../../store/slices/themeSlice';
import { SIZES, SHADOWS } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import Input from '../../components/Input';
import Button from '../../components/Button';
import * as ImagePicker from 'expo-image-picker';

const ProfileScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { user, isLoading, isError, isSuccess, message } = useSelector((state) => state.auth);
  const { colors, isDark } = useTheme();

  // Modals state
  const [profileModal, setProfileModal] = useState(false);
  const [securityModal, setSecurityModal] = useState(false);

  // Form states
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [profileImage, setProfileImage] = useState(user?.profileImage || null);
  
  // Security Form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    setName(user?.name || '');
    setEmail(user?.email || '');
    setProfileImage(user?.profileImage || null);
  }, [user]);


  const handleUpdateProfile = async () => {
    const resultAction = await dispatch(updateProfile({ name, email, profileImage }));
    if (updateProfile.fulfilled.match(resultAction)) {
      setProfileModal(false);
      Alert.alert('Success', 'Profile updated successfully');
    } else {
      Alert.alert('Error', resultAction.payload || 'Failed to update profile');
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
        base64: true,
      });

      if (!result.canceled) {
        const base64Img = `data:image/jpeg;base64,${result.assets[0].base64}`;
        setProfileImage(base64Img);
        const resultAction = await dispatch(updateProfile({ profileImage: base64Img }));
        if (updateProfile.fulfilled.match(resultAction)) {
          Alert.alert('Success', 'Profile picture updated!');
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleUpdatePassword = async () => {
    setLocalError('');
    if (!currentPassword || !newPassword) {
      setLocalError('All fields are required');
      return;
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    if (!passwordRegex.test(newPassword)) {
      setLocalError('Password must be 6+ chars with uppercase, number, and special character');
      return;
    }
    const resultAction = await dispatch(updateProfile({ currentPassword, newPassword }));
    if (updateProfile.fulfilled.match(resultAction)) {
      setSecurityModal(false);
      setCurrentPassword('');
      setNewPassword('');
      Alert.alert('Success', 'Password changed successfully');
    } else {
      setLocalError(resultAction.payload || 'Failed to update password');
    }
  };

  const ProfileItem = ({ icon, title, subtitle, onPress, toggle, value, color = colors.primary }) => (
    <TouchableOpacity 
      style={dynamicStyles.item} 
      onPress={onPress} 
      disabled={!!toggle} 
      activeOpacity={0.7}
    >
      <View style={[dynamicStyles.iconBox, { backgroundColor: color + '15' }]}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <View style={dynamicStyles.itemText}>
        <Text style={dynamicStyles.itemTitle}>{title}</Text>
        {subtitle && <Text style={dynamicStyles.itemSubtitle}>{subtitle}</Text>}
      </View>
      {toggle ? (
        <Switch 
          value={!!value} 
          onValueChange={onPress} 
          trackColor={{ false: colors.border, true: colors.primary }}
          thumbColor={Platform.OS === 'android' ? '#FFFFFF' : undefined}
        />
      ) : (
        <Ionicons name="chevron-forward" size={16} color={colors.textLight} />
      )}
    </TouchableOpacity>
  );

  const dynamicStyles = styles(colors, isDark);

  return (
    <SafeAreaView style={dynamicStyles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={dynamicStyles.header}>
          <View style={dynamicStyles.avatarWrapper}>
            <TouchableOpacity 
              style={[dynamicStyles.avatarLarge, SHADOWS.sm]} 
              onPress={pickImage}
              activeOpacity={0.8}
            >
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={dynamicStyles.avatarImg} />
              ) : (
                <Text style={dynamicStyles.avatarText}>{user?.name?.charAt(0) || 'U'}</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity style={dynamicStyles.editAvatar} onPress={pickImage}>
              <Ionicons name="camera" size={14} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <Text style={dynamicStyles.userName}>{user?.name || 'User Name'}</Text>
          <Text style={dynamicStyles.userEmail}>{user?.email || 'user@example.com'}</Text>
          
          <TouchableOpacity style={dynamicStyles.editProfileBtn} onPress={() => setProfileModal(true)}>
             <Text style={dynamicStyles.editProfileText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Content Section */}
        <View style={dynamicStyles.content}>
          <Text style={dynamicStyles.sectionTitle}>Security & Privacy</Text>
          <View style={dynamicStyles.card}>
            <ProfileItem 
              icon="shield-checkmark" 
              title="Password & Security" 
              subtitle="Update your security credentials"
              onPress={() => {
                setLocalError('');
                setSecurityModal(true);
              }} 
            />
            <View style={dynamicStyles.divider} />
            <ProfileItem 
              icon="finger-print" 
              title="Biometric Setup" 
              subtitle="FaceID or Fingerprint"
              onPress={() => Alert.alert('Coming Soon', 'Biometric login will be available in the next update.')} 
            />
          </View>

          <Text style={dynamicStyles.sectionTitle}>Appearance</Text>
          <View style={dynamicStyles.card}>
            <ProfileItem 
              icon={isDark ? "moon" : "sunny"} 
              title="Dark Mode" 
              subtitle={isDark ? "Midnight Theme Active" : "Daylight Theme Active"}
              toggle={true}
              value={!!isDark}
              onPress={() => dispatch(toggleDarkMode())} 
            />
          </View>

          <TouchableOpacity 
            style={[dynamicStyles.logoutBtn, SHADOWS.sm]} 
            onPress={() => dispatch(logout())}
          >
             <Ionicons name="log-out" size={18} color="#FFFFFF" />
             <Text style={dynamicStyles.logoutBtnText}>Sign Out</Text>
          </TouchableOpacity>

          <Text style={dynamicStyles.version}>BirrWise v1.0.0</Text>
          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      {/* Profile Modal */}
      <Modal visible={!!profileModal} animationType="slide" transparent={true}>
        <View style={dynamicStyles.modalBg}>
          <View style={dynamicStyles.modalContent}>
            <View style={dynamicStyles.modalHeader}>
              <Text style={dynamicStyles.modalTitle}>Personal Details</Text>
              <TouchableOpacity onPress={() => setProfileModal(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            <Input label="Display Name" value={name} onChangeText={setName} />
            <Input label="Email Address" value={email} onChangeText={setEmail} keyboardType="email-address" />
            <Button title="Sync Changes" loading={isLoading} onPress={handleUpdateProfile} style={{ marginTop: SIZES.lg }} />
          </View>
        </View>
      </Modal>

      {/* Security Modal */}
      <Modal visible={!!securityModal} animationType="slide" transparent={true}>
        <View style={dynamicStyles.modalBg}>
          <View style={dynamicStyles.modalContent}>
            <View style={dynamicStyles.modalHeader}>
              <Text style={dynamicStyles.modalTitle}>Access Security</Text>
              <TouchableOpacity onPress={() => setSecurityModal(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            <Input label="Current Password" value={currentPassword} onChangeText={setCurrentPassword} secureTextEntry={true} />
            <Input label="New Secure Password" value={newPassword} onChangeText={setNewPassword} secureTextEntry={true} />
            {localError ? <Text style={dynamicStyles.errorText}>{localError}</Text> : null}
            {isError && <Text style={dynamicStyles.errorText}>{message}</Text>}
            <Button title="Update Security" loading={isLoading} onPress={handleUpdatePassword} style={{ marginTop: SIZES.lg }} />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = (colors, isDark) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: Platform.OS === 'android' ? 15 : 0,
  },
  header: {
    alignItems: 'center',
    paddingVertical: SIZES.xl * 1.5,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: SIZES.md,
  },
  avatarLarge: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatarImg: {
    width: '100%',
    height: '100%',
  },
  editAvatar: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    backgroundColor: colors.primaryDark,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: isDark ? colors.card : '#FFFFFF',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: SIZES.h1,
    fontWeight: '900',
  },
  userName: {
    fontSize: SIZES.h3,
    fontWeight: '800',
    color: colors.text,
  },
  userEmail: {
    fontSize: SIZES.body2,
    color: colors.textLight,
    marginTop: 2,
  },
  editProfileBtn: {
     marginTop: SIZES.md,
     paddingHorizontal: SIZES.lg,
     paddingVertical: 8,
     borderRadius: 20,
     backgroundColor: colors.primary + '10',
  },
  editProfileText: {
     color: colors.primary,
     fontSize: SIZES.caption,
     fontWeight: 'bold',
  },
  content: {
    paddingHorizontal: SIZES.lg,
  },
  sectionTitle: {
    fontSize: SIZES.caption,
    fontWeight: '800',
    color: colors.textLight,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: SIZES.sm,
    marginLeft: 4,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: SIZES.lg,
    padding: 6,
    marginBottom: SIZES.xl,
    borderWidth: 1,
    borderColor: isDark ? colors.border : '#FFFFFF',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.md,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.md,
  },
  itemText: {
    flex: 1,
  },
  itemTitle: {
    fontSize: SIZES.body1,
    fontWeight: '700',
    color: colors.text,
  },
  itemSubtitle: {
    fontSize: SIZES.caption,
    color: colors.textLight,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: SIZES.md,
    opacity: 0.5,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.danger,
    paddingVertical: 12,
    paddingHorizontal: SIZES.xl,
    borderRadius: 20,
    marginTop: SIZES.md,
    marginBottom: SIZES.lg,
    alignSelf: 'center',
  },
  logoutBtnText: {
    marginLeft: 8,
    fontSize: SIZES.body2,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  version: {
    textAlign: 'center',
    color: colors.textLight,
    fontSize: SIZES.caption,
    fontWeight: '600',
    marginBottom: SIZES.md,
  },
  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.card,
    borderTopLeftRadius: SIZES.xl,
    borderTopRightRadius: SIZES.xl,
    padding: SIZES.lg,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SIZES.xl,
  },
  modalTitle: {
    fontSize: SIZES.h3,
    fontWeight: '800',
    color: colors.text,
  },
  errorText: {
    color: colors.danger,
    fontSize: SIZES.caption,
    textAlign: 'center',
    marginTop: SIZES.sm,
  }
});

export default ProfileScreen;
