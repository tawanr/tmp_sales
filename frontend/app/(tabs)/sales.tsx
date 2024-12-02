import { Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import { getProducts } from '@/services/ProductService';
import { ListResult, RecordModel } from 'pocketbase';
import ProductList from '@/components/ProductList';

export default function Sales() {
  return (
    <SafeAreaProvider>
      <ProductList rowCount={2} />
    </SafeAreaProvider>
  );
}