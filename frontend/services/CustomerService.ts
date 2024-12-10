import { CustomerForm } from "@/components/CustomerForm";
import pb from "@/utils/pocketbase";
import { useOrderStore } from "./OrderService";

export type Customer = {
  id: string;
  name: string;
  address: string;
  phone: string;
  deliveryService: string;
  deliveryNote: string;
  carRegistration: string;
};

export async function getCustomers(search: string = ""): Promise<Customer[]> {
  let filters = {};
  if (search) {
    filters = {
      filter: `name ~ '${search}' || phone ~ '${search}' || address ~ '${search}'`,
    };
  }
  const customers = await pb
    .collection("customers")
    .getList<Customer>(1, 10, filters);
  return customers.items;
}

export async function createCustomer(customer: CustomerForm): Promise<string> {
  const newCustomer = await pb.collection("customers").create(customer);
  return newCustomer.id;
}
