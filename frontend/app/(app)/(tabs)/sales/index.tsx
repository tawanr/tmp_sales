import { SafeAreaProvider } from "react-native-safe-area-context";
import ProductList from "@/components/ProductList";

export default function Sales() {
  const columnCount = 4;
  return (
    <SafeAreaProvider>
      <ProductList columnCount={columnCount} key={columnCount} />
    </SafeAreaProvider>
  );
}
