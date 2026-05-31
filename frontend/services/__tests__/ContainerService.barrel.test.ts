import ContainerManager from "@/services/ContainerService";

describe("ContainerManager barrel summary text", () => {
  it("omits price for barrel with delivery", () => {
    const cm = new ContainerManager();
    cm.addContainer("barrel", 2);
    cm.updateContainerDeliveryPrice("barrel", 30);
    const text = cm.generateSummaryText(true);
    expect(text).toContain("ถัง + ค่าส่ง");
    expect(text).toContain("(30)x2");
    expect(text).toContain("=60");
    expect(text).not.toContain("0+30");
  });

  it("omits price line for barrel without delivery", () => {
    const cm = new ContainerManager();
    cm.addContainer("barrel", 3);
    const text = cm.generateSummaryText(true);
    expect(text).toContain("ถัง");
    expect(text).toContain("x3");
    expect(text).not.toContain("0x3");
    expect(text).not.toContain("=0");
  });

  it("keeps existing format for priced containers", () => {
    const cm = new ContainerManager();
    cm.addContainer("foam_small", 1); // price 65
    const text = cm.generateSummaryText(true);
    expect(text).toContain("65x1");
    expect(text).toContain("=65");
  });
});
