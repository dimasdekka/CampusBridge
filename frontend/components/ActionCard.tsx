import React from 'react';
import { TouchableOpacity, Text, View, Dimensions } from 'react-native';
import { Link } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import type { Href } from 'expo-router';

type ActionCardProps = {
  href: Href;
  iconName: keyof typeof MaterialIcons.glyphMap;
  title: string;
  description: string;
  gradientStart: string;
  gradientEnd: string;
};

const ActionCard: React.FC<ActionCardProps> = ({
  href,
  iconName,
  title,
  description,
  gradientStart,
  gradientEnd,
}) => {
  return (
    <Link href={href} asChild>
      <TouchableOpacity
        style={{
          backgroundColor: gradientStart,
          borderRadius: 12,
          overflow: 'hidden',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
          width: '48%', // atau 48% manual
          height: 160,
          marginHorizontal: 4,
          position: 'relative',
        }}
      >
        {/* Circle dekorasi */}
        <View
          style={{
            position: 'absolute',
            right: -10,
            bottom: -10,
            width: 60,
            height: 60,
            borderRadius: 30,
            backgroundColor: gradientEnd,
            opacity: 0.5,
          }}
        />
        <View
          style={{
            position: 'absolute',
            right: -8,
            top: -15,
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: gradientEnd,
            opacity: 0.4,
          }}
        />

        {/* Isi kartu */}
        <View className="p-2 flex-1 justify-between">
          <View>
            <View className="bg-white/20 w-9 h-9 rounded-full items-center justify-center mb-1.5">
              <MaterialIcons name={iconName} size={18} color="white" />
            </View>
            <Text className="text-white text-sm font-semibold">{title}</Text>
            <Text className="text-white/80 text-xs">{description}</Text>
          </View>

          <View className="flex-row items-center justify-end mt-1">
            <Text className="text-white mr-1 text-xs">Go</Text>
            <MaterialIcons name="arrow-forward" size={14} color="white" />
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );
};

const ActionCards: React.FC = () => {
  return (
    <View
      style={{
        flexDirection: 'row',
        paddingHorizontal: 12,
        marginVertical: 12,
        justifyContent: 'space-between',
      }}
    >
      <ActionCard
        href={'/consultation/schedule' as Href}
        iconName="calendar-today"
        title="Book Supervision"
        description="Schedule session"
        gradientStart="#3B82F6"
        gradientEnd="#1E40AF"
      />
      <ActionCard
        href={'/(app)/(authenticated)/(modal)/create-chat' as Href}
        iconName="chat"
        title="Make a Group"
        description="Student groups"
        gradientStart="#8B5CF6"
        gradientEnd="#6D28D9"
      />
    </View>
  );
};

export default ActionCards;
