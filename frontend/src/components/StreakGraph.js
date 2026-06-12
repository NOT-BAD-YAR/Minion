import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import api from '../services/api';

export default function StreakGraph({ taskId }) {
  const [streakData, setStreakData] = useState(new Map());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStreak();
  }, [taskId]);

  const fetchStreak = async () => {
    try {
      const res = await api.get(`/daily/${taskId}/streak`);
      
      const extract = (r) => {
        if (!r) return [];
        if (Array.isArray(r)) return r;
        if (Array.isArray(r.data)) return r.data;
        if (r.data && Array.isArray(r.data.data)) return r.data.data;
        if (typeof r === 'object' && r !== null) {
          for (const key in r) {
            if (Array.isArray(r[key])) return r[key];
          }
        }
        return [];
      };

      const data = extract(res);
      
      // We want to create a Map of date -> is_completed for quick lookup
      const dataMap = new Map();
      data.forEach(item => {
        const dateStr = new Date(item.date).toISOString().split('T')[0];
        dataMap.set(dateStr, item.is_completed);
      });

      setStreakData(dataMap);
    } catch (error) {
      console.error('Failed to fetch streak data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Generate the last 364 days (52 weeks * 7 days)
  const generateDays = () => {
    const days = [];
    const today = new Date();
    // Start from 364 days ago
    for (let i = 364; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      days.push({
        date: dateStr,
        isCompleted: streakData.get(dateStr) || false
      });
    }
    return days;
  };

  if (isLoading) {
    return <View className="h-20 justify-center"><Text className="text-base-content/40 text-center text-xs">Loading streak...</Text></View>;
  }

  const days = generateDays();

  // We want to render a grid that scrolls horizontally. 
  // Native React Native doesn't have CSS Grid, so we'll use a flex column of rows or flex row with wrap.
  // Actually, standard GitHub graphs are 52 columns of 7 rows.
  // We can group days by week (chunks of 7) to render columns.
  
  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  return (
    <View className="mt-2 pt-2 border-t border-base-300">
      <Text className="text-xs font-semibold text-base-content/60 mb-2">Yearly Consistency</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 10 }}>
        <View style={{ flexDirection: 'row' }}>
          {weeks.map((week, weekIndex) => (
            <View key={weekIndex} style={{ flexDirection: 'column', marginRight: 4 }}>
              {week.map((day, dayIndex) => (
                <View 
                  key={day.date} 
                  className={day.isCompleted ? 'bg-primary' : 'bg-base-300'}
                  style={{ 
                    width: 12, 
                    height: 12, 
                    borderRadius: 2, 
                    marginBottom: 4,
                    opacity: day.isCompleted ? 1 : 0.4
                  }}
                  title={day.date}
                />
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
