import { SafeAreaProvider } from "react-native-safe-area-context";
import ProductList from "@/components/ProductList";

export default function Sales() {
  return (
    <SafeAreaProvider>
      <ProductList columnCount={3} />
    </SafeAreaProvider>
  );
}
