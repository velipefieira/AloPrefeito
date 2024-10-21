import { useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useAsyncStorage = () => {
  const [value, setValue] = useState<any>('');

  const setItem = (key: string, value:string) => {
    AsyncStorage.setItem(key, value);
    setValue(value);
  };

  const getItem = (key: string) => {
    const value = AsyncStorage.getItem(key);
    setValue(value);
    return value;
  };

  const removeItem = (key: string) => {
    AsyncStorage.removeItem(key);
    setValue('');
  };

  return { value, setItem, getItem, removeItem };
};