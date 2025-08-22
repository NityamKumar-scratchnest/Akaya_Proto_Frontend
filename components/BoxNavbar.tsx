// components/BoxNavbar.tsx
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { Platform, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

interface BoxNavbarProps {
  title: string;
}

export default function BoxNavbar({ title }: BoxNavbarProps) {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 500;

  const handleBack = () => {
    if (router.canGoBack?.()) {
      router.back();
    } else {
      router.replace('/dashboard'); // fallback if no history
    }
  };

  return (
    <View
      style={[
        styles.navbar,
        { 
          paddingVertical: isSmallScreen ? 20 : 20,
          marginTop : isSmallScreen ? 0 : 0,
          paddingHorizontal: isSmallScreen ? 30 : 160,
          paddingTop : isSmallScreen ? 40 : 20
        },
      ]}
    >
      <Pressable
        onPress={handleBack}
       style={(state: any) => [
    styles.backButton,
    state.hovered && Platform.OS === 'web' ? styles.backButtonHover : null,
    state.pressed ? styles.backButtonPressed : null,
  ]}
      >
        <ArrowLeft size={22} color="#575057" />
        {!isSmallScreen && <Text style={styles.backtext}>Back</Text>}
      </Pressable>

      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
    width: '100%',
   
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 6,
    borderRadius: 8,
    marginRight: 16,
    cursor: Platform.OS === 'web' ? 'pointer' : 'auto', // show pointer cursor on web
  },
  backButtonHover: {
    backgroundColor: '#f2f6ff',
  },
  backtext: {
    marginLeft: 6,
    fontSize: 16,
    fontWeight: '500',
    color: '#575057',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    flexShrink: 2,
  },
  backButtonPressed: {
  backgroundColor: '#e8f0ff',
},
});
