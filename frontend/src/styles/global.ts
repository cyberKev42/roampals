import { StyleSheet } from 'react-native';

export const colors = {
  backgroundScreenHome: '#cfffc6',
  backgroundScreenInventory: '#c9cbf3',
  backgroundScreenInsights: '#ffbd6d', // #ffe0b2 , #ffdab4
  backgroundScreenAchievements: '#ff7164',
  backgroundScreenProfile: '#92c5df',
  containerBackground: '#b1e7b3',
  header: '#639677',
  surface: '#2a2a4a',
  primary: '#7aa280',
  text: '#3a3434',
  textSecondary: '#fffdf4',
  alert: '#d64e4e',
};

export const globalStyles = StyleSheet.create({
  backgroundHome: {
    marginTop: 50,
    backgroundColor: colors.backgroundScreenHome
  },
  backgroundInventory: {
    backgroundColor: colors.backgroundScreenInventory
  },
  backgroundInsights: {
    backgroundColor: colors.backgroundScreenInsights
  },
  backgroundAchievements: {
    backgroundColor: colors.backgroundScreenAchievements
  },
  backgroundProfile: {
    backgroundColor: colors.backgroundScreenProfile
  },

  container: {
    flex: 1,
    width: 340,
    borderRadius: 20,
    backgroundColor: colors.containerBackground,
    margin: 15,
    paddingTop: 30,
    paddingBottom: 30,
    paddingHorizontal: 25,
  },
  title: {
    fontSize: 50,
    fontWeight: 'bold',
    color: colors.text,
  },
  subtitle: {
    fontSize: 30,
    fontWeight: 'semibold',
    color: colors.textSecondary
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: 10,
    marginBottom: 16,
  },
  empty: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});