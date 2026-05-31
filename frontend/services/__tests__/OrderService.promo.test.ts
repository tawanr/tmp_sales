// pb is loaded at module-init by OrderService's transitive imports and pulls in
// native modules; generateOrderSummary never uses it, so mock it away.
jest.mock("@/utils/pocketbase", () => ({
  __esModule: true,
  default: {},
  pb: {},
}));

import {
  generateOrderSummary,
  createEmptyCustomer,
  OrderItem,
  DeliveryDetails,
  OrderOptions,
} from "@/services/OrderService";
import ContainerManager from "@/services/ContainerService";

function makeOrders(price: number, kg: number, count: number) {
  const product = {
    id: "p1",
    label: "สินค้า",
    price,
    image: "",
    kg,
    unit: "ชิ้น",
    lotNumber: "L1",
  };
  return new Map<string, OrderItem>([["p1", { product, count }]]);
}

const deliver: DeliveryDetails = {
  isDeliver: true,
  deliveryCost: 0,
  containerCount: 0,
  productLocation: "",
};

const optionsPromoOn: OrderOptions = {
  isWithoutDetails: true,
  orderType: false,
  packageType: false,
  promoDeliveryDiscount: true,
};

describe("generateOrderSummary delivery promo", () => {
  it("applies -50 when products > 5000 and promo on (no containers)", () => {
    const summary = generateOrderSummary(
      makeOrders(600, 1, 10), // 6000
      createEmptyCustomer(),
      deliver,
      optionsPromoOn,
      new ContainerManager()
    );
    expect(summary).toContain("TMP ช่วยค่าส่ง 50 บาท");
    expect(summary).toContain("ยอดโอน 5,950 บาท");
  });

  it("does not apply at exactly 5000 (strict > threshold)", () => {
    const summary = generateOrderSummary(
      makeOrders(500, 1, 10), // 5000
      createEmptyCustomer(),
      deliver,
      optionsPromoOn,
      new ContainerManager()
    );
    expect(summary).not.toContain("TMP ช่วยค่าส่ง");
    expect(summary).toContain("ยอดโอน 5,000 บาท");
  });

  it("does not apply when promo toggle is off", () => {
    const summary = generateOrderSummary(
      makeOrders(600, 1, 10), // 6000
      createEmptyCustomer(),
      deliver,
      { ...optionsPromoOn, promoDeliveryDiscount: false },
      new ContainerManager()
    );
    expect(summary).not.toContain("TMP ช่วยค่าส่ง");
    expect(summary).toContain("ยอดโอน 6,000 บาท");
  });

  it("applies for pay-on-delivery (no delivery fee) when products > 5000", () => {
    const cm = new ContainerManager();
    cm.addContainer("foam_small", 1); // price 65, no deliveryPrice => totalDeliveryPrice 0
    const summary = generateOrderSummary(
      makeOrders(600, 1, 10), // 6000
      createEmptyCustomer(),
      deliver,
      optionsPromoOn,
      cm
    );
    expect(summary).toContain("ค่าส่ง = จ่ายปลายทาง");
    expect(summary).toContain("TMP ช่วยค่าส่ง 50 บาท");
    // 6000 + 65 container - 50 promo = 6015
    expect(summary).toContain("ยอดโอน 6,015 บาท");
  });

  it("does not apply on non-delivery orders", () => {
    const summary = generateOrderSummary(
      makeOrders(600, 1, 10), // 6000
      createEmptyCustomer(),
      { ...deliver, isDeliver: false },
      optionsPromoOn,
      new ContainerManager()
    );
    expect(summary).not.toContain("TMP ช่วยค่าส่ง");
    expect(summary).toContain("ยอดโอน 6,000 บาท");
  });

  it("subtracts full 50 with no cap when delivery fee < 50", () => {
    const cm = new ContainerManager();
    cm.addContainer("foam_small", 1); // price 65
    cm.updateContainerDeliveryPrice("foam_small", 20); // fee 20
    const summary = generateOrderSummary(
      makeOrders(600, 1, 10), // 6000
      createEmptyCustomer(),
      deliver,
      optionsPromoOn,
      cm
    );
    expect(summary).toContain("TMP ช่วยค่าส่ง 50 บาท");
    // 6000 + 65 container + 20 fee - 50 promo = 6035
    expect(summary).toContain("ยอดโอน 6,035 บาท");
  });
});
