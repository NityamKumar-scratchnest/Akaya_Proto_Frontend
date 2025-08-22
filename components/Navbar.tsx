import { router } from 'expo-router';
import { LogOut } from 'lucide-react-native';
import { Image, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import { RootState } from '../redux/store';

export default function Navbar() {
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 500;

  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout()); // clear auth state
    router.replace('/login'); // redirect to login page
  };

  return (
    <View
      style={[
        styles.navbar,
        {
          marginVertical: isSmallScreen ? 0 : 0,
          marginBottom: 0,
          paddingVertical: isSmallScreen ? 10 : 10,
          paddingHorizontal: isSmallScreen ? 30 : 135,
          paddingTop : isSmallScreen ? 30 : 20,
        },
      ]}
    >
      {/* Left: Logo + App Name */}
      <View style={styles.logoContainer}>
        
        <Image
        style={styles.tinyLogo}
        source={require('../assets/images/logo.png')}
      />
      </View>

      {/* Right: Welcome + Logout */}
      <View style={styles.rightContainer}>
        {!isSmallScreen && (
          <Text style={styles.welcome}>Welcome, {user?.name || 'Nityam'}</Text>
        )}

        <Pressable
          onPress={handleLogout}
          style={[isSmallScreen ? styles.iconButton : styles.logoutButton , {paddingVertical : isSmallScreen ? 14 : 6 , backgroundColor : "#fff" }]}
        >
          <LogOut color="#000" size={isSmallScreen ? 20 : 16} />
          {!isSmallScreen && <Text style={styles.logoutText}>Logout</Text>}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    width: '100%',
    paddingVertical: 0,
    paddingHorizontal: 0,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 0,
    fontFamily: 'serif',
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginRight : 10,
    
  },
  welcome: {
    fontSize: 14,
    fontWeight : '400',
    color: '#4b5563',
    marginRight: 10,
    // fontFamily: 'serif',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    backgroundColor: '#fff',
  
  },
  iconButton: {
    paddingHorizontal : 8,
    
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 8,
    backgroundColor: '#f8f8f8',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '500',
  },
  tinyLogo :{
    width: 100,
    height: 30,
    paddingLeft : 0,
    borderRadius: 2,
  }
});
