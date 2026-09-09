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

const noDeliver: DeliveryDetails = {
  isDeliver: false,
  deliveryCost: 0,
  containerCount: 0,
  productLocation: "",
};

const options: OrderOptions = {
  isWithoutDetails: true,
  orderType: false,
  packageType: false,
  promoDeliveryDiscount: false,
};

describe("generateOrderSummary discount", () => {
  it("has no effect when discountAmount is omitted", () => {
    const summary = generateOrderSummary(
      makeOrders(100, 1, 10), // 1000
      createEmptyCustomer(),
      deliver,
      options,
      new ContainerManager()
    );
    expect(summary).not.toContain("ส่วนลด");
    expect(summary).toContain("ยอดโอน 1,000 บาท");
  });

  it("subtracts a positive flat discount from the grand total and shows the line", () => {
    const summary = generateOrderSummary(
      makeOrders(100, 1, 10), // 1000
      createEmptyCustomer(),
      deliver,
      options,
      new ContainerManager(),
      100
    );
    expect(summary).toContain("ส่วนลด 100 บาท");
    expect(summary).toContain("ยอดโอน 900 บาท");
  });

  it("applies after delivery cost and existing delivery promo", () => {
    const promoOptions: OrderOptions = { ...options, promoDeliveryDiscount: true };
    const cm = new ContainerManager();
    cm.addContainer("foam_small", 1); // price 65
    const summary = generateOrderSummary(
      makeOrders(600, 1, 10), // 6000, > 5000 promo threshold
      createEmptyCustomer(),
      deliver,
      promoOptions,
      cm,
      100
    );
    expect(summary).toContain("TMP ช่วยค่าส่ง 50 บาท");
    expect(summary).toContain("ส่วนลด 100 บาท");
    // 6000 + 65 container - 50 promo - 100 discount = 5915
    expect(summary).toContain("ยอดโอน 5,915 บาท");
  });

  it("applies on non-delivery orders too", () => {
    const summary = generateOrderSummary(
      makeOrders(100, 1, 10), // 1000
      createEmptyCustomer(),
      noDeliver,
      options,
      new ContainerManager(),
      50
    );
    expect(summary).toContain("ส่วนลด 50 บาท");
    expect(summary).toContain("ยอดโอน 950 บาท");
  });

  it("ignores a zero discount amount", () => {
    const summary = generateOrderSummary(
      makeOrders(100, 1, 10), // 1000
      createEmptyCustomer(),
      deliver,
      options,
      new ContainerManager(),
      0
    );
    expect(summary).not.toContain("ส่วนลด");
    expect(summary).toContain("ยอดโอน 1,000 บาท");
  });

  it("ignores a negative discount amount", () => {
    const summary = generateOrderSummary(
      makeOrders(100, 1, 10), // 1000
      createEmptyCustomer(),
      deliver,
      options,
      new ContainerManager(),
      -50
    );
    expect(summary).not.toContain("ส่วนลด");
    expect(summary).toContain("ยอดโอน 1,000 บาท");
  });
});
