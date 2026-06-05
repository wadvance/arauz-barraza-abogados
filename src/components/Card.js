import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { SIZES } from '../utils/theme';

const Card = ({ title, subtitle, icon, onPress, children, style, titleColor, badge }) => {
  const { colors } = useTheme();
  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container
      style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder, shadowColor: colors.cardShadow }, style]}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      {title && (
        <View style={styles.header}>
          <View style={styles.titleRow}>
            {icon && <Text style={styles.icon}>{icon}</Text>}
            <Text style={[styles.title, { color: colors.text }, titleColor && { color: titleColor }]}>
              {title}
            </Text>
          </View>
          {badge && (
            <View style={[styles.badge, { backgroundColor: colors.primaryLight }]}>
              <Text style={[styles.badgeText, { color: colors.textLight }]}>{badge}</Text>
            </View>
          )}
        </View>
      )}
      {subtitle && <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{subtitle}</Text>}
      {children}
    </Container>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginVertical: 6,
    marginHorizontal: 2,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    fontSize: 20,
    marginRight: 8,
  },
  title: {
    fontSize: SIZES.lg,
    fontWeight: '600',
    flex: 1,
  },
  subtitle: {
    fontSize: SIZES.sm,
    marginTop: 4,
  },
  badge: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  badgeText: {
    fontSize: SIZES.xs,
    fontWeight: '600',
  },
});

export default Card;
