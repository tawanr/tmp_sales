/**
 * Container Management Service
 * Handles container selection, calculation, and state management
 */

import {
  ContainerSelection,
  ContainerSpec,
  ContainerSummary,
  CONTAINER_SPECS,
  calculateContainerSummary,
  createContainerSelection,
  createLegacyContainerSelection,
} from "@/types/container";

export class ContainerManager {
  private selections: Map<string, ContainerSelection> = new Map();

  /**
   * Add or update container selection
   */
  addContainer(specId: string, quantity: number = 1): void {
    const spec = CONTAINER_SPECS[specId];
    if (!spec) {
      throw new Error(`Container spec not found: ${specId}`);
    }

    const existingSelection = this.selections.get(specId);
    if (existingSelection) {
      this.updateContainerQuantity(
        specId,
        existingSelection.quantity + quantity
      );
    } else {
      const selection = createContainerSelection(spec, quantity);
      this.selections.set(specId, selection);
    }
  }

  /**
   * Remove container selection
   */
  removeContainer(specId: string): void {
    this.selections.delete(specId);
  }

  /**
   * Update container quantity
   */
  updateContainerQuantity(specId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeContainer(specId);
      return;
    }

    const selection = this.selections.get(specId);
    if (selection) {
      const updatedSelection: ContainerSelection = {
        ...selection,
        quantity,
        totalPrice: selection.spec.price * quantity,
      };
      this.selections.set(specId, updatedSelection);
    }
  }

  /**
   * Update delivery price per container for a specific container type
   */
  updateContainerDeliveryPrice(specId: string, deliveryPrice: number): void {
    const selection = this.selections.get(specId);
    if (selection) {
      const updatedSelection: ContainerSelection = {
        ...selection,
        deliveryPrice: deliveryPrice > 0 ? deliveryPrice : undefined,
      };
      this.selections.set(specId, updatedSelection);
    }
  }

  /**
   * Get container selection by spec ID
   */
  getContainer(specId: string): ContainerSelection | undefined {
    return this.selections.get(specId);
  }

  /**
   * Get all container selections
   */
  getAllContainers(): ContainerSelection[] {
    return Array.from(this.selections.values());
  }

  /**
   * Get container summary
   */
  getSummary(): ContainerSummary {
    return calculateContainerSummary(this.getAllContainers());
  }

  /**
   * Clear all containers
   */
  clear(): void {
    this.selections.clear();
  }

  /**
   * Check if any containers are selected
   */
  isEmpty(): boolean {
    return this.selections.size === 0;
  }

  /**
   * Get total container count
   */
  getTotalQuantity(): number {
    return this.getSummary().totalQuantity;
  }

  /**
   * Get total container price
   */
  getTotalPrice(): number {
    return this.getSummary().totalPrice;
  }

  /**
   * Get total delivery price of all containers
   */
  getTotalDeliveryPrice(): number {
    return this.getSummary().totalDeliveryPrice;
  }

  /**
   * Migrate from legacy package type system
   */
  migrateLegacySelection(packageType: boolean, containerCount: number): void {
    this.clear();
    if (containerCount > 0) {
      const selection = createLegacyContainerSelection(
        packageType,
        containerCount
      );
      const specId = packageType ? "black_bag_medium" : "foam_medium";
      this.selections.set(specId, selection);
    }
  }

  /**
   * Serialize container selections for storage
   */
  serialize(): object {
    const serialized: Record<string, { specId: string; quantity: number }> = {};
    this.selections.forEach((selection, specId) => {
      serialized[specId] = {
        specId,
        quantity: selection.quantity,
      };
    });
    return serialized;
  }

  /**
   * Deserialize container selections from storage
   */
  deserialize(data: any): void {
    this.clear();
    if (data && typeof data === "object") {
      Object.entries(data).forEach(([specId, config]: [string, any]) => {
        if (
          config &&
          typeof config.quantity === "number" &&
          config.quantity > 0
        ) {
          this.addContainer(specId, config.quantity);
        }
      });
    }
  }

  /**
   * Generate container text for order summary
   */
  generateSummaryText(includeDetails: boolean = true): string {
    if (this.isEmpty()) {
      return "";
    }

    const selections = this.getAllContainers();
    const summary = this.getSummary();
    let text = "";

    if (includeDetails) {
      selections.forEach((selection) => {
        const { spec, quantity, totalPrice } = selection;
        if (selection.deliveryPrice) {
          text += `${spec.name} (${spec.price} + ${
            selection.deliveryPrice
          }) x ${quantity} = ${
            totalPrice + selection.deliveryPrice * selection.quantity
          }\n`;
        } else {
          text += `${spec.name} ${spec.price} x ${quantity} = ${totalPrice}\n`;
        }
        text += `\n`;
      });
    } else {
      text += `ค่าบรรจุภัณฑ์ ${summary.totalQuantity} ใบ\n`;
    }

    // if (selections.length > 1 || includeDetails) {
    //   text += `= ${summary.totalPrice + summary.totalDeliveryPrice}\n\n`;
    // }

    return text;
  }

  /**
   * Auto-suggest containers based on total weight
   */
  autoSuggestContainers(totalWeight: number): ContainerSelection[] {
    const suggestions: ContainerSelection[] = [];
    let remainingWeight = totalWeight;

    // Strategy: Use most efficient container sizes first
    const sortedSpecs = Object.values(CONTAINER_SPECS)
      .filter((spec) => spec.capacity && spec.capacity > 0)
      .sort((a, b) => (b.capacity || 0) - (a.capacity || 0)); // Largest first

    for (const spec of sortedSpecs) {
      if (remainingWeight <= 0) break;

      const capacity = spec.capacity || 0;
      if (capacity > 0 && remainingWeight >= capacity * 0.7) {
        // Use if at least 70% capacity
        const quantity = Math.ceil(remainingWeight / capacity);
        suggestions.push(createContainerSelection(spec, quantity));
        remainingWeight -= capacity * quantity;
      }
    }

    // If still have remaining weight, add a medium container
    if (remainingWeight > 0) {
      suggestions.push(
        createContainerSelection(CONTAINER_SPECS["foam_medium"], 1)
      );
    }

    return suggestions;
  }
}

export default ContainerManager;
